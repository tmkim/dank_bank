# from django.db import models
# from django.shortcuts import render
from django.core.files.base import ContentFile
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import action, api_view #, action
from rest_framework.reverse import reverse
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
from .models import Image, Item #, Tag, Tag2Item, Image
from .serializers import ImageSerializer, ItemSerializer
import boto3
# , DiningSerializer, FoodSerializer, MusicSerializer, TravelSerializer, TagSerializer, Tag2ItemSerializer, ImageSerializer
# from rest_framework import status
# from rest_framework.response import Response

#AWS S3
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.core.files.storage import default_storage
from django.conf import settings  
# from django.core.files.base import ContentFile

# import logging

# logger = logging.getLogger(__name__)

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile

s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION)

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()  # Define your queryset (all images)
    serializer_class = ImageSerializer  # Use your Image serializer

    def get_queryset(self):
        queryset = Image.objects.all()  # Start with all entries
        item_id = self.request.query_params.get('item', None)
        if item_id is not None:
            queryset = queryset.filter(item_id=item_id)  # Filter by item_id
        return queryset

    def create(self, request, *args, **kwargs):
        files = request.FILES.getlist("files")
        image_data = []

        try:
            # Bulk creation of images
            images_to_create = []
            for index, file in enumerate(files):
                item = request.data.get("item")
                if not item:
                    raise ValidationError(f"Item ID is required for file {index}.")
                
                name = request.data.get(f"name_{index}", "").strip()
                description = request.data.get(f"description_{index}", "").strip()
                
                # Basic validation
                if not name:
                    raise ValidationError(f"File {index} is missing a name.")

                # Rename the file if the name is updated
                if name != file.name:
                    file_content = file.read()  # Read the file content
                    file.seek(0)  # Reset file pointer for re-use
                    file = ContentFile(file_content, name=name)  # Recreate file with new name
                
                # Ensure item is valid (e.g., checking for existence in DB if needed)
                # Assuming item is an ID, you can use an Item model or foreign key validation if needed
                item_instance = Item.objects.get(id=item)  # Add validation as needed
                
                # Create image object
                image = Image(item=item_instance, file=file, name=name, description=description)
                images_to_create.append(image)

            # Bulk create images
            Image.objects.bulk_create(images_to_create)

            # Prepare image data to return
            image_data = [{
                "id": image.id,
                "item_id": image.item.id,  # Access the actual item ID
                "url": image.file.url,  # URL of the file
                "name": image.name,
                "description": image.description,
            } for image in images_to_create]

            return Response({"images": image_data}, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An unexpected error occurred: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        image = self.get_object()
        file_url = image.file.url

        try:
            # Extract the file name from the URL (e.g., images/filename.jpg)
            file_name = file_url.split('/')[-1]
            
            # Delete the file from the S3 bucket
            s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=f'images/{file_name}')
            print(f"Deleted {file_name} from S3")

            # Now delete the image record from the database
            image.delete()

            # Return a success response
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            # If something goes wrong (e.g., file doesn't exist in S3), handle the error
            print(f"Error deleting from S3: {e}")
            return Response({"detail": "Failed to delete the image from S3"}, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'item': reverse('item-list', request=request, format=format),
        # 'dining': reverse('dining-list', request=request, format=format),
        # 'foods': reverse('foods-list', request=request, format=format),
        # 'music': reverse('music-list', request=request, format=format),
        # 'travel': reverse('travel-list', request=request, format=format),
        # 'tags': reverse('tag-list', request=request, format=format),
        # 'tag2item': reverse('tag2item-list', request=request, format=format),
        # 'images': reverse('images-list', request=request, format=format),
    })

"""
This ViewSet automatically provides `list`, `create`, `retrieve`,
`update` and `destroy` actions.

Can add this later 
# permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
"""
class ItemPagination(PageNumberPagination):
    page_size_query_param = 'limit'  # Allow `limit` parameter for page size
    max_page_size = 100  # Optional: Set a maximum limit

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    pagination_class = ItemPagination

    @action(detail=False, methods=['delete'])
    def delete_multiple(self, request):
        item_ids = request.data.get('item_ids', [])
        
        if not item_ids:
            return Response({'error': 'No items selected for deletion'}, status=status.HTTP_400_BAD_REQUEST)

        # Delete items and their associated images
        items = Item.objects.filter(id__in=item_ids)
        for item in items:
            images = Image.objects.filter(item=item)
            for image in images:
                s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=image.file.name)
                image.delete()  # Delete image record from database
            item.delete()  # Delete item record from database

        return Response({'message': 'Items and associated images deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        """Override the default queryset to include filtering by query."""
        queryset = self.queryset
        query = self.request.query_params.get('query', '')
        if query:
            queryset = queryset.filter(name__icontains=query)
        
        categories = self.request.query_params.getlist('category', None)  
        if categories:
            queryset = queryset.filter(category__in=categories)            

        return queryset
    
        # Override the create method
    def create(self, request, *args, **kwargs):
        # logger.debug("Received data: %s", request.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # This triggers validation
        self.perform_create(serializer)  # Save the object
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        # Add any additional custom save logic here
        serializer.save()

    def delete_items(request):
        try:
            # Retrieve the list of IDs from the request
            item_ids = request.json().get('ids', [])

            if not item_ids:
                return JsonResponse({'error': 'No item IDs provided.'}, status=400)

            # Get all the items and their associated images
            items = Item.objects.filter(id__in=item_ids)
            
            if not items.exists():
                return JsonResponse({'error': 'Items not found.'}, status=404)

            for item in items:
                # Delete associated images from S3
                images = Image.objects.filter(item=item)
                for image in images:
                    s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=image.file.name)
                    image.delete()  # Delete image record from the database
                
                # Delete the item
                item.delete()

            return JsonResponse({'message': 'Items and associated images deleted successfully.'}, status=204)

        except ObjectDoesNotExist:
            return JsonResponse({'error': 'One or more items not found.'}, status=404)

        except Exception as e:
            # Handle unexpected errors
            return JsonResponse({'error': str(e)}, status=500)
        
    
    
# class DiningViewSet(viewsets.ModelViewSet):
#     queryset = Item.objects.filter(category='Dining')
#     serializer_class = DiningSerializer

# class FoodViewSet(viewsets.ModelViewSet):
#     queryset = Item.objects.filter(category='Food')
#     serializer_class = FoodSerializer

# class MusicViewSet(viewsets.ModelViewSet):
#     queryset = Item.objects.filter(category='Music')
#     serializer_class = MusicSerializer

# class TravelViewSet(viewsets.ModelViewSet):
#     queryset = Item.objects.filter(category='Travel')
#     serializer_class = TravelSerializer

# class TagViewSet(viewsets.ModelViewSet):
#     queryset = Tag.objects.all()
#     serializer_class = TagSerializer

# class Tag2ItemViewSet(viewsets.ModelViewSet):
#     queryset = Tag2Item.objects.all()
#     serializer_class = Tag2ItemSerializer

# class ImageViewSet(viewsets.ModelViewSet):
#     queryset = Image.objects.all()
#     serializer_class = ImageSerializer

# from django.db import models
# from django.shortcuts import render
from django.core.files.base import ContentFile
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.decorators import api_view #, action
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

from django.core.exceptions import ValidationError
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

    def delete_item(request, item_id):
        try:
            item = Item.objects.get(id=item_id)
            
            # Delete images from S3
            images = Image.objects.filter(item=item)
            for image in images:
                s3.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=image.file.name)
                image.delete()  # Delete image record from database

            # Delete the item
            item.delete()

            return JsonResponse({'message': 'Item and associated images deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

        except Item.DoesNotExist:
            return JsonResponse({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)
    
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

from .models import Item, Tag, Tag2Item, Image, Image2Item
from .serializers import ItemSerializer
# , DiningSerializer, FoodSerializer, MusicSerializer, TravelSerializer, TagSerializer, Tag2ItemSerializer, ImageSerializer, Image2ItemSerializer
from django.db import models
from django.shortcuts import render
from rest_framework import viewsets
# from rest_framework import status
from rest_framework.decorators import action, api_view
# from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.pagination import PageNumberPagination

#AWS S3
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings  

import logging

logger = logging.getLogger(__name__)

from django.core.exceptions import ValidationError

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        try:
            uploaded_file = request.FILES['file']
            file_name = uploaded_file.name
            # logger.debug(f"Received file: {file_name}")

            file_path = default_storage.save(file_name, ContentFile(uploaded_file.read()))
            # logger.debug(f"File saved to: {file_path}")

            file_url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{file_path}"
            # logger.debug(f"File URL: {file_url}")

            return Response({"file_url": file_url}, status=status.HTTP_201_CREATED)

        except ValidationError as e:
            # logger.error(f"Validation error: {str(e)}")
            return Response({"error": "Validation error"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # logger.error(f"Error uploading file: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# Create your views here.
# import logging

# logger = logging.getLogger(__name__)

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'item': reverse('item-list', request=request, format=format),
        'dining': reverse('dining-list', request=request, format=format),
        'foods': reverse('foods-list', request=request, format=format),
        'music': reverse('music-list', request=request, format=format),
        'travel': reverse('travel-list', request=request, format=format),
        'tags': reverse('tag-list', request=request, format=format),
        'tag2item': reverse('tag2item-list', request=request, format=format),
        'images': reverse('images-list', request=request, format=format),
        'image2item': reverse('image2item-list', request=request, format=format),
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

# class Image2ItemViewSet(viewsets.ModelViewSet):
#     queryset = Image2Item.objects.all()
#     serializer_class = Image2ItemSerializer
# from django.db import models
# from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view #, action
from rest_framework.reverse import reverse
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
from .models import Image, Image2Item, Item #, Tag, Tag2Item, Image, Image2Item
from .serializers import Image2ItemSerializer, ImageUploadSerializer, ItemSerializer
# , DiningSerializer, FoodSerializer, MusicSerializer, TravelSerializer, TagSerializer, Tag2ItemSerializer, ImageSerializer, Image2ItemSerializer
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

class ImageUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("files")
        image_data = []

        for index, file in enumerate(files):
            name = file.name 
            description = request.data.get(f"description_{index}", "")

            # Create the Image instance
            image = Image.objects.create(file=file, name=name, description=description)
            image_data.append({
                "id": image.id,
                "url": image.file.url,  # URL of the file stored in S3
                "name": image.name,  # Automatically set as file name
                "description": image.description,
            })

        return Response({"images": image_data}, status=status.HTTP_201_CREATED)


class Image2ItemCreateView(generics.CreateAPIView):
    queryset = Image2Item.objects.all()
    serializer_class = Image2ItemSerializer

class Image2ItemDeleteView(generics.DestroyAPIView):
    queryset = Image2Item.objects.all()
    serializer_class = Image2ItemSerializer

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
        # 'image2item': reverse('image2item-list', request=request, format=format),
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
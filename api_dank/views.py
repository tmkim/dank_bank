from .models import Item, Tag, Tag2Item, Image, Image2Item
from .serializers import ItemSerializer, DiningSerializer, FoodSerializer, MusicSerializer, TravelSerializer, TagSerializer, Tag2ItemSerializer, ImageSerializer, Image2ItemSerializer
from django.db import models
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
# Create your views here.

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
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class DiningViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.filter(category='Dining')
    serializer_class = DiningSerializer

class FoodViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.filter(category='Food')
    serializer_class = FoodSerializer

class MusicViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.filter(category='Music')
    serializer_class = MusicSerializer

class TravelViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.filter(category='Travel')
    serializer_class = TravelSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class Tag2ItemViewSet(viewsets.ModelViewSet):
    queryset = Tag2Item.objects.all()
    serializer_class = Tag2ItemSerializer

class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

class Image2ItemViewSet(viewsets.ModelViewSet):
    queryset = Image2Item.objects.all()
    serializer_class = Image2ItemSerializer
from .models import Restaurant, RestaurantFood, Music, Travel, Tag, Tag2Item, Image, Image2Item
from .serializers import RestaurantSerializer, RestaurantFoodSerializer, MusicSerializer
from .serializers import TravelSerializer, TagSerializer, Tag2ItemSerializer, ImageSerializer, Image2ItemSerializer
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
        'restaurants': reverse('restaurant-list', request=request, format=format),
        'restaurantfoods': reverse('restaurantfoods-list', request=request, format=format),
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
class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class RestaurantFoodViewSet(viewsets.ModelViewSet):
    queryset = RestaurantFood.objects.all()
    serializer_class = RestaurantFoodSerializer

class MusicViewSet(viewsets.ModelViewSet):
    queryset = Music.objects.all()
    serializer_class = MusicSerializer

class TravelViewSet(viewsets.ModelViewSet):
    queryset = Travel.objects.all()
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
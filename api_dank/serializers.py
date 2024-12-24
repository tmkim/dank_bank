from rest_framework import serializers
from .models import Restaurant, RestaurantFood, Music, Travel, Tag, Tag2Item, Image, Image2Item
from django.contrib.auth.models import User

# class RestaurantSerializer(serializers.HyperlinkedModelSerializer):
class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'area', 'price', 'cuisine', 'review', 'rating'] 

class RestaurantFoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = RestaurantFood
        fields = ['id', 'restaurant', 'name', 'price', 'description', 'review', 'rating'] 

class MusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Music
        fields = ['id', 'name', 'artist', 'songUrl', 'urlType', 'genre', 'review', 'rating'] 

class TravelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Travel
        fields = ['id', 'name', 'location', 'area', 'website', 'review', 'rating'] 

class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ['id', 'name'] 

class Tag2ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag2Item
        fields = ['id', 'restaurant_id', 'rfood_id', 'music_id', 'travel_id'] 

class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = ['id', 'name', 'imgUrl', 'description'] 

class Image2ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image2Item
        fields = ['id', 'image_id', 'restaurant_id', 'rfood_id', 'music_id', 'travel_id'] 


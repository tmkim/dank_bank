from rest_framework import serializers
from .models import Restaurant, RestaurantFood, Music, Travel, Tag, Tag2Entry
from django.contrib.auth.models import User

# class RestaurantSerializer(serializers.HyperlinkedModelSerializer):
class RestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'location', 'price', 'cuisine', 'rating', 'notes'] 

class RestaurantFoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = RestaurantFood
        fields = ['id', 'name', 'restaurant', 'price', 'description', 'review', 'rating'] 

class MusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Music
        fields = ['id', 'song', 'artist', 'songUrl', 'urlType', 'genre', 'rating'] 

class TravelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Travel
        fields = ['id', 'name', 'location', 'country', 'citystate', 'photos', 'rating'] 

class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ['id', 'name'] 

class Tag2EntrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag2Entry
        fields = ['id', 'restaurant_id', 'rfood_id', 'music_id', 'travel_id'] 
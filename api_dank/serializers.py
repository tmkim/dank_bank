from rest_framework import serializers
from .models import Item, Tag, Tag2Item, Image, Image2Item
from django.contrib.auth.models import User

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'category', 'name', 'review', 'rating', 'item_url', 'location', 'address', 'gmap_url', 'item_url',  'price_range', 'cuisine', 'cost', 'music_source', 'artist']

# class DiningSerializer(serializers.HyperlinkedModelSerializer):
class DiningSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'location', 'address', 'gmap_url', 'item_url',  'price_range', 'cuisine', 'review', 'rating'] 

class FoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'location', 'cost', 'review', 'rating'] 

class MusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'artist', 'item_url', 'music_source', 'review', 'rating'] 

class TravelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'location', 'address', 'item_url', 'review', 'rating'] 

class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ['id', 'name'] 

class Tag2ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag2Item
        fields = ['id', 'tag_id', 'item_id'] 

class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = ['id', 'name', 'img_url', 'description'] 

class Image2ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image2Item
        fields = ['id', 'image_id', 'item_id'] 


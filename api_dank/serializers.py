from rest_framework import serializers
from .models import Item, Tag, Tag2Item, Image, Image2Item
from django.contrib.auth.models import User

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'
        # fields = ['id', 'category', 'name', 'review', 'rating', 'item_url', 'location', 'address', 'gmap_url', 'item_url',  'price_range', 'cuisine', 'cost', 'music_source', 'artist']

    def validate_name(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("Entry must have a name")
        return value
    
    def validate_rating(self, value):
        if value == '':
            raise serializers.ValidationError("Entry must have a rating.")
        return value
        
    def validate_review(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("Entry must have a review.")
        return value
    
    def validate(self, data):
        if data['category'] == '':
            raise serializers.ValidationError("Entry must have a category")
        return data

    
    # def validate(self, data):
    #     if data['category'] == 'Dining' and not data.get('location'):
    #         raise serializers.ValidationError({
    #             'location': "Location is required for the Dining category."
    #         })
    #     return data
    

# class DiningSerializer(serializers.HyperlinkedModelSerializer):
class DiningSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'location', 'address', 'gmap_url', 'item_url',  'price_range', 'cuisine', 'review', 'rating'] 

class FoodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'cuisine', 'location', 'cost', 'review', 'rating'] 

class MusicSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'artist', 'item_url', 'music_source', 'review', 'rating'] 

class TravelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = ['id', 'name', 'location', 'address', 'item_url', 'gmap_url', 'review', 'rating'] 

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


from rest_framework import serializers
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import re
from .models import Item  # Import your model

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'

    # Validate Name: Ensure it's not empty, has a valid length, and no special characters
    def validate_name(self, value):
        value = value.strip()  # Remove extra spaces
        if len(value) < 1:
            raise serializers.ValidationError("Name must be at least 1 characters long.")
        if len(value) > 100:
            raise serializers.ValidationError("Name cannot exceed 100 characters.")
        # if not re.match(r'^[A-Za-z0-9\s\-]+$', value):  # Allow letters, numbers, spaces, and dashes
        #     raise serializers.ValidationError("Name contains invalid characters.")
        return value

    # Validate Rating: Ensure it's a number between 0-5
    def validate_rating(self, value):
        if not isinstance(value, (int, float)):
            raise serializers.ValidationError("Rating must be a number.")
        if not (0 <= value <= 100):
            raise serializers.ValidationError("Rating must be between 0 and 100.")
        return value

    # Validate Review: Ensure minimum length
    def validate_review(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Review must be at least 1 character long.")
        return value.strip()

    # Validate URL Fields: Ensure URLs are valid
    def validate_item_url(self, value):
        url_validator = URLValidator()
        try:
            url_validator(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid URL format.")
        return value

    def validate_gmap_url(self, value):
        url_validator = URLValidator()
        try:
            url_validator(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid Google Maps URL.")
        return value

    # Validate Category: Ensure it's from allowed values
    def validate_category(self, value):
        allowed_categories = ["Dining", "Food", "Music", "Travel", ""]
        if value.lower() not in allowed_categories:
            raise serializers.ValidationError(f"Category must be one of {allowed_categories}.")
        return value.lower()

    # Validate Price Range: Ensure it's from allowed values
    def validate_price_range(self, value):
        allowed_values = ["$", "$$", "$$$", "$$$$", "$$$$$", ""]
        if value and value.lower() not in allowed_values:
            raise serializers.ValidationError(f"Price range must be one of {allowed_values}.")
        return value.lower()
    
    # Validate Music Source: Ensure it's from allowed values
    def validate_music_source(self, value):
        allowed_values = ["Spotify", "SoundCloud", "YouTube", ""]
        if value and value.lower() not in allowed_values:
            raise serializers.ValidationError(f"Music source must be one of {allowed_values}.")
        return value.lower()

    # Validate Cost: Ensure it's a positive number
    def validate_cost(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Cost must be a positive number.")
        return value
    
    # Validate Location: Ensure it is a valid Select option, or includes "Other" for custom location
    def validate_location(self, value):
        if value.startswith("Other"):
            custom_location = value[len("Other:"):]
            if not custom_location.strip():
                raise serializers.ValidationError("Custom location cannot be empty.")
            return custom_location  
    
        from .models import Item  # Import here to avoid circular imports
        valid_locations = Item.objects.filter(category__in=["Dining", "Travel"]).values_list("name", flat=True)
        
        if value not in valid_locations:
            raise serializers.ValidationError("Invalid location selected.")
        
        return value
        
    # Validate Review: Ensure minimum length
    def validate_address(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError("Address must be at least 1 character long.")
        return value.strip()
    
    # Validate Artist: Ensure it's not empty and has a valid length
    def validate_artist(self, value):
        value = value.strip()  # Remove extra spaces
        if len(value) < 1:
            raise serializers.ValidationError("Artist name must be at least 1 characters long.")
        if len(value) > 100:
            raise serializers.ValidationError("Artist name cannot exceed 100 characters.")
        return value
    
    # def validate_cuisine(self, value):
    #     valid_cuisines = Select.objects.filter(select_type__in=["Cuisine"]).values_list("name", flat=True)
    #     if value not in valid_cuisines:
    #         raise serializers.ValidationError("Invalid cuisine selected.")


    # TODO : Cross-Field Validation
    # def validate(self, data):
    #     # Ensure category-based requirements
    #     if data.get("category") == "restaurant" and not data.get("price_range"):
    #         raise serializers.ValidationError("Restaurants must have a price range.")
        
    #     if data.get("category") == "bar" and not data.get("music_source"):
    #         raise serializers.ValidationError("Bars must have a music source.")

    #     # Prevent duplicate items with the same name & location
    #     if Item.objects.filter(name=data["name"], location=data["location"]).exists():
    #         raise serializers.ValidationError("An item with this name already exists at this location.")

    #     return data


# class DiningSerializer(serializers.HyperlinkedModelSerializer):
# class DiningSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Item
#         fields = ['id', 'name', 'location', 'address', 'gmap_url', 'item_url',  'price_range', 'cuisine', 'review', 'rating'] 

# class FoodSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Item
#         fields = ['id', 'name', 'cuisine', 'location', 'cost', 'review', 'rating'] 

# class MusicSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Item
#         fields = ['id', 'name', 'artist', 'item_url', 'music_source', 'review', 'rating'] 

# class TravelSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Item
#         fields = ['id', 'name', 'location', 'address', 'item_url', 'gmap_url', 'review', 'rating'] 

# class TagSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Tag
#         fields = ['id', 'name'] 

# class Tag2ItemSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Tag2Item
#         fields = ['id', 'tag_id', 'item_id'] 

# class ImageSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Image
#         fields = ['id', 'name', 'img_url', 'description'] 

# class Image2ItemSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Image2Item
#         fields = ['id', 'image_id', 'item_id'] 


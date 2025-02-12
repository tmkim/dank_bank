from rest_framework import serializers
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import re
from .models import Image, Image2Item, Item  # Import your model

class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'

    # Validate Category: Ensure it's from allowed values
    def validate_category(self, value):
        allowed_categories = ["Dining", "Food", "Music", "Travel"]
        if value not in allowed_categories:
            raise serializers.ValidationError(f"Category \'{value}\' is not one of {allowed_categories}.")
        return value
    
    # Validate Name: Ensure it's not empty, has a valid length, and no special characters
    def validate_name(self, value):
        value = value.strip()  # Remove extra spaces
        if len(value) < 1:
            raise serializers.ValidationError(f"Name \'{value}\' must be at least 1 characters long.")
        if len(value) > 100:
            raise serializers.ValidationError(f"Name \'{value}\' cannot exceed 100 characters.")
        # if not re.match(r'^[A-Za-z0-9\s\-]+$', value):  # Allow letters, numbers, spaces, and dashes
        #     raise serializers.ValidationError("Name contains invalid characters.")
        return value

    # Validate Rating: Ensure it's a number between 0-5
    def validate_rating(self, value):
        if not isinstance(value, (int, float)):
            raise serializers.ValidationError(f"Rating \'{value}\' must be a number.")
        if not (0 <= value <= 100):
            raise serializers.ValidationError(f"Rating \'{value}\' must be between 0 and 100.")
        return value

    # Validate Review: Ensure minimum length
    def validate_review(self, value):
        if len(value.strip()) < 1:
            raise serializers.ValidationError(f"Review \'{value}\' must be at least 1 character long.")
        return value.strip()

    # Validate URL Fields: Ensure URLs are valid
    def validate_item_url(self, value):
        if value is None or value == "":
            return ""

        if not value.startswith(('http://', 'https://')):
            value = 'https://' + value  # Prepend https:// if no scheme is present
    
        # Validate URL format
        url_validator = URLValidator()
        try:
            url_validator(value)
        except ValidationError:
            raise serializers.ValidationError(f"Invalid Item URL: {value}")

        return value

    def validate_gmap_url(self, value):
        if value is None or value == "":
            return ""
        
        if not value.startswith(('http://', 'https://')):
            value = 'https://' + value  # Prepend https:// if no scheme is present
    
        # Validate URL format
        url_validator = URLValidator()
        try:
            url_validator(value)
        except ValidationError:
            raise serializers.ValidationError(f"Invalid Google Maps URL: {value}")

        # Optionally check if the URL is a Google Maps URL
        # if "google.com/maps" not in value:
        #     raise serializers.ValidationError(f"Invalid Google Maps URL: {value}")

        return value

    # Validate Price Range: Ensure it's from allowed values
    def validate_price_range(self, value):
        if value is None or value == "":
            return ""
        
        allowed_values = ["$", "$$", "$$$", "$$$$", "$$$$$"]
        if value and value not in allowed_values:
            raise serializers.ValidationError(f"Price range \'{value}\' is not one of {allowed_values}.")
        return value
    
    # Validate Music Source: Ensure it's from allowed values
    def validate_music_source(self, value):
        if value is None or value == "":
            return ""
        
        allowed_values = ["Spotify", "SoundCloud", "YouTube"]
        if value and value not in allowed_values:
            raise serializers.ValidationError(f"Music source \'{value}\' must be one of {allowed_values}.")
        return value

    # Validate Cost: Ensure it's a positive number
    def validate_cost(self, value):
        if value is None or value == 0:
            return 0
        
        if value is not None and value < 0:
            raise serializers.ValidationError(f"Cost \'{value}\' must be a positive number.")
        return value
    
    # Validate Location: Ensure it is a valid Select option, or includes "Other" for custom location
    # def validate_location(self, value):
    #     if value.startswith("Other"):
    #         custom_location = value[len("Other:"):]
    #         if not custom_location.strip():
    #             raise serializers.ValidationError(f"Custom location cannot be empty.")
    #         return custom_location  
    
    #     from .models import Item  # Import here to avoid circular imports
    #     valid_locations = Item.objects.filter(category__in=["Dining", "Travel"]).values_list("name", flat=True)
        
    #     if value not in valid_locations:
    #         raise serializers.ValidationError("Invalid location selected.")
        
    #     return value
        
    # Validate Review: Ensure minimum length
    def validate_address(self, value):
        if value is None or value == "":
            return ""
        
        if len(value.strip()) < 1:
            raise serializers.ValidationError(f"Address \'{value}\' must be at least 1 character long.")
        return value.strip()
    
    # Validate Artist: Ensure it's not empty and has a valid length
    def validate_artist(self, value):
        if value == "":
            return value
        
        value = value.strip()  # Remove extra spaces
        if len(value) < 1:
            raise serializers.ValidationError(f"Artist name \'{value}\' must be at least 1 characters long.")
        if len(value) > 100:
            raise serializers.ValidationError(f"Artist name \'{value}\' cannot exceed 100 characters.")
        return value
    
    # def validate_cuisine(self, value):
    #     valid_cuisines = Select.objects.filter(select_type__in=["Cuisine"]).values_list("name", flat=True)
    #     if value not in valid_cuisines:
    #         raise serializers.ValidationError("Invalid cuisine selected.")


    # Cross-Field Validation
    def validate(self, data):
        cat = data.get("category")
        loc = data.get("location")
        
        if loc is not None and len(loc) > 0:
            if cat in ['Dining', 'Travel']:
                if len(loc.strip()) < 1:
                    raise serializers.ValidationError(f"Location \'{loc}\' must be at least 1 character long.")
                data["location"] = loc.strip()
                
            elif cat in ['Food']:
                if loc.startswith("Other"):
                    custom_location = loc[len("Other:"):]
                    if not custom_location.strip():
                        raise serializers.ValidationError(f"Custom location \'{loc}\' cannot be empty.")
                    data["location"] = custom_location.strip()  

                else:
                    from .models import Item  # Import here to avoid circular imports
                    valid_locations = Item.objects.filter(category__in=["Dining", "Travel"]).values_list("name", flat=True)
                    
                    if loc not in valid_locations:
                        raise serializers.ValidationError(f"Invalid location selected: {loc}")

        return data
        # # Ensure category-based requirements
        # if data.get("category") == "restaurant" and not data.get("price_range"):
        #     raise serializers.ValidationError("Restaurants must have a price range.")
        
        # if data.get("category") == "bar" and not data.get("music_source"):
        #     raise serializers.ValidationError("Bars must have a music source.")

        # # Prevent duplicate items with the same name & location
        # if Item.objects.filter(name=data["name"], location=data["location"]).exists():
        #     raise serializers.ValidationError("An item with this name already exists at this location.")
        
class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = ['id', 'name', 'img_url', 'description'] 

class ImageUploadSerializer(serializers.Serializer):
    files = serializers.ListField(child=serializers.ImageField())

class Image2ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image2Item
        fields = ['id', 'image_id', 'item_id'] 

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




from rest_framework import serializers
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import re
from .models import Image, Item, Dining, Food, Media, SelectOption, Travel


class ValidationHelper:
    """Helper class for common validation logic"""

    @staticmethod
    def validate_positive_number(value, field_name):
        if value is not None and value < 0:
            raise serializers.ValidationError(f"{field_name} must be a positive number.")
        return value
    
    @staticmethod
    def validate_nonempty_string(value, field_name):
        if value is not None and len(value.strip()) < 1:
            raise serializers.ValidationError(f"{field_name} can not be empty.")
        return value.strip()
    
    @staticmethod
    def validate_url(value, field_name):
        if value is None or value.strip() == "":
            return ""

        if not value.strip().startswith(('http://', 'https://')):
            value = 'https://' + value  # Prepend https:// if no scheme is present
    
        url_validator = URLValidator()
    
        try:
            url_validator(value)
        except ValidationError:
            raise serializers.ValidationError(f"Invalid URL for {field_name}: {value}")

        return value

        # Optionally check if the URL is a Google Maps URL
        # if "google.com/maps" not in value:
        #     raise serializers.ValidationError(f"Invalid Google Maps URL: {value}")

class ItemSerializer(serializers.ModelSerializer):
    category_data = serializers.JSONField(write_only=True)  

    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'review', 'rating', 'category_data']

    def create(self, validated_data):
        print(validated_data)
        category_data = validated_data.pop('category_data', None)
        item = Item.objects.create(**validated_data)
        # image_data = validated_data.pop('images', None)

        if category_data:
            if validated_data['category'] == 'Dining':
                Dining.objects.create(item=item, **category_data)
                SelectOption.objects.create(category='Location', name=item.name)
            elif validated_data['category'] == 'Food':
                Food.objects.create(item=item, **category_data)
                if 'Other' in category_data['location']:
                    SelectOption.objects.create(category='Location', name=category_data['location'][6:])
            elif validated_data['category'] == 'Media':
                Media.objects.create(item=item, **category_data)
                if 'Other' in category_data['source']:
                    SelectOption.objects.create(category='Source', name=category_data['source'][6:])
            elif validated_data['category'] == 'Travel':
                Travel.objects.create(item=item, **category_data)
                SelectOption.objects.create(category='Location', name=item.name)

        # if image_data:
        #     Image.objects.create(item=item, **image_data)
        
        return item
        
    def update(self, instance, validated_data):
        category_data = validated_data.pop('category_data', None)

        # Store old values before updating instance
        old_name = instance.name
        new_name = validated_data.get("name", old_name)

        # Fetch old category data from the associated category model
        old_location = None
        old_source = None

        if instance.category == 'Food':
            # Fetch old location from Food model (assuming a related field exists)
            food_instance = Food.objects.get(item=instance)
            old_location = food_instance.location if food_instance else None

        if instance.category == 'Media':
            # Fetch old source from Media model (assuming a related field exists)
            media_instance = Media.objects.get(item=instance)
            old_source = media_instance.source if media_instance else None

        instance = super().update(instance, validated_data)  # Update Item fields first

        # Ensure category_data exists before proceeding
        if category_data:
            category_model = {
                "Dining": Dining,
                "Food": Food,
                "Media": Media,
                "Travel": Travel,
            }.get(instance.category)

            if category_model:
                category_instance, _ = category_model.objects.get_or_create(item=instance)
                for attr, value in category_data.items():
                    setattr(category_instance, attr, value)             
                category_instance.save()

        # Handle SelectOption logic for Food (location) and Media (source)
        if instance.category == 'Food' and category_data and 'location' in category_data:
            new_location = category_data['location']
            if new_location.startswith('Other:'):
                if old_location and old_location.startswith('Other:') and old_location[6:] != new_location[6:]:
                    # Check if other items are using the old custom location
                    food_using_old_location = Food.objects.filter(location=old_location[6:]).exclude(item=instance).exists()

                    if not food_using_old_location:
                        # No other items are using it, update it
                        SelectOption.objects.filter(category='Location', name=old_location[6:]).update(name=new_location[6:])
                    else:
                        # Create new SelectOption for the new custom location if it doesn't exist
                        SelectOption.objects.get_or_create(category='Location', name=new_location[6:])
                else:
                    # Create the new custom location if it doesn't exist
                    SelectOption.objects.get_or_create(category='Location', name=new_location[6:])

        if instance.category == 'Media' and category_data and 'source' in category_data:
            new_source = category_data['source']
            if new_source.startswith('Other:'):
                if old_source and old_source.startswith('Other:') and old_source[6:] != new_source[6:]:
                    # Check if other items are using the old custom source
                    media_using_old_source = Media.objects.filter(source=old_source[6:]).exclude(item=instance).exists()

                    if not media_using_old_source:
                        # No other items are using it, update it
                        SelectOption.objects.filter(category='Source', name=old_source[6:]).update(name=new_source[6:])
                    else:
                        # Create new SelectOption for the new custom source if it doesn't exist
                        SelectOption.objects.get_or_create(category='Source', name=new_source[6:])
                else:
                    # Create the new custom source if it doesn't exist
                    SelectOption.objects.get_or_create(category='Source', name=new_source[6:])

        # Handle deletion of unused SelectOptions for Food and Media
        if instance.category == 'Food' and old_location:
            # If no Food items are using the old location anymore, delete it
            if not Food.objects.filter(location=old_location[6:]).exists() and \
            not Item.objects.filter(name=old_location[6:]).exists():
                SelectOption.objects.filter(category='Location', name=old_location[6:]).delete()
            if not Food.objects.filter(location=old_location).exists() and \
            not Item.objects.filter(name=old_location).exists():
                SelectOption.objects.filter(category='Location', name=old_location).delete()

        if instance.category == 'Media' and old_source:
            # If no Media items are using the old source anymore, delete it
            if not Media.objects.filter(source=old_source[6:]).exists():
                SelectOption.objects.filter(category='Source', name=old_source[6:]).delete()
            if not Media.objects.filter(source=old_source).exists():
                print(f"Delete {old_source}")
                SelectOption.objects.filter(category='Source', name=old_source).delete()

        # Handle name change for Dining and Travel categories (Location)
        if instance.category in ['Dining', 'Travel'] and old_name != new_name:
            SelectOption.objects.filter(category="Location", name=old_name).update(name=new_name)
            Food.objects.filter(location=old_name).update(location=new_name)

        return instance
    
    def to_representation(self, instance):
        """Customize read operations to include category-specific data."""
        data = super().to_representation(instance)

        # Add category-specific data
        if instance.category == "Dining":
            category_data = getattr(instance, 'dining', None)
        elif instance.category == "Food":
            category_data = getattr(instance, 'food', None)
        elif instance.category == "Media":
            category_data = getattr(instance, 'media', None)
        elif instance.category == "Travel":
            category_data = getattr(instance, 'travel', None)
        else:
            category_data = None  # No extra data if category isn't recognized

        # Serialize category-specific data if it exists
        if category_data:
            data["category_data"] = {
                field.name: getattr(category_data, field.name)
                for field in category_data._meta.fields
                if field.name != "id" and field.name != "item"
            }

        return data
    
    # Validate Category: Ensure it's from allowed values
    def validate_category(self, value):
        allowed_categories = ["Dining", "Food", "Media", "Travel"]
        if value not in allowed_categories:
            raise serializers.ValidationError(f"Category \'{value}\' is not one of {allowed_categories}.")
        return value
    
    # Validate Name: Ensure it's not empty, has a valid length, and no special characters
    def validate_name(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Name")

    # Validate Rating: Ensure it's a number between 0-100
    def validate_rating(self, value):
        if not isinstance(value, (int, float)):
            raise serializers.ValidationError(f"Rating \'{value}\' must be a number.")
        if not (0 <= value <= 100):
            raise serializers.ValidationError(f"Rating \'{value}\' must be between 0 and 100.")
        return value

    # Validate Review: Ensure minimum length
    def validate_review(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Review")
    
class DiningSerializer(serializers.ModelSerializer):

    def validate_location(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Location")

    def validate_address(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Address")
    
    def validate_gmap_url(self, value):
        return ValidationHelper.validate_url(value, "Google Maps")
    
    def validate_website(self, value):
        return ValidationHelper.validate_url(value, "Website")

    def validate_price_range(self, value):
        allowed_values = ["", "$", "$$", "$$$", "$$$$", "$$$$$"]
        if value and value not in allowed_values:
            raise serializers.ValidationError(f"Price range \'{value}\' is not one of {allowed_values}.")
        return value
    
    def validate_cuisine(self, value):
        return ValidationHelper.validate_nonempty_string("Cuisine")

class FoodSerializer(serializers.ModelSerializer):
    def validate_location(self, value):
        if value.startswith("Other"):
            custom_location = value[len("Other:"):]
            if not custom_location.strip():
                raise serializers.ValidationError(f"Custom location \'{value}\' cannot be empty.")
            value = custom_location

        else:
            valid_locations = Item.objects.filter(category__in=["Dining", "Travel"]).values_list("name", flat=True)
            if value not in valid_locations:
                raise serializers.ValidationError(f"Invalid location selected: {value}")
            
        return value
            
    def validate_cuisine(self, value):
        return ValidationHelper.validate_nonempty_string("Cuisine")
    
    def validate_cost(self, value):
        return ValidationHelper.validate_positive_number("Cost")
    
class SelectOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectOption
        fields = ['id', 'category', 'name']

    def validate_category(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Select Category")
    
    def validate_name(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Select Name")

class MediaSerializer(serializers.ModelSerializer):

    def validate_artist(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Artist")
    
    def validate_source(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Source")

    def validate_genre(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Genre")
    
    def validate_website(self, value):
        return ValidationHelper.validate_url(value, "Website")  
    
class TravelSerializer(serializers.ModelSerializer):
    def validate_location(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Location")

    def validate_address(self, value):
        return ValidationHelper.validate_nonempty_string(value, "Address")
    
    def validate_gmap_url(self, value):
        return ValidationHelper.validate_url(value, "Google Maps")
    
    def validate_website(self, value):
        return ValidationHelper.validate_url(value, "Website")
    
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'item', 'name', 'file', 'description'] 
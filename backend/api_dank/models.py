from django.db import models

# Create your models here.
class Item(models.Model):
    category = models.CharField(max_length=200, blank=True, default='')
    name = models.CharField(max_length=200, blank=False)
    review = models.CharField(max_length=710, blank=False)
    rating = models.IntegerField(default=50, blank=False)
    
    class Meta:
        ordering=['category', 'id']

class Dining(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, related_name="dining")
    location = models.CharField(max_length=200, blank=True, default='')
    address = models.CharField(max_length=200, blank=True, default='')
    gmap_url = models.CharField(max_length=200, blank=True, default='')
    website = models.CharField(max_length=200, blank=True, default='')
    price_range = models.CharField(max_length=200, blank=True, default='') # $, $$,
    cuisine = models.CharField(max_length=200, blank=True, default='')

class Food(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, related_name="food")
    location = models.CharField(max_length=200, blank=True, default='')
    cuisine = models.CharField(max_length=200, blank=True, default='')
    cost = models.DecimalField(decimal_places=2, max_digits=14, blank=True, default=0.00)

class Media(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, related_name="media")
    artist = models.CharField(max_length=200, blank=True, default='')
    genre = models.CharField(max_length=200, blank=True, default='')
    source = models.CharField(max_length=200, blank=True, default='') # enumerate : Spotify / Soundcloud / Youtube
    website = models.CharField(max_length=200, blank=True, default='')

class Travel(models.Model):
    item = models.OneToOneField(Item, on_delete=models.CASCADE, related_name="travel")
    location = models.CharField(max_length=200, blank=True, default='')
    address = models.CharField(max_length=200, blank=True, default='')
    gmap_url = models.CharField(max_length=200, blank=True, default='')
    website = models.CharField(max_length=200, blank=True, default='')

class Image(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=True)
    file = models.ImageField(upload_to="images/")  # Uses S3 if configured
    description = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name or f"Image: {self.id}"
    
class SelectOption(models.Model):
    category = models.CharField(max_length=200, blank=True, default='')
    name = models.CharField(max_length=200, blank=True, default='', unique=True)
    
# class SelectOptions(models.Model):
#     category = models.CharField(max_length=200, blank=True, default='')
#     option = models.CharField(max_length=200, blank=True, default='')

from django.db import models

# Create your models here.
class Item(models.Model):
    category = models.CharField(max_length=200, blank=True, default='')
    name = models.CharField(max_length=200, blank=False)
    review = models.CharField(max_length=710, blank=False)
    rating = models.IntegerField(default=50, blank=False)
    address = models.CharField(max_length=200, blank=True, default='')
    location = models.CharField(max_length=200, blank=True, default='')
    gmap_url = models.CharField(max_length=200, blank=True, default='')
    item_url = models.CharField(max_length=200, blank=True, default='')
    price_range = models.CharField(max_length=200, blank=True, default='')
    cost = models.DecimalField(decimal_places=2, max_digits=14, blank=True, default=0.00)
    cuisine = models.CharField(max_length=200, blank=True, default='')
    music_source = models.CharField(max_length=200, blank=True, default='')
    artist = models.CharField(max_length=200, blank=True, default='')
    music_meta = models.CharField(max_length=200, blank=True, default='')

    class Meta:
        ordering=['category', 'id']

class Image(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=True)
    file = models.ImageField(upload_to="images/")  # Uses AWS S3 
    description = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name or f"Image {self.id}"
    
    class Meta:
        ordering=['id']

class Tag(models.Model):
    name = models.CharField(max_length=33)
    
    class Meta:
        ordering = ['name']

class Tag2Item(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ['tag_id']

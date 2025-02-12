from django.db import models

# Create your models here.
class Item(models.Model):
    price_ranges = {
        '': None,
        '$': '$',       # 0 - 5 pp
        '$$': '$$',      # 6 - 16 pp
        '$$$': '$$$',     # 17 - 50 pp
        '$$$$': '$$$$',    # 51 - 99 pp
        '$$$$$': '$$$$$',   # 100 + pp
    }
    music_source = {
        '': None,
        'SC': 'SoundCloud',
        'SP': 'Spotify',
        'YT': 'YouTube',
    }
    category_choices = {
        '':'',
        'Dining': 'Dining',
        'Food': 'Food',
        'Music': 'Music',
        'Travel': 'Travel'
    }
    # tag = models.ManyToManyField(Tag)
    category = models.CharField(choices=category_choices, blank=False)
    name = models.CharField(max_length=200, blank=False)
    review = models.CharField(max_length=710, blank=False)
    rating = models.IntegerField(default=50, blank=False)
    address = models.CharField(max_length=200, blank=True, default='')
    location = models.CharField(max_length=200, blank=True, default='')
    gmap_url = models.CharField(max_length=200, blank=True, default='')
    item_url = models.CharField(max_length=200, blank=True, default='')
    price_range = models.CharField(choices=price_ranges, default='') # $, $$,
    cost = models.DecimalField(decimal_places=2, max_digits=14, blank=True, default=0.00)
    cuisine = models.CharField(max_length=200, blank=True, default='')
    music_source = models.CharField(choices=music_source, default='') # enumerate : Spotify / Soundcloud / Youtube
    artist = models.CharField(max_length=200, blank=True, default='')
    music_meta = models.CharField(max_length=200, blank=True, default='')

# class Image(models.Model):
#     name = models.CharField(max_length=200)
#     img_url = models.CharField(max_length=200)
#     description = models.CharField(max_length=200)

#     class Meta:
#         ordering=['name']

# class Image(models.Model):
#     image_variable = models.ImageField(null=True, default="{default_filename)", upload_to='uploads/') 
class Image(models.Model):
    name = models.CharField(max_length=200, blank=True)
    file = models.ImageField(upload_to="images/")  # Uses S3 if configured
    description = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name or f"Image {self.id}"

class Image2Item(models.Model):
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    
    class Meta:
        ordering=['image_id']

class Tag(models.Model):
    name = models.CharField(max_length=33)
    
    class Meta:
        ordering = ['name']

class Tag2Item(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ['tag_id']

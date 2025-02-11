from django.db import models

# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=33)
    
    class Meta:
        ordering = ['name']

class Image(models.Model):
    image_variable = models.ImageField(null=True, default="{default_filename)", upload_to='uploads/') 


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
    category = models.CharField(choices=category_choices, default='', blank=False)
    name = models.CharField(max_length=200, blank=False)
    review = models.CharField(max_length=710, blank=False)
    rating = models.IntegerField(default=0, blank=False)
    address = models.CharField(max_length=200, blank=True, null=True)
    location = models.CharField(max_length=200, blank=True, null=True)
    gmap_url = models.CharField(max_length=200, blank=True, null=True)
    item_url = models.CharField(max_length=200, blank=True, null=True)
    price_range = models.CharField(choices=price_ranges, default='') # $, $$,
    cost = models.DecimalField(decimal_places=2, max_digits=14, blank=True, null=True)
    cuisine = models.CharField(max_length=200, blank=True, null=True)
    music_source = models.CharField(choices=music_source, default='') # enumerate : Spotify / Soundcloud / Youtube
    artist = models.CharField(max_length=200, blank=True, null=True)
    music_meta = models.CharField(max_length=200, blank=True, null=True)

# class Image(models.Model):
#     name = models.CharField(max_length=200)
#     img_url = models.CharField(max_length=200)
#     description = models.CharField(max_length=200)

#     class Meta:
#         ordering=['name']

class Tag2Item(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ['tag_id']

class Image2Item(models.Model):
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
    

    class Meta:
        ordering=['image_id']
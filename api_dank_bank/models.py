from django.db import models

# Create your models here.

class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    area = models.CharField(max_length=200)
    gmap = models.CharField(max_length=200)
    website = models.CharField(max_length=200)
    price = models.CharField(max_length=5)
    cuisine = models.CharField(max_length=200)
    rating = models.IntegerField(default=0) #max = 5
    notes = models.CharField(max_length=420)

    class Meta:
        ordering = ['name']

class RestaurantFood(models.Model):
    name = models.CharField(max_length=200)
    restaurant = models.CharField(max_length=200) # change to restuarant id later to link
    price = models.DecimalField(decimal_places=2, max_digits=14)
    description = models.CharField(max_length=420)
    review = models.CharField(max_length=710)
    rating = models.IntegerField(default=0) #max = 5
    
    class Meta:
        ordering = ['name']

class Music(models.Model):
    song = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    songUrl = models.CharField(max_length=200)
    urlType = models.CharField(max_length=200) # enumerate : Spotify / Soundcloud / Youtube
    genre = models.CharField(max_length=200)
    rating = models.IntegerField(default=0) #max = 5
    
    class Meta:
        ordering = ['song']

class Travel(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    area = models.CharField(max_length=200)
    notes = models.CharField(max_length=200)
    website = models.CharField(max_length=200)
    rating = models.IntegerField(default=0) #max = 5
    
    class Meta:
        ordering = ['name']

class Tag(models.Model):
    name = models.CharField(max_length=33)
    
    class Meta:
        ordering = ['name']

class Image(models.Model):
    imgUrl = models.CharField(max_length=200)
    description = models.CharField(max_length=200)

    class Meta:
        ordering=['imgUrl']

class Tag2Entry(models.Model):
    tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE)
    restaurant_id = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    rfood_id = models.ForeignKey(RestaurantFood, on_delete=models.CASCADE)
    music_id = models.ForeignKey(Music, on_delete=models.CASCADE)
    travel_id = models.ForeignKey(Travel, on_delete=models.CASCADE)

    class Meta:
        ordering = ['tag_id']

class Entry2Image(models.Model):
    entry_id = models.ForeignKey(on_delete=models.CASCADE)
    image_id = models.ForeignKey(Image, on_delete=models.CASCADE)

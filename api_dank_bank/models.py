from django.db import models

# Create your models here.

class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    price = models.CharField(max_length=5)
    cuisine = models.CharField(max_length=200)
    rating = models.IntegerField(default=0) #max = 420
    notes = models.CharField(max_length=420)

    class Meta:
        ordering = ['name']

class RestaurantFood(models.Model):
    name = models.CharField(max_length=200)
    restaurant = models.CharField(max_length=200) # change to restuarant id later to link
    price = models.DecimalField(decimal_places=2, max_digits=14)
    description = models.CharField(max_length=420)
    review = models.CharField(max_length=710)
    rating = models.IntegerField(default=0) #max = 420
    
    class Meta:
        ordering = ['name']

class Music(models.Model):
    song = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    songUrl = models.CharField(max_length=200)
    urlType = models.CharField(max_length=200) # enumerate : Spotify / Soundcloud / Youtube
    genre = models.CharField(max_length=200)
    rating = models.IntegerField(default=0) #max = 420
    
    class Meta:
        ordering = ['song']

class Travel(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    country = models.CharField(max_length=200)
    citystate = models.CharField(max_length=200)
    photos = models.CharField(max_length=200) # link to photo album ?
    rating = models.IntegerField(default=0) #max = 420
    
    class Meta:
        ordering = ['name']

class Tag(models.Model):
    name = models.CharField(max_length=33)
    
    class Meta:
        ordering = ['name']

class Tag2Entry(models.Model):
    tag_id = models.ForeignKey(Tag, on_delete=models.CASCADE)
    restaurant_id = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    rfood_id = models.ForeignKey(RestaurantFood, on_delete=models.CASCADE)
    music_id = models.ForeignKey(Music, on_delete=models.CASCADE)
    travel_id = models.ForeignKey(Travel, on_delete=models.CASCADE)

    class Meta:
        ordering = ['tag_id']
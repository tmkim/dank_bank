from django.db import models

# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=33)
    
    class Meta:
        ordering = ['name']

class Restaurant(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    area = models.CharField(max_length=200)
    gmap = models.CharField(max_length=200)
    website = models.CharField(max_length=200)
    price = models.CharField(max_length=5)
    cuisine = models.CharField(max_length=200)
    review = models.CharField(max_length=710)
    rating = models.IntegerField(default=0) #max = 5
    # tag = models.ManyToManyField(Tag)

    class Meta:
        ordering = ['name']

class RestaurantFood(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(decimal_places=2, max_digits=14)
    description = models.CharField(max_length=420)
    review = models.CharField(max_length=710)
    rating = models.IntegerField(default=0) #max = 5
    
    class Meta:
        ordering = ['name']

class Music(models.Model):
    urlTypes = {
        'SC': 'SoundCloud',
        'SP': 'Spotify',
        'YT': 'YouTube',
    }
        
    name = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    songUrl = models.CharField(max_length=200)
    urlType = models.CharField(choices=urlTypes, default='SC') # enumerate : Spotify / Soundcloud / Youtube
    genre = models.CharField(max_length=200)
    review = models.CharField(max_length=710)
    rating = models.IntegerField(default=0) #max = 5
    
    class Meta:
        ordering = ['name']

class Travel(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    area = models.CharField(max_length=200)
    website = models.CharField(max_length=200)
    review = models.CharField(max_length=710)
    rating = models.IntegerField(default=0) #max = 5
    
    class Meta:
        ordering = ['name']

class Image(models.Model):
    name = models.CharField(max_length=200)
    imgUrl = models.CharField(max_length=200)
    description = models.CharField(max_length=200)

    class Meta:
        ordering=['name']

class Tag2Item(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    rfood = models.ForeignKey(RestaurantFood, on_delete=models.CASCADE)
    music = models.ForeignKey(Music, on_delete=models.CASCADE)
    travel = models.ForeignKey(Travel, on_delete=models.CASCADE)

    class Meta:
        ordering = ['tag_id']

class Image2Item(models.Model):
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    rfood = models.ForeignKey(RestaurantFood, on_delete=models.CASCADE)
    music = models.ForeignKey(Music, on_delete=models.CASCADE)
    travel = models.ForeignKey(Travel, on_delete=models.CASCADE)

    class Meta:
        ordering=['image_id']
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our ViewSets with it.
router = DefaultRouter()
router.register(r'restaurants', views.RestaurantViewSet, basename='restaurants')
router.register(r'restaurantfoods', views.RestaurantFoodViewSet, basename='restaurantfoods')
router.register(r'music', views.MusicViewSet, basename='music')
router.register(r'travel', views.TravelViewSet, basename='travel')
router.register(r'tags', views.TagViewSet, basename='tags')
router.register(r'tag2item', views.Tag2ItemViewSet, basename='tag2item')
router.register(r'images', views.TagViewSet, basename='images')
router.register(r'image2item', views.Image2ItemViewSet, basename='image2item')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]

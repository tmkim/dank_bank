from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ImageViewSet


# router.register(r'dining', views.DiningViewSet, basename='dining')
# router.register(r'food', views.FoodViewSet, basename='food')
# router.register(r'music', views.MusicViewSet, basename='music')
# router.register(r'travel', views.TravelViewSet, basename='travel')
# router.register(r'tags', views.TagViewSet, basename='tags')
# router.register(r'tag2item', views.Tag2ItemViewSet, basename='tag2item')
# router.register(r'images', views.TagViewSet, basename='images')
# Create a router and register our ViewSets with it.
router = DefaultRouter()
router.register(r'items', views.ItemViewSet, basename='items')
router.register(r'image', views.ImageViewSet, basename='image')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]

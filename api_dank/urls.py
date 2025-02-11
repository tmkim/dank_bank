from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ImageUploadView, Image2ItemCreateView, Image2ItemDeleteView


# router.register(r'dining', views.DiningViewSet, basename='dining')
# router.register(r'food', views.FoodViewSet, basename='food')
# router.register(r'music', views.MusicViewSet, basename='music')
# router.register(r'travel', views.TravelViewSet, basename='travel')
# router.register(r'tags', views.TagViewSet, basename='tags')
# router.register(r'tag2item', views.Tag2ItemViewSet, basename='tag2item')
# router.register(r'images', views.TagViewSet, basename='images')
# router.register(r'image2item', views.Image2ItemViewSet, basename='image2item')
# Create a router and register our ViewSets with it.
router = DefaultRouter()
router.register(r'items', views.ItemViewSet, basename='items')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('upload/', ImageUploadView.as_view(), name='upload'),
    path('image2item/', Image2ItemCreateView.as_view(), name='image2item-create'),
    path('image2item/<int:pk>/', Image2ItemDeleteView.as_view(), name='image2item-delete'),
    path('', include(router.urls)),
]

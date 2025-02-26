from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import CustomTokenObtainPairView, ItemViewSet, ImageViewSet


# router.register(r'dining', views.DiningViewSet, basename='dining')
# router.register(r'food', views.FoodViewSet, basename='food')
# router.register(r'music', views.MusicViewSet, basename='music')
# router.register(r'travel', views.TravelViewSet, basename='travel')
# router.register(r'tags', views.TagViewSet, basename='tags')
# router.register(r'tag2item', views.Tag2ItemViewSet, basename='tag2item')
# router.register(r'images', views.TagViewSet, basename='images')
# Create a router and register our ViewSets with it.
router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='items')
router.register(r'image', ImageViewSet, basename='image')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]

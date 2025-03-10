from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView, ItemViewSet, ImageViewSet, SelectOptionViewSet


# Create a router and register our ViewSets with it.
router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='items')
router.register(r'image', ImageViewSet, basename='image')
router.register(r'selectoption', SelectOptionViewSet, basename='selectoption')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]

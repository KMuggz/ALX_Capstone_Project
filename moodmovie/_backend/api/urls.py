from django.urls import path    
from .views import RecommendMovie

urlpatterns = [
    path('recommend/', RecommendMovie.as_view(), name='recommend_movie')
]

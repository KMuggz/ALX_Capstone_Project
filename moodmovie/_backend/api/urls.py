from django.urls import path    
from .views import RecommendMovie, MoodList, PostFeedback

urlpatterns = [
    path('moods/', MoodList.as_view(), name='mood-list'),
    path('recommend/', RecommendMovie.as_view(), name='recommend_movie'),
    path('feedback/', PostFeedback.as_view(), name='post-feedback'),
]

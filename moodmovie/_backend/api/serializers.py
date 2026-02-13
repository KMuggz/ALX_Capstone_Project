from rest_framework import serializers
from .models import Mood, Movie, RecommendationCache, UserFeedback

class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ['id', 'name', 'description']

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['tmdb_movie_id', 'title', 'poster_path', 'rating', 'summary']

class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = ['movie', 'session_id', 'feedback_type']
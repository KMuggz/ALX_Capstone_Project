from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Mood, Movie, RecommendationCache, UserFeedback
from .services import fetch_movies_by_mood
from .serializers import MovieSerializer
import random

# Create your views here.

class RecommendMovie(APIView):
    def get(self, request):
        mood_id = request.query_params.get('mood_id')
        session_id = request.query_params.get('session_id')
        
        # Validation: Ensure mood_id is provided
        if not mood_id:
            return Response({"error": "mood_id is required"}, status=400)

        # 1. Accessing 'Mood': Get the mood object or return 404
        try:
            mood_obj = Mood.objects.get(id=mood_id)
        except Mood.DoesNotExist:
            return Response({"error": "Mood not found"}, status=404)

        # 2. Get excluded movie IDs (FeedbackType.BAD)
        excluded_ids = UserFeedback.objects.filter(
            session_id=session_id, 
            feedback_type='Bad'
        ).values_list('movie__tmdb_movie_id', flat=True)

        # 3. Get movies from cache using the 'mood_mappings' relationship
        cached_movies = Movie.objects.filter(
            mood_mappings__mood=mood_obj
        ).exclude(tmdb_movie_id__in=excluded_ids)

        if cached_movies.exists():
            selected = random.choice(cached_movies)
            return Response(MovieSerializer(selected).data)
        
        # 4. If cache empty, use 'Mood' genre IDs to fetch from TMDb
        tmdb_results = fetch_movies_by_mood(mood_obj.tmdb_genre_ids)
        
        if tmdb_results:
            # For now, I'm just returning the first result from API to test
            # In the next step, I will save these to RecommendationCache
            return Response(tmdb_results[0])
            
        return Response({"message": "No movies found for this mood"}, status=404)
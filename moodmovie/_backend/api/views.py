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

        if not mood_id:
            return Response({"error": "mood_id is required"}, status=400)

        try:
            mood_obj = Mood.objects.get(id=mood_id)
        except Mood.DoesNotExist:
            return Response({"error": "Mood not found"}, status=404)

        # 1. get excluded movie IDs (Bad feedback)
        excluded_ids = UserFeedback.objects.filter(
            session_id=session_id, 
            feedback_type='Bad'
        ).values_list('movie__tmdb_movie_id', flat=True)

        # 2. try to get from existing cache
        cached_movies = Movie.objects.filter(
            mood_mappings__mood=mood_obj
        ).exclude(tmdb_movie_id__in=excluded_ids)

        if cached_movies.exists():
            selected = random.choice(cached_movies)
            return Response(MovieSerializer(selected).data)
        
        # 3. cache Empty? Fetch from TMDb and SAVE
        tmdb_results = fetch_movies_by_mood(mood_obj.tmdb_genre_ids)
        
        saved_movies = []
        for data in tmdb_results[:10]: # process top 10 results
            # create or update the Movie record
            movie_obj, created = Movie.objects.update_or_create(
                tmdb_movie_id=data['id'],
                defaults={
                    'title': data['title'],
                    'poster_path': data.get('poster_path'),
                    'rating': data.get('vote_average', 0.0),
                    'summary': data.get('overview', '')
                }
            )
            # create the M:M link in the Junction Table
            RecommendationCache.objects.get_or_create(mood=mood_obj, movie=movie_obj)
            
            # add to list if not excluded
            if movie_obj.tmdb_movie_id not in excluded_ids:
                saved_movies.append(movie_obj)

        if saved_movies:
            selected = random.choice(saved_movies)
            return Response(MovieSerializer(selected).data)
            
        return Response({"message": "No new movies found"}, status=404)
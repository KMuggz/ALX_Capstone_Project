from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from django.conf import settings
from .models import Mood, UserFeedback
from .serializers import MoodSerializer 
from .services import get_tmdb_recommendations
import random
#for debugging only
import traceback
import logging


logger = logging.getLogger(__name__)
class RecommendMovie(APIView):
    def get(self, request):
        mood_id = request.query_params.get('mood_id')
        if not mood_id:
            return Response({"error": "mood_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure a session exists to track feedback
        if not request.session.session_key:
            request.session.create()
        session_id = request.session.session_key

        try:
            mood = Mood.objects.get(id=mood_id)
            
            # SCRUTINY: Ensure we have data to send.
            # We pass the raw list; the service will handle the OR (|) logic.
            genre_data = mood.tmdb_genre_ids
            
            if not genre_data:
                return Response({"error": "Mood has no genre IDs configured"}, status=status.HTTP_400_BAD_REQUEST)

            movies_data = get_tmdb_recommendations(genre_data)
            
            if movies_data and 'results' in movies_data and len(movies_data['results']) > 0:
                
                # SMART FILTERING: Get IDs of movies user marked as 'Bad' in this session
                blacklisted_ids = set(
                    UserFeedback.objects.filter(
                    session_id=session_id, 
                    feedback_type='Bad'
                ).values_list('movie_id', flat=True)
                )

                # Filter out the blacklisted movies
                available_movies = [
                    m for m in movies_data['results'] 
                    if m.get('id') not in blacklisted_ids
                ]

                if not available_movies:
                    return Response(
                        {"error": "All suggested movies for this mood were blacklisted. Try a new mood!"}, 
                        status=status.HTTP_200_OK # Return OK but with a message
                    )
                
                random_movie = random.choice(available_movies)
                return Response({
                # --- CHANGE: ADDED 'id' TO THE RESPONSE ---
                # Without this, the Good/Bad buttons can't identify the movie
                    "id": random_movie.get("id"),
                    "title": random_movie.get("title"),
                    "overview": random_movie.get("overview"),
                    "poster_path": random_movie.get("poster_path"),
                    "vote_average": random_movie.get("vote_average"),
                    "release_date": random_movie.get("release_date"),
                })
            
            # If we reach here, TMDb found nothing. 
            # We use 502 to tell the frontend "The upstream service (TMDb) failed"
            return Response(
                {"error": "No movies found for this mood. Try widening the genre IDs."}, 
                status=status.HTTP_502_BAD_GATEWAY
            )
            
        except Mood.DoesNotExist:
            return Response({"error": "Mood not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # --- CHANGE: ENHANCED ERROR CATCHING ---
        except Exception as e:
            print("\n--- DjangoBackend Error Traceback---")
            traceback.print_exc()
            print("--------------------------------------------------------------\n")
            return Response({
                "error": str(e),
                "detail": "Check the Django terminal for the full traceback"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# NEW ENDPOINT: Handles the POST request from the Good/Bad/Meh buttons
class PostFeedback(APIView):
    def post(self, request):
        movie_id = request.data.get('movie_id')
        status_val = request.data.get('status') # 'Good', 'Bad', 'Meh'
        
        if not request.session.session_key:
            request.session.create()
        session_id = request.session.session_key

        if not movie_id or not status_val:
            return Response({"error": "Data missing"}, status=status.HTTP_400_BAD_REQUEST)

        # Update or create feedback for this movie in this session
        UserFeedback.objects.update_or_create(
            movie_id=movie_id,
            session_id=session_id,
            defaults={'feedback_type': status_val}
        )
        
        return Response({"message": "Feedback recorded"}, status=status.HTTP_201_CREATED)

class MoodList(generics.ListAPIView):
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer
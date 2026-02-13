import os
import requests
from dotenv import load_dotenv
from django.conf import settings

load_dotenv()
TMDB_API_KEY = settings.TMDB_API_KEY 
BASE_URL = "https://api.themoviedb.org/3"

def fetch_movies_by_mood(genre_ids):
    """
    Queries TMDb for movies matching specific genre IDs.
    """
    endpoint = f"{BASE_URL}/discover/movie"
    params = {
        'api_key': TMDB_API_KEY,
        'with_genres': ",".join(map(str, genre_ids)),
        'sort_by': 'popularity.desc',
        'language': 'en-US',
        'include_adult': False
    }
    
    try:
        response = requests.get(endpoint, params=params, timeout=5)
        response.raise_for_status() # Check for HTTP errors
        return response.json().get('results', [])
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to TMDb: {e}")
        return []
    # added language and include_adult for cleaner data
    # wrapped request in try-except for production-grade error handling
    # added timeout to prevent the app from hanging when TMDb is slow
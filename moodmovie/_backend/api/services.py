import requests
import logging
import random
from django.conf import settings

# Set up logging to see errors in the console more clearly
logger = logging.getLogger(__name__)

def get_tmdb_recommendations(genre_ids):
    """
    Unified service to fetch movies from TMDb.
    Accepts genre_ids as a string (e.g., "35,18") or a list [35, 18].
    """
    api_key = settings.TMDB_API_KEY
    endpoint = "https://api.themoviedb.org/3/discover/movie"
    
    # Scrutiny: Ensure genre_ids is formatted as a comma-separated string
    if isinstance(genre_ids, list):
        genre_ids = "|".join(map(str, genre_ids))
    else:
        genre_string = str(genre_ids)

    params = {
        'api_key': api_key,
        'with_genres': genre_ids,
        'sort_by': 'popularity.desc',
        'language': 'en-US',
        'include_adult': False,
        'page': random.randint(1, 5) # picks from top 100 films in each mood/genre
    }

    print(f"DEBUG: Requesting TMDb with genres: {genre_ids}")

    try:
        with requests.Session() as session:
            session.trust_env = False 
            response = session.get(endpoint, params=params, timeout=10)
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"DEBUG: TMDb Error Status: {response.status_code}")
                return None

    except requests.exceptions.Timeout:
        print("DEBUG: Request timed out in Python. System is reachable via curl but not via Requests.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"DEBUG: Connection error: {e}")
        return None

# Keep a reference for your existing view calls if you haven't renamed them yet
def fetch_movies_by_mood(genre_ids):
    data = get_tmdb_recommendations(genre_ids)
    return data.get('results', []) if data else []
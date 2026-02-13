from django.contrib import admin
from .models import Mood, Movie, RecommendationCache, UserFeedback

# Register your models here.

@admin.register(Mood)
class MoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'tmdb_genre_ids')
    search_fields = ('name',)

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'tmdb_movie_id', 'rating')
    search_fields = ('title', 'tmdb_movie_id')

@admin.register(RecommendationCache)
class RecommendationCacheAdmin(admin.ModelAdmin):
    list_display = ('mood', 'movie', 'created_at')
    list_filter = ('mood', 'created_at')

@admin.register(UserFeedback)
class UserFeedbackAdmin(admin.ModelAdmin):
    list_display = ('movie', 'session_id', 'feedback_type', 'created_at')
    list_filter = ('feedback_type', 'created_at')
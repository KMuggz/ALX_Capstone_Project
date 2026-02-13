from django.db import models
from decimal import Decimal

# Create your models here.

class Mood(models.Model):
    """
    Stores mood categories and mapping logic for TMDb API.
    Uses JSONField for DB-agnostic storage of genre IDs.
    """
    name = models.CharField(max_length=50, unique=True)
    # Using JSONField (Option B) for flexibility across SQLite/MySQL/Postgres
    tmdb_genre_ids = models.JSONField(default=list, help_text="List of TMDb genre IDs")
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Mood"
        verbose_name_plural = "Moods"

    def __str__(self):
        return self.name


class Movie(models.Model):
    """
    Unique movie data fetched from TMDb API.
    """
    tmdb_movie_id = models.IntegerField(unique=True, db_index=True)
    title = models.CharField(max_length=255)
    poster_path = models.CharField(
        max_length=255, 
        blank=True, 
        null=True
        )
    rating = models.DecimalField(
        max_digits=3, 
        decimal_places=1, 
        default=Decimal("0.0")
    )
    summary = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Movie"
        verbose_name_plural = "Movies"

    def __str__(self):
        return self.title


class RecommendationCache(models.Model):
    """
    The 'Through' table linking Moods to Movies.
    Allows one movie to appear in multiple moods without duplication.
    """
    mood = models.ForeignKey(
        Mood, 
        on_delete=models.CASCADE, 
        related_name="recommendations"
        )
    movie = models.ForeignKey(
        Movie, 
        on_delete=models.CASCADE, 
        related_name="mood_mappings"
        )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevents the same movie being cached under the same mood twice
        unique_together = ("mood", "movie")
        ordering = ["-created_at"]
        verbose_name = "Cached Recommendation"
        verbose_name_plural = "Cached Recommendations"


class UserFeedback(models.Model):
    """
    Tracks user sentiment. Restricted to one vote per movie per session.
    """
    class FeedbackType(models.TextChoices):
        GOOD = "Good", "Good"
        BAD = "Bad", "Bad"
        MEH = "Meh", "Meh"

    movie = models.ForeignKey(
        Movie, 
        on_delete=models.CASCADE, 
        related_name="feedback"
        )
    session_id = models.CharField(max_length=255)
    feedback_type = models.CharField(
        max_length=10,
        choices=FeedbackType.choices
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensures one vote per movie per session
        unique_together = ("movie", "session_id")
        indexes = [
            models.Index(fields=["movie", "session_id"]),
        ]

    def __str__(self):
        return f"{self.feedback_type} for {self.movie.title} (Session: {self.session_id})"
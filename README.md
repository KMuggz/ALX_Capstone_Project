# MoodMovie

MoodMovie is a full-stack movie discovery application designed to solve choice paralysis.
Instead of browsing through generic genres, users discover films based on their current emotional state.

By mapping moods to specific cinematic traits and leveraging a smart feedback loop, MoodMovie makes choosing a movie intentional, personal, and effortless.
## Key Features
### Mood-Based Discovery

Select a mood (e.g., “Cathartic Cry”, “Thought-Provoking”) to receive curated movie recommendations. *The engine uses OR logic (|) between multiple genre IDs to ensure a broad and diverse pool of suggestions*.
### Interactive Randomizer

A Framer Motion-powered Randomizer Wheel with a physical-feel pointer and synchronized audio feedback (.wav tickers). It provides a "split-second" winner reveal before transitioning to the recommendation.
### Smart Discovery & Randomization

The backend implements a Hidden Gem discovery system that randomizes API page queries (Pages 1–5). This ensures that even if you select the same mood twice, you are likely to discover different films.
### Session-Based Feedback & Smart Filtering

Users can mark recommendations as Good / Meh / Bad. The system uses a Smart Blacklist; if a user marks a movie as "Bad," that specific movie is instantly removed from the pool of potential suggestions for the remainder of that session.
### Streaming Availability

Direct integration with TMDb Watch Providers. Every movie card includes a "Where to Watch" link to instantly find the film on your preferred streaming platforms.
## Tech Stack
### Frontend

   * React (Vite)

   * Tailwind CSS

   * Framer Motion (Animations & UI Physics)

### Backend

   * Django

   * Django REST Framework (DRF)

   * Django Sessions (For anonymous user tracking)

### Database

   * SQLite (Development)

   * PostgreSQL (Production-ready)

### External API

   * The Movie Database (TMDb)

## Database Architecture

The application uses a normalized relational schema to efficiently manage many-to-many relationships between moods and movies.
### Core Entities

**Moods**

Stores emotional categories and their corresponding TMDb API query parameters (Genre IDs).

**Movie**

The central source of truth for movie metadata fetched from TMDb, includes...
* Title

* Poster

* Rating

* Overview

* Release Date

**UserFeedback**

Tracks session-based reactions. Utilizes a unique_together constraint on movie_id and session_id to ensure data integrity.
## API Endpoints

The backend exposes a RESTful API:

**GET /api/moods/**

Fetch all available mood categories.

**GET /api/recommend/?mood_id=<id>**

Retrieve a random recommendation, excluding "Bad" feedback from the current session.

**POST /api/feedback/**

Submit user feedback (Good, Meh, Bad) for a specific movie.

## Current Folder Structure
```text

MoodMovie/
│
├── backend/           # Django + DRF backend
├── frontend/          # React + Vite frontend
├── docs/              # Design documents (ERD, TDD, etc.)
├── public/            # Static assets (tick.wav, win.wav)
├── README.md
└── requirements.txt
```

## Setup & Installation

**Clone the Repository**

```Bash
git clone https://github.com/yourusername/moodmovie.git
cd moodmovie
```
**Backend Setup**

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
**Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```
## Roadmap

> -[x] Part 1: Idea & Planning
>
> -[x] Part 2: Design Phase (ERD & TDD)
>
> -[X] Part 3: Backend Core Development (In Progress)
>
> -[x] Part 4: Frontend & Randomizer Implementation
>
>> -[ ] Part 5: Deployment & Final Demo (*in progress*)

## Future Improvements
```text
1.User authentication and saved preferences.

2.Persistent feedback history across devices.

3.Advanced filtering (Release year, Minimum rating, Runtime).

4.Dockerized deployment for easier scaling.
```
>#### Author
>
>> ***Karani Ivan***
>
>***ALX Backend Engineering Capstone Project***
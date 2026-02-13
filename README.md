# MoodMovie

MoodMovie is a full-stack movie discovery application designed to solve choice paralysis.
Instead of browsing through generic genres, users discover films based on their current emotional state.

By mapping moods to specific cinematic traits and leveraging a smart feedback loop, MoodMovie makes choosing a movie intentional, personal, and effortless.

## Key Features
### Mood-Based Discovery

Select a mood (e.g., **“Cathartic Cry”**, **“Thought-Provoking”**) to receive curated movie recommendations.

### Interactive Randomizer

A Framer Motion-powered Randomizer Wheel helps users decide when they are still unsure.

### Smart Caching

A high-performance backend caches ***TMDb API*** data to reduce latency and improve response times.

### Session-Based Feedback

Users can mark recommendations as **Good / Meh / Bad**, instantly refining suggestions within the current session.

## Tech Stack
### Frontend

* React

* Tailwind CSS

* Framer Motion

### Backend

* Django

* Django REST Framework (DRF)

### Database

* SQLite (Development)

* PostgreSQL (Production-ready)

### External API

* The Movie Database (TMDb)

## Database Architecture

The application uses a normalized relational schema to efficiently manage many-to-many relationships between moods and movies.

### Core Entities
**Moods**

Stores emotional categories and their corresponding TMDb API query parameters.

**Movie**

The central source of truth for movie metadata, including:

* Title

* Poster

* Rating

* Overview

* Release Date

**RecommendationCache**

A junction table linking movies to multiple moods without duplicating data.

**UserFeedback**

Tracks session-based reactions to dynamically blacklist “Bad” recommendations in real time.

## API Endpoints

The backend exposes a RESTful API:

**GET /api/moods/**

Fetch all available mood categories.

**GET /api/recommend/?mood_id=<id>**

Retrieve a random recommendation filtered by session history.

**POST /api/feedback/**

Submit user feedback for a specific movie.
```text
MoodMovie/
│
├── backend/           # Django + DRF backend
├── frontend/          # React frontend
├── docs/              # Design documents (ERD, TDD, etc.)
├── README.md
└── requirements.txt
```

## Setup & Installation
**Clone the Repository**
```bash
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
npm start
```

## Roadmap

 * -[x] Part 1: Idea & Planning

 * -[x] Part 2: Design Phase (ERD & TDD)

 * -[ ] Part 3: Backend Core Development (In Progress)

 * -[ ] Part 4: Frontend & Randomizer Implementation

 * -[ ] Part 5: Deployment & Final Demo

## Future Improvements

* User authentication and saved preferences

* Persistent feedback history

* AI-powered mood detection

* Advanced filtering (year, rating, runtime)

* Dockerized deployment

### Author

***Karani Ivan***

***ALX Backend Engineering Capstone Project***
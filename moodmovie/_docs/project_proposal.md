# MoodMovie

## Project Proposal
---

  **Prepared for:**
  ALX BE Capstone Project Submission
  ALX Africa

  **Prepared by:**
  Karani Ivan

  **Date:**
  31 January 2026

---

## Executive Summary

MoodMovie is a web-based movie discovery platform designed to reduce decision fatigue when choosing what to watch. Instead of relying on traditional genre-based browsing, MoodMovie recommends films based on a user’s emotional state.

By mapping moods to cinematic characteristics and implementing a **Many-to-Many relational database structure**, the application delivers personalized suggestions backed by TMDb data and real-time session-based feedback.

The project will be developed as a full-stack web application using:

* **Django** (Backend)
* **React** (Frontend)
* **TMDb API** (Primary data source)

---

## Contents

* [Capstone Part One — Idea & Planning](#capstone-part-one--idea--planning)
* [Capstone Part Two — Design Phase](#capstone-part-two--design-phase)
* [Capstone Part Three — Start Building](#capstone-part-three--start-building)
* [Capstone Part Four — Continue Building](#capstone-part-four--continue-building)
* [Capstone Part Five — Finalize & Submit](#capstone-part-five--finalize--submit)
* [Technologies Used](#technologies-used)
* [Milestones and Reporting](#milestones-and-reporting)
* [Conclusion](#conclusion)
* [Additional Planning Notes](#additional-planning-notes)

---

# Capstone Part One — Idea & Planning

## Project Idea

MoodMovie addresses the common problem of *choice paralysis* experienced on modern streaming platforms. Users often know how they feel but struggle to translate that feeling into a movie choice.

MoodMovie bridges this gap by mapping emotional states (e.g., *Need a Laugh*, *Thought-Provoking*, *Cathartic Cry*) to specific cinematic characteristics, enabling emotionally aligned recommendations.

---

## Core Features

### Mood-Based Discovery

Users select a mood rather than a genre.

### Randomizer Wheel

An optional decision-making feature that selects a movie within a chosen mood.

### Curated Movie Cards

Displays:

* Poster artwork
* TMDb ratings
* Mood relevance
* Spoiler-free summaries

### Feedback Loop

Simple `Good / Bad / Meh` reactions refine future recommendations.

### Streaming Availability

Direct links to platforms where the movie can be watched.

---

## Planning Considerations

* Mood subjectivity will be handled through continuous session-based feedback.
* The initial scope is intentionally limited to ensure successful completion within the capstone timeline.
* Database normalization will prevent movie metadata duplication while supporting complex mood associations.

---

# Capstone Part Two — Design Phase

## ERD Design

The database follows a **normalized relational schema** to ensure data integrity and minimize redundancy.

By separating movie metadata from mood associations, the system supports:

* Many-to-Many mood-to-movie mapping
* Flexible discovery logic
* Efficient API caching
* Session-aware filtering

An **Entity Relationship Diagram (ERD)** will be created using tools such as **Canva** or **Lucidchart** and included in the final documentation.

---

## Core Entities

### Mood

Maps emotional states to TMDb genre and keyword IDs (stored using structured fields such as JSONField for flexibility).

### Movie

Acts as a centralized **Source of Truth** for movie metadata (title, poster, rating, summary) to prevent duplication.

### RecommendationCache

A junction table managing the Many-to-Many relationship between moods and movies while reducing external API calls.

### UserFeedback

Stores session-based sentiment (`Good`, `Bad`, `Meh`) with unique constraints to ensure one reaction per movie per session.

---

# Capstone Part Three — Start Building

## Backend Development

* Set up Django project with Django REST Framework.
* Integrate TMDb API for movie metadata retrieval.
* Implement mood-based recommendation engine.
* Create REST API endpoints:

  * `GET /api/moods/`
  * `GET /api/recommend/?mood_id=X` (filtered by session feedback)
  * `POST /api/feedback/` (validated by session-level uniqueness constraints)

---

## Frontend Foundation

* Initialize React project.
* Develop base UI components:

  * Mood Selector
  * Movie Card
* Connect frontend to backend APIs.
* Establish base layout and navigation structure.

---

# Capstone Part Four — Continue Building

## Feature Expansion

* Implement the **Randomizer Wheel** using Framer Motion.
* Introduce smart filtering using `unique_together` constraints to instantly exclude disliked recommendations within a session.
* Refine UI responsiveness and interactivity.

---

## Iterative Improvements

* Optimize API calls using caching strategies.
* Improve error handling and loading states.
* Continuously update documentation as features evolve.

---

# Capstone Part Five — Finalize & Submit

## Finalization Tasks

* Debugging and comprehensive testing of core features.

* UI/UX polishing using **Tailwind CSS** with a cinematic dark theme.

* Deployment:

  * **Backend:** Heroku
  * **Frontend:** Vercel

* Record demo video showcasing full application functionality.

* Conduct final documentation review and submission.

---

# Technologies Used

* **Backend:** Django, Django REST Framework
* **Frontend:** React, Tailwind CSS, Framer Motion
* **Database:** SQLite (development), MySQL-ready for production
* **Database Features:** JSONField for flexible API parameter storage
* **External API:** TMDb (The Movie Database)
* **Deployment:** Vercel, Heroku

---

# Milestones and Reporting

**Total Estimated Man-Hours:** ~79 hours

The project will follow a structured five-phase implementation plan:

### Phase 1 — Foundation (Planning & Setup)

* Initialize Django & React projects
* Configure TMDb API authentication
* Define database models (Mood, Movie, RecommendationCache, UserFeedback)
* Initial documentation setup

---

### Phase 2 — Design (ERD & Architecture)

* Research ERD concepts and best practices
* Create ERD diagram
* Documentation update with architectural explanations

---

### Phase 3 — Backend Core Development

* Build mood-based recommendation engine
* Implement REST API endpoints
* Implement feedback handling logic
* Documentation updates

---

### Phase 4 — Frontend & Interactivity

* Develop React UI layout
* Implement Mood Selector & Movie Cards
* Build Randomizer Wheel
* Integrate feedback buttons with backend
* Documentation updates

---

### Phase 5 — Polish & Launch

* Final debugging and testing
* UI/UX refinement (Tailwind CSS dark mode)
* Deployment (Vercel & Heroku)
* Final documentation updates
* Record demo video

---

# Conclusion

MoodMovie is a focused and achievable capstone project demonstrating:

* Backend architecture design
* REST API development
* External API integration
* Frontend interaction and state management
* Full-stack deployment

By centering recommendations around emotional intent rather than traditional genres, the application provides a distinctive and user-centered solution to decision fatigue in modern streaming environments.

---

# Additional Planning Notes

### Subjectivity Management

By using a junction table (`RecommendationCache`), the application efficiently queries overlapping moods (e.g., a movie categorized as both *Funny* and *High Energy*) without redundant storage.

### Design Aesthetic

The UI will utilize a **Cinematic Dark Mode** to create a premium, theatre-like atmosphere using Tailwind CSS.

### Scalability

Although SQLite will be used during development, the architecture is fully prepared for migration to MySQL in production environments.

---

# 📚 Study Planner

## 🔗 Live Demo

👉 https://study-planner.aryarajtyagi777.workers.dev

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript  
- **Backend / BaaS:** Supabase (PostgreSQL, Auth, Storage)  
- **Deployment:** Cloudflare Workers (via OpenNext.js adapter)  
- **File Storage:** Supabase Storage  
- **ORM (legacy / experimental):** Prisma (not actively used in final architecture)

---

## Project Overview

Study Planner is a full-stack academic management web application designed to help university students organize courses, schedules, assignments, academic materials, and graduation progress in one unified system.

The project is built as both a personal productivity tool and a portfolio project demonstrating modern full-stack development, edge deployment, and backend-as-a-service architecture.

---

## System Architecture


User → Next.js Frontend → Cloudflare Workers (Edge Runtime) → Supabase (DB / Auth / Storage)


- The frontend is deployed globally using Cloudflare Workers.
- Supabase handles authentication, database storage, and file storage.
- All communication happens via secure HTTP APIs.

---

## Goals

The application allows users to:

- Create and manage a weekly timetable
- Generate a dynamic calendar from the timetable
- Override schedules for specific dates
- Upload and store class materials (PDFs)
- Track assignments and study progress
- Monitor graduation credit requirements
- Maintain reminders and sticky notes

---

## Core Features

### 1. Timetable System
Users define a weekly timetable that acts as the base template for all scheduling logic.

---

### 2. Calendar System
A dynamic calendar is generated from the weekly timetable.

Users can:
- View scheduled classes by date
- Navigate monthly views
- Override individual dates (e.g., cancelled or rescheduled classes)
- Preserve the original timetable as the base source of truth

---

### 3. Class Session Workspace

Each class session represents a specific occurrence of a course.

#### File Storage
- Lecture slides (PDF)
- Notes (PDF)
- Assignments (PDF)

#### Progress Tracking
- Material reviewed
- Homework completed
- Homework submitted

All progress is stored per user and per session.

---

### 4. Credit Tracker
A flexible system for monitoring graduation requirements.

Users can:
- Define custom credit categories
- Set required credit totals
- Track completed and in-progress credits
- Manually update progress

---

### 5. Sticky Notes
A lightweight system for reminders, deadlines, and quick notes.

---

## Authentication & Backend

Supabase is used as the backend service.

### Why Supabase

- **Database (PostgreSQL):** Stores structured academic data  
- **Authentication:** Handles secure user login and data separation  
- **Storage:** Manages PDF uploads and course materials  

Supabase was chosen because it provides a full backend stack through HTTP APIs, making it compatible with edge runtimes like Cloudflare Workers.

---

## Deployment

The application is deployed using **OpenNext.js Cloudflare adapter**.

### Deployment Flow


Next.js App → OpenNext Build → Cloudflare Workers Deployment → Live Application


This converts the Next.js application into an edge-compatible serverless deployment running globally on Cloudflare’s network.

---

## Data Model

### User
Managed via Supabase Authentication

---

### Course
- Course name
- Credit value

---

### Timetable Entry
- Day of week
- Time slot / period
- Associated course

---

### Calendar Override
- Specific date
- Modified schedule for that day

---

### Class Session
Represents a specific occurrence of a class.

Includes:
- Uploaded PDFs (stored in Supabase Storage)
- Progress tracking
- Session metadata

---

### Credit Category
- Required credits
- Completed credits
- In-progress credits

---

### Sticky Note
- Content
- Timestamp

---

## Storage Design

### Database (Supabase PostgreSQL)
Stores:
- Users
- Timetables
- Calendar overrides
- Academic progress
- Credit tracking data

### File Storage (Supabase Storage)
Stores:
- PDF lecture notes
- PDF assignments
- PDF class materials

### Design Reasoning
Structured relational data is stored in PostgreSQL, while large binary files are handled by object storage for efficiency and scalability.

---

## Key Architectural Decisions

### Why Next.js
- Full-stack framework (frontend + API routes)
- Built-in routing system
- Easy integration with backend services
- Optimized for production deployment

---

### Why TypeScript
- Strong typing for complex academic data models
- Improved maintainability
- Reduced runtime errors
- Better scalability for large features like scheduling logic

---

### Why Cloudflare Workers
- Global edge deployment
- Low latency worldwide
- Serverless architecture
- Scales automatically

---

### Why Supabase (instead of Prisma/D1)
Initially, Prisma and Cloudflare D1 were considered for a traditional database setup. However, the final architecture shifted to Supabase because:

- It provides database + authentication + storage in one system
- It works well with edge environments via HTTP APIs
- It avoids limitations of direct database connections in Cloudflare Workers

Prisma was not used in production due to edge runtime constraints.

---

## Challenges

- Adapting a Next.js application to Cloudflare Workers (edge runtime constraints)
- Designing a dynamic timetable → calendar generation system
- Handling file uploads efficiently using Supabase Storage
- Choosing an edge-compatible backend architecture
- Managing data consistency across timetable overrides and generated calendars

---

## Future Improvements

- Mobile application version
- Shared timetables between users
- Exam scheduling and tracking system
- Push notification system for reminders
- Collaborative study planning features

---
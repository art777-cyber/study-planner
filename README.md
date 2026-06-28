# Study Planner

## Live Demo

https://study-planner.aryarajtyagi777.workers.dev

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript  
- **Backend / BaaS:** Supabase (PostgreSQL, Auth, Storage)  
- **Deployment:** Cloudflare Workers (via OpenNext.js adapter)  
- **File Storage:** Supabase Storage  
- **ORM (legacy / experimental):** Prisma (not actively used in final architecture)

---

## Project Overview

Study Planner is a full-stack academic management web application designed to help university students organize courses, schedules, assignments, academic materials, and academic progress in one unified system.

It is built as both:
- a productivity tool for students  
- a portfolio project demonstrating modern full-stack and edge deployment architecture  

---

## System Architecture

User → Next.js Frontend → Cloudflare Workers (Edge Runtime) → Supabase (DB / Auth / Storage)


- Frontend deployed globally on Cloudflare edge network  
- Supabase handles authentication, database, and file storage  
- Communication happens via secure HTTP APIs  

---

## Goals

The application allows users to:

- Create and manage a weekly timetable  
- Generate a dynamic calendar from timetable  
- Override schedules for specific dates  
- Upload and store class materials (PDFs)  
- Track assignments and study progress  
- Monitor graduation credit requirements  
- Maintain sticky notes and reminders  

---

## Core Features

### 1. Timetable System
Weekly timetable acts as the base structure for all scheduling logic.

---

### 2. Calendar System
Dynamic calendar generated from timetable.

Users can:
- View daily class schedules  
- Navigate monthly views  
- Override specific dates (e.g., cancelled classes)  
- Preserve base timetable logic  

---

### 3. Class Session Workspace

Each class session represents a real occurrence of a course.

#### Includes:
- PDF uploads (notes, assignments, materials)  
- Progress tracking (revision, homework, submission)  
- Per-session storage in Supabase  

---

### 4. Credit Tracker
Tracks graduation progress.

Users can:
- Add custom credit categories  
- Define required credits  
- Track completed / in-progress credits  
- Update progress manually  

---

### 5. Sticky Notes
Quick notes system for reminders and tasks.

---

## Authentication & Backend

Built using Supabase.

### Why Supabase

- PostgreSQL database for structured academic data  
- Authentication system for user isolation  
- Storage system for PDFs and files  
- Works well with edge runtime via HTTP APIs  

---

## Deployment

### Initial Deployment (Attempt)
- First attempted deployment using Cloudflare + GitHub integration  
- Faced issues with build pipeline and configuration mismatch  

### Final Deployment (Working Setup)
- Successfully deployed using **manual Wrangler + OpenNext.js Cloudflare adapter**  
- Build process:

Next.js → OpenNext Build → Cloudflare Worker Bundle → Live Deployment


- Final live app runs on Cloudflare Workers globally  

---

## Data Model

### User
Handled by Supabase Auth

---

### Timetable Entry
- day of week  
- period  
- subject  

---

### Calendar Override
- specific date  
- modified schedule  

---

### Class Session Data
- file uploads  
- progress tracking  
- session metadata  

---

### Credit Category
- required credits  
- completed credits  
- in progress credits  

---

### Sticky Notes
- note content  
- timestamps  

---

## Storage Design

### Supabase PostgreSQL
Used for:
- users  
- timetable  
- calendar overrides  
- progress tracking  
- credit data  

### Supabase Storage
Used for:
- lecture PDFs  
- assignments  
- notes  

---

## Key Architectural Decisions

### Why Next.js
- Full-stack framework  
- API routes + frontend in one  
- Strong ecosystem  
- Easy integration with Supabase  

---

### Why TypeScript
- Strong typing for complex scheduling logic  
- Safer refactoring  
- Better scalability  

---

### Why Cloudflare Workers
- Global edge deployment  
- Low latency  
- Serverless scaling  
- Works well with static + API hybrid apps  

---

### Why Supabase (instead of Prisma/D1)
- Unified backend (DB + Auth + Storage)  
- Works with edge runtime via APIs  
- Avoids direct DB connection issues in Workers  

---

## Challenges

- Adapting Next.js to Cloudflare Workers edge constraints  
- Fixing OpenNext build + deployment pipeline issues  
- Designing timetable → calendar override system  
- Managing file uploads through Supabase Storage  
- Ensuring data consistency across multiple tables  
- **Setting up secure authentication persistence (logout + session handling was not implemented yet due to added complexity)**  
- Debugging CLI / deployment issues across Windows + Wrangler environment  

---

## Future Improvements

- Full authentication control (logout + account deletion flow via Edge Function)  
- Mobile application version  
- Shared timetables between users  
- AI-powered study planning suggestions  
- Push notifications for deadlines  
- Collaborative study planning features  
- Analytics dashboard for study performance  

---

## Summary

Study Planner evolved from a simple productivity tool into a full-stack edge-deployed academic system integrating:

- Next.js frontend  
- Supabase backend  
- Cloudflare global deployment  
- Real-time file + schedule management system
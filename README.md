# Study Planner

## Project Overview

Study Planner is a full-stack academic management web application designed to help university students organize courses, class materials, assignments, schedules, credits, and reminders in a unified system.

The project is being developed as both a personal productivity tool and a portfolio project demonstrating full-stack development using modern web technologies.

---

# Goals

The application allows users to:

- Create and edit a weekly timetable
- Generate a dynamic calendar from the timetable
- Override schedules for individual dates
- Upload and store class materials (PDFs)
- Track assignment and study progress
- Monitor graduation credit requirements
- Maintain reminders and sticky notes

---

# Core Features

## 1. Timetable System

Users define a weekly timetable which acts as a template for all calendar generation.

---

## 2. Calendar System

The calendar is dynamically generated from the timetable.

Users can:

- View classes by date
- Navigate between months
- Override individual dates (e.g. cancelled or rescheduled classes)
- Maintain original weekly timetable as a base template

---

## 3. Class Session Workspace

Each class session includes:

### File Storage
- Lecture Slides (PDF)
- Notes (PDF)
- Assignments (PDF)

### Progress Tracking
- Material Reviewed
- Homework Completed
- Homework Submitted

All progress is stored per user and per date.

---

## 4. Credit Tracker

A flexible system for tracking graduation credit requirements.

Users can:

- Add custom categories
- Define required credits
- Track completed and in-progress credits
- Manually update progress

---

## 5. Sticky Notes

A lightweight reminder system for deadlines and tasks.

---

# Architecture Decisions

## Why Next.js?

Next.js is used for:

- UI rendering
- Routing system
- API integration
- Easy deployment

It provides a full React-based framework suitable for full-stack applications.

---

## Why TypeScript?

TypeScript improves:

- Code reliability
- Debugging
- Data structure safety
- Maintainability

It is essential for managing complex state like schedules and academic data.

---

## Why Supabase?

Supabase is used as the backend because it provides:

### 1. Database (PostgreSQL)
Stores:
- Timetables
- Calendar overrides
- Credit tracking
- User data

### 2. Authentication
Handles:
- User login
- User-specific data separation
- Secure access control

### 3. File Storage
Stores:
- PDF lecture notes
- Assignments
- Class materials

---

## Why Authentication?

Authentication allows:

- Each user to have private data
- Secure separation of timetables and PDFs
- Real-world SaaS-style application structure

Without authentication, all users would share the same dataset.

---

## Why Cloudflare Deployment?

Cloudflare is used to:

- Host the frontend application
- Provide global access via a public URL
- Ensure fast performance
- Serve the application at scale

---

# Data Model

## User
Managed by Supabase Auth

---

## Course

- Course name
- Credits

---

## Timetable Entry

- Day of week
- Period
- Course

---

## Calendar Override

- Date
- Modified timetable for that specific date

---

## Class Session

Represents a specific class occurrence.

Contains:

- PDFs (stored in Supabase Storage)
- Progress tracking
- Session metadata

---

## Credit Category

- Required credits
- Completed credits
- In-progress credits

---

## Sticky Note

- Title
- Content
- Timestamp

---

# Storage Design

## Database stores:
- Structured academic data
- User progress
- Timetable and scheduling

## Supabase Storage stores:
- PDF files
- Uploaded course materials

## Reasoning:
Databases are optimized for structured data, while file storage systems are optimized for large binary files.

---

# Future Improvements

- Mobile app version
- Shared timetables between users
- Exam tracking system
- Notification system
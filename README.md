# Study Planner

## Project Overview

Study Planner is a personal academic management web application designed to help university students organize courses, class materials, assignments, schedules, credits, and reminders in a single location.

The application is being developed primarily for personal use but is also intended to serve as a portfolio project demonstrating software engineering decision-making, architecture planning, and full-stack web development skills.

---

# Goals

The application should allow a student to:

* Register and edit a semester timetable.
* Automatically generate a calendar from the timetable.
* Override individual dates when schedules change.
* Store class-specific study materials.
* Track assignment progress.
* Monitor graduation credit requirements.
* Maintain sticky-note reminders and deadlines.

---

# Core Features

## 1. Timetable Registration

Users can create and edit a weekly timetable.

The timetable serves as a template for generating calendar events.

---

## 2. Calendar

The calendar automatically generates class sessions based on the registered timetable.

Users can:

* View classes for any date.
* Edit individual dates.
* Add makeup classes.
* Remove cancelled classes.
* Handle holiday schedule changes.

The weekly timetable remains unchanged when individual dates are modified.

---

## 3. Class Session Workspace

Every class session has its own workspace.

Each session contains:

### File Storage

* Class Slides PDF
* Class Notes PDF
* Homework Questions PDF
* Homework Answers PDF

### Progress Tracking

* Class Content Reviewed
* Homework Completed
* Homework Submitted

These items are tracked independently for every class session.

---

## 4. Credit Tracker

A dedicated section for monitoring degree progress.

Users can create categories and manually update completed credits.

---

## 5. Sticky Notes

Homepage sticky notes allow quick reminders and deadlines.

---

# Architecture Decisions

## Why Next.js?

### Alternatives Considered

1. Vanilla HTML/CSS/JavaScript
2. React
3. Next.js

### Chosen

Next.js

### Reasoning

Vanilla JavaScript would require building routing, application structure, and backend functionality manually.

React provides reusable components but still requires separate decisions regarding backend architecture.

Next.js provides:

* React framework
* Routing
* Backend capability
* TypeScript support
* Easier deployment

This allows focus on application design rather than infrastructure.

---

## Why TypeScript?

### Alternatives Considered

1. JavaScript
2. TypeScript

### Chosen

TypeScript

### Reasoning

TypeScript provides type checking and catches mistakes during development.

The project is intended as a learning experience and portfolio project, making code reliability more important than minimizing complexity.

---

## Why Single User First?

### Alternatives Considered

1. Multi-user application
2. Single-user application

### Chosen

Single-user application

### Reasoning

Authentication, permissions, password management, and user isolation introduce substantial complexity.

The project's primary purpose is to create a useful personal productivity system.

Multi-user support can be added later if required.

---

## Why SQLite?

### Alternatives Considered

1. Browser Local Storage
2. SQLite
3. PostgreSQL

### Chosen

SQLite

### Reasoning

Local Storage is simple but becomes limiting once the application manages large amounts of structured data.

PostgreSQL is powerful but introduces additional infrastructure complexity.

SQLite provides:

* Structured database design
* Minimal setup
* Easy backups
* Future migration path

while remaining appropriate for a single-user application.

## Why Prisma?

### Alternatives Considered

1. Raw SQL Queries
2. Prisma ORM

### Chosen

Prisma ORM

### Reasoning

The application requires a way for the Next.js and TypeScript code to interact with the SQLite database.

Raw SQL provides direct control over database operations but requires writing and maintaining SQL queries throughout the application.

Prisma provides a higher-level interface that integrates well with TypeScript, reduces boilerplate code, and improves developer productivity.

For this project, the primary goal is to focus on application architecture, data modeling, and feature development rather than low-level database query management.

Prisma also provides a clear migration path if the project later moves from SQLite to a larger database system such as PostgreSQL.


---

# Data Model

## Course

Represents a university course.

Fields:

* Course Name
* Credits

---

## Timetable Entry

Represents a recurring weekly class.

Fields:

* Day of Week
* Period
* Course

---

## Calendar Override

Represents changes to a specific date.

---

## Class Session

Represents a specific occurrence of a class.

Contains:

* PDFs
* Progress Checkboxes
* Session Information

---

## Credit Category

Represents a graduation requirement category.

---

## Sticky Note

Represents a reminder displayed on the homepage.

---

# File Storage Design

### Alternatives Considered

1. Store PDFs inside database
2. Store PDFs as files and save references
3. Cloud storage

### Chosen

Store uploaded files separately and save file references in the database.
Database stores:
- Course data
- Timetable data
- Calendar data
- File paths

File system stores:
- Actual PDFs

### Reasoning

Databases are optimized for structured information rather than large binary files.

Storing files separately improves maintainability and mirrors common real-world application architecture.

---

# Future Improvements

Potential future features:

* User Accounts
* Authentication
* Cloud Storage
* Multi-user Support
* Shared Timetables
* Mobile Responsive Design
* Automatic Credit Calculations
* Grade Tracking
* Exam Tracking
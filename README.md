![](img/logo1.png)

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4)  ![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white) ![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white) ![AWS S3](https://img.shields.io/badge/S3-Storage-569A31?logo=amazon&logoColor=white) ![SignalR](https://img.shields.io/badge/SignalR-Realtime-512BD4?logo=dotnet) ![Nginx](https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?logo=nginx&logoColor=white) ![Hangfire](https://img.shields.io/badge/Hangfire-Background%20Jobs-FF6A00) ![Cloudflare](https://img.shields.io/badge/Cloudflare-Storage%20%26%20Security-F38020?logo=cloudflare&logoColor=white) ![Serilog](https://img.shields.io/badge/Serilog-Logging-2F2F2F) ![Seq](https://img.shields.io/badge/Seq-Logging-2F2F2F)

**StreamWatch** is a real-time synchronized media watching platform. It allows users to create rooms, synchronize video playback, and watch content together in real time using **SignalR**.

The platform supports third-party media synchronization (such as **YouTube**) as well as
temporary user-uploaded media via **S3 providers**.

---
## Table of Contents
- [Features](#features)
- [Architecture Diagram](#architecture-diagram)
- [Tech Stack](#tech-stack)
- [Production Deployment Guide](#production-deployment-guide)
- [Screenshots](#screenshots)
---
##  Features

- Real-time room-based media synchronization across multiple users
- YouTube video synchronization using shared playback state and timestamps
- **User-uploaded media support** via S3-compatible storage
- Thumbnail generation using **FFmpeg** (video) and **libvips** (images/gifs)
- Public and private rooms with real-time chat
- **Rich chat features:**
  - Text messaging
  - Image sharing
  - Private messages (whispers)
- **Country flag resolution** based on user IP using the **MaxMind GeoIP database**
- Role-based authentication and authorization using JWT
- Secure session handling with refresh tokens stored in HTTP-only cookies
- User profiles with customizable profile pictures
- **Friend system** with:
  - Friend requests
  - Room invitations
  - Real-time notifications
- User and room reporting system
- Moderation tools for abuse prevention

---
##  Architecture Diagram
![](img/archdiagram.png)

---
## Tech Stack
### Frontend
- React
- Vite
- Tailwind CSS
### Backend
- .NET / ASP.NET Core
- ASP.NET Identity
- SignalR (WebSockets)
- Hangfire (background jobs)
### Database
- PostgreSQL
- Entity Framework Core
- pgAdmin
### Caching & Realtime
- Redis Stack
- Redis OM
- Redis Insight
### Storage
- S3-compatible object storage (S3, Cloudflare R2)
### Observability
- Serilog
- Seq
### Infrastructure
- Docker / Docker Compose
- Nginx (reverse proxy)

---
# Production Deployment Guide

## Prerequisites

Before deploying the application, make sure you have the following tools installed on your server.
### Docker & Docker Compose

Docker is required to run all services (API, database, nginx, etc.) in containers.
- Install Docker:  
    [https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

---
### Node.js & NVM

The frontend build uses **Vite**, which requires Node.js.  
- Install NVM:  
    https://github.com/nvm-sh/nvm#installing-and-updating
    
After installing NVM, install Node.js:

`nvm install --lts nvm use --lts`

---
## Production Setup Steps

### 1. Clone the repository

`git clone https://github.com/lucas3546/StreamWatch.git`

---
### 2. Build the frontend

Navigate into the project and install frontend dependencies:

`cd StreamWatch`
`cd src/frontend npm install`

Build the frontend for production:

`npx vite build`

This will generate the production-ready frontend files

Go back to the project root:

`cd ../../`

---
### 3. Configure environment variables

Edit the `.env` file in the project root with your credentials:

`nano .env`

Save and close the file.

---
### 4. Configure Nginx domains

Edit the Nginx configuration file:

`nano default.conf`

Replace the following placeholders:

`server_name example.com www.example.com;`

With your real domain, example:

`server_name streamwatch.cc www.streamwatch.cc;`

---
### 5. Add SSL certificates

Place your SSL certificate files in the **project root directory**:

`cert.pem key.pem`

These files are required for HTTPS and are referenced by `default.conf`.

---
### 6. Start PostgreSQL and run database migrations

Start only the PostgreSQL service:

`docker compose up postgres`

Apply the schema migration:

`docker exec -i streamwatch-postgres-1 \   psql -U postgres -d pgdb \   < src/backend/StreamWatch.Infraestructure/migration.sql`

---
### 7. Start all services

Finally, start the full application stack:

`docker compose up -d`

---
### Default accounts

After the first startup, the application automatically creates the following default accounts:

| Role       | Email                   | Password          |
|------------|-------------------------|-------------------|
| Admin      | admin@streamwatch.cc    | Administrator1!  |
| Moderator | mod@streamwatch.cc      | Moderator1!      |

These credentials are intended for initial setup, change the passwords after the first login.

---
# Screenshots

Here are some screenshots of the site, including the moderation views.
### Main Page, rooms ordered by creation time
![](img/1.png)

### Room view for the leader (Admin role)
![](img/2.png)

### Room view for a user (User role)
![](img/3.png)

### Room playlist, add content from YouTube or local media
![](img/4.png)

### Invite friends to a room
![](img/5.png)

### User storage
![](img/6.png)

### Friend list
![](img/7.png)

### Friend request
![](img/8.png)

### Report user and report room
![](img/9.png)

### Report details view
![](img/10.png)

### Ban user (by account and IP address)
![](img/11.png)

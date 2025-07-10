# Skill Sharing Platform - Full Stack Web Application

## Overview

This is a full-stack web application built for sharing skills within a community. Users can post what they can teach and what they want to learn, creating a platform for knowledge exchange. The application uses a modern tech stack with React frontend, Express backend, and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store
- **API Design**: RESTful endpoints with JSON responses

### Development Setup
- **Monorepo Structure**: Shared schema and types between frontend and backend
- **Hot Reload**: Vite dev server with Express middleware integration
- **Database Migrations**: Drizzle Kit for schema management

## Key Components

### Database Schema (`shared/schema.ts`)
- **Skills Table**: Stores skill sharing posts with fields for name, teaching capabilities, learning interests, and timestamps
- **Validation**: Zod schemas for type-safe data validation
- **ORM**: Drizzle ORM for type-safe database operations

### API Layer (`server/routes.ts`)
- **GET /api/skills**: Retrieve all skills sorted by creation date
- **POST /api/skills**: Create new skill sharing posts with validation
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes

### Storage Layer (`server/storage.ts`)
- **Interface-based Design**: IStorage interface for potential database switching
- **In-Memory Implementation**: MemStorage for development/testing
- **User Management**: Basic user storage capabilities (prepared for future auth)

### Frontend Components
- **Home Page**: Main interface for viewing and creating skill posts
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Comprehensive shadcn/ui component library
- **Toast Notifications**: User feedback for successful operations

## Data Flow

1. **User Input**: Forms collect skill information through React Hook Form
2. **Validation**: Client-side validation using Zod schemas
3. **API Communication**: TanStack React Query handles API calls
4. **Database Operations**: Drizzle ORM executes type-safe database queries
5. **Response Handling**: JSON responses with proper error handling
6. **UI Updates**: Optimistic updates and cache invalidation through React Query

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for production
- **Connection**: @neondatabase/serverless for database connectivity
- **Environment**: DATABASE_URL environment variable required

### UI Framework
- **Radix UI**: Accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for UI elements

### Development Tools
- **Replit Integration**: Special handling for Replit environment
- **TypeScript**: Full type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Development
- **Vite Dev Server**: Hot reload with Express middleware integration
- **Database**: Requires PostgreSQL connection (Neon Database recommended)
- **Environment**: NODE_ENV=development for development features

### Production
- **Build Process**: Vite builds frontend, ESBuild bundles backend
- **Static Assets**: Frontend built to `dist/public` directory
- **Server**: Express serves both API and static files
- **Database**: PostgreSQL with connection pooling through Neon

### Configuration Requirements
- **Environment Variables**: DATABASE_URL must be set
- **Database Schema**: Run `npm run db:push` to apply schema changes
- **Port**: Server runs on configurable port (default from environment)

The application is designed to be easily deployable on platforms like Replit, Vercel, or any Node.js hosting provider with PostgreSQL support.
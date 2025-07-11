# SkillShareHub - Community Skill Sharing Platform

A full-stack web application for sharing skills within a community. Users can post what they can teach and what they want to learn, creating a platform for knowledge exchange.

## 🌟 Features

- **Skill Sharing**: Share what you can teach and what you want to learn
- **Community Discovery**: Browse skills shared by other community members
- **Real-time Updates**: Skills list updates immediately after submissions
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Form Validation**: Client and server-side validation
- **Database Persistence**: PostgreSQL database for reliable data storage

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** + shadcn/ui components
- **TanStack React Query** for state management
- **React Hook Form** with Zod validation
- **Wouter** for routing
- **Vite** for development and builds

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** with Drizzle ORM
- **RESTful API** with JSON responses
- **Environment-based configuration**

### Development
- **Monorepo structure** with shared types
- **Hot reload** with Vite middleware
- **Database migrations** with Drizzle Kit
- **TypeScript** for type safety

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SkillShareHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a PostgreSQL database named `skillsharehub`
   - Set the `DATABASE_URL` environment variable:
     ```bash
     $env:DATABASE_URL = "postgresql://username:password@localhost:5432/skillsharehub"
     ```

4. **Push the database schema**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   # On Windows
   npm run dev:win
   
   # On Unix/Linux/Mac
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📁 Project Structure

```
SkillShareHub/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
│   └── index.html         # HTML template
├── server/                # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
└── package.json           # Project dependencies
```

## 🗄️ Database Schema

```sql
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  can_teach TEXT NOT NULL,
  wants_to_learn TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## 🔧 API Endpoints

- `GET /api/skills` - Retrieve all skills (sorted by creation date)
- `POST /api/skills` - Create a new skill sharing post

## 🚀 Deployment

### Development
- Uses Vite dev server with hot reload
- PostgreSQL database required
- Environment variables needed

### Production
- Build frontend with Vite
- Bundle backend with ESBuild
- Serve static files from Express
- PostgreSQL with connection pooling

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Server port | `5000` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for community learning and knowledge sharing
- Inspired by the need for skill exchange platforms

---

**SkillShareHub** - Where knowledge meets opportunity! 🚀 
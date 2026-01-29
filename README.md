# Renovation Concierge

MVP web application that helps renovation concierges manage apartment and house renovations on behalf of busy homeowners.

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Prisma ORM with SQLite
- NextAuth (credentials provider)
- Next.js API routes
- Local file storage (`/public/uploads`)

## Features

- Admin / Concierge dashboard
- Client / Homeowner read-only view
- Project management (status, assignments)
- Timelines & milestones
- Site visits & inspections with notes and photos
- Defect / punch list management
- Deliveries tracking
- Project reports with photo gallery

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root based on `.env.example`.

At minimum you will need:

```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:3000.

### Database

Prisma is used with SQLite.

To set up the database and seed demo data:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

This will create:

- Admin user (concierge)
- Client user (homeowner)
- Demo project with milestones, site visits, defects, deliveries, and a sample report

### Auth

- Simple email + password auth using NextAuth credentials provider
- Admin / Concierge: full access
- Client / Homeowner: read-only access to assigned projects

### Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run start` - start production server
- `npx prisma studio` - open Prisma data browser

### Folder Structure

- `app/` - Next.js App Router pages and layouts
- `app/api/` - API routes (auth, CRUD operations)
- `components/` - UI components
- `lib/` - utilities (auth, prisma, helpers)
- `prisma/schema.prisma` - database schema
- `public/uploads/` - local file uploads (site visit photos, etc.)

### Definition of Done

- App runs locally with `npm run dev`
- Admin can manage renovation projects end-to-end
- Client can view progress, defects, and reports
- Defects can be tracked and approved
- This README explains setup and usage clearly

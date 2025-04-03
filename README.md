# SwiftRental - Car Rental Management System

A modern, scalable car rental management application built with Next.js, TypeScript, and PostgreSQL. Designed to handle customer management, vehicle inventory, and rental operations efficiently.

## Features

- **Customer Management**: Create, read, update, and delete customer records
- **Vehicle Management**: Track car inventory with detailed specifications
- **Rental Operations**: Monitor active rentals, manage rental status, and track mileage
- **Dashboard**: Get an overview of key metrics including available cars and active rentals
- **Search Functionality**: Quickly find customer and vehicle information

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS, Shadcn UI components
- **Backend**: Next.js API routes with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Development Environment**: Docker for database containerization
- **Authentication**: NextAuth.js for user authentication

## Prerequisites

- Node.js (v20 or higher)
- Docker and Docker Compose
- Git

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/houmairi/SwiftRental.git
cd SwiftRental
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/car_rental?schema=public" // if running postgres locally, when using docker, provide the ip address instead of the localhost ip. 
NODE_ENV="development"
```

4. **Start the PostgreSQL database with Docker**

```bash
docker-compose up -d
```

5. **Run database migrations**

```bash
npx prisma migrate dev
```

6. **Start the development server**

```bash
npm run dev
```

7. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

The project follows a clean architecture pattern with clear separation of concerns:

- `prisma/` - Database schema and migrations
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and services

## Database Schema

The database is designed with scalability and performance in mind:

- **Customer**: Stores customer information (name, contact details)
- **Car**: Tracks vehicle inventory with status and specifications
- **Rental**: Records rental transactions with mileage tracking

## Theoretical ToDos

- Complete car management UI
- Implement reporting features
- Add user authentication and role-based access control
- Develop mobile responsive views
- Add data visualization for rental statistics

## License

[MIT](https://choosealicense.com/licenses/mit/)

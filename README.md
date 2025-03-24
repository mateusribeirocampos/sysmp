# SYSMP - Document Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Modern document management system designed specifically for small teams and workgroups. SYSMP streamlines document tracking, internal delivery workflows, and deadline management without the complexity of enterprise solutions. Built with React frontend and Node.js backend.

![SYSMP Preview](https://via.placeholder.com/800x400.png?text=SYSMP+Interface+Preview)

## Features

- **User Authentication** - Secure login system with token-based authentication (no public registration - user accounts managed by admin)
- **Dashboard Analytics** - Visual document statistics and deadline tracking for better team oversight
- **Document Management** - Track document metadata, status, and ownership (document content remains external)
- **Internal Delivery System** - Record and monitor document handoffs between team members
- **Deadline Tracking** - Automated countdown for document due dates with visual indicators
- **User Management** - Role-based access control (Admin/User) for appropriate permissions
- **Responsive Design** - Fully mobile-friendly interface for access anywhere
- **Search & Filter** - Quickly locate documents using advanced search and filtering options

## How It Works

SYSMP focuses on **document metadata management** rather than document storage:

- Document details (title, owner, deadline, etc.) are stored in the database
- Physical documents remain in your existing storage systems
- The system tracks internal handoffs, reviews, and deadlines
- Daily countdown tracking helps ensure timely deliveries

## Technology Stack

### Frontend

- **Framework**: React ^18 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.2
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router 6.30.0
- **HTTP Client**: Axios 1.8.4

### Backend

- **Runtime**: Node.js 22.x
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```tree
sysmp/
├── frontend/        # React frontend application
├── backend/         # Node.js API and server
├── docs/            # Documentation for both components
└── scripts/         # Utility scripts for development
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js 22.11.0
- npm 9.x+ or yarn 1.x+
- MongoDB (local or connection string)

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mateusribeirocampos/sysmp.git
   cd sysmp/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Create an environment file:

   ```bash
   cp .env.example .env.local
   ```

   Update the environment variables in `.env.local` as needed.

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ../backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start the backend server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Roadmap

Features planned for future releases:

- **Email Notifications** - Automated alerts for approaching deadlines
- **Document Templates** - Pre-configured metadata for common document types
- **Reporting Module** - Generate insights on document workflows and bottlenecks
- **API Integrations** - Connect with common storage providers (Google Drive, OneDrive, etc.)
- **Audit Logging** - Comprehensive history of all document interactions

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m 'Add awesome feature'
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature
   ```

5. Open a Pull Request.

**_Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md)._**

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

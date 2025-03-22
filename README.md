# SYSMP - Document Management System (Frontend)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Modern frontend for SYSMP - A lightweight document management system designed for small teams and workgroups. Built with React and Vite.

![SYSMP Preview](https://via.placeholder.com/800x400.png?text=SYSMP+Interface+Preview)

## Features

- **User Authentication** - Secure login/registration system
- **Dashboard Analytics** - Visual document statistics and activity tracking
- **Document Management** - CRUD operations for documents
- **File Operations** - Secure upload/download with progress tracking
- **User Management** - Role-based access control (Admin/User)
- **Responsive Design** - Mobile-friendly interface
- **Search & Filter** - Quick document retrieval system

## Technology Stack

- React ^18 + TypeScript 5.8.2
- Vite 6.2.2
- Tailwind CSS 3.4.17
- React Router 6.30.0
- Axios 1.8.4

## Getting Started

### Prerequisites

- Node.js 22.11.0
- npm 9.x+ or yarn 1.x+
- Backend API (see [backend repository](https://github.com/mateusribeirocampos/sysmp/tree/main/backend))

### Setup

1. Clone the repository:

```bash
git clone https://github.com/mateusribeirocampos/sysmp.git
cd sysmp/frontend
```

Install dependencies:

```bash
npm install
# or
yarn
````

Create environment file:

```bash
cp .env.example .env.local
Update environment variables in .env.local
````

Development

```bash
npm run dev
# or
yarn dev
```

Project Structure

```tree
src/
├── assets/           # Static assets
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── hooks/            # Custom hooks
├── layouts/          # Application layouts
├── pages/            # Route components
├── services/         # API services
├── types/            # TypeScript definitions
├── utils/            # Utility functions
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## Documentation

API Integration

Component Library

Deployment Guide

## Contributing

### We welcome contributions! Please follow these steps

>`Fork the repository`
>>Create feature branch: `git checkout -b feature/your-feature`
>>>Commit changes: `git commit -m 'Add awesome feature'`
>>>>Push to branch: `git push origin feature/your-feature`
>>>>>`Open a Pull Request`

**_Please adhere to our code of conduct._**

License
Distributed under the MIT License. See LICENSE for more information.

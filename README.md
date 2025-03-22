# SYSMP - Document Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Modern frontend for SYSMP - A lightweight document management system designed for small teams and workgroups. Built with React and Vite.

![SYSMP Preview](https://via.placeholder.com/800x400.png?text=SYSMP+Interface+Preview)

## Features

- **User Authentication** - Secure login and registration system with token-based authentication.
- **Dashboard Analytics** - Visual document statistics and activity tracking for better insights.
- **Document Management** - Perform CRUD operations on documents with ease.
- **File Operations** - Secure file upload/download with progress tracking and error handling.
- **User Management** - Role-based access control (Admin/User) for secure collaboration.
- **Responsive Design** - Fully mobile-friendly interface for seamless use on any device.
- **Search & Filter** - Quickly retrieve documents using advanced search and filtering options.

## Technology Stack

- **Frontend Framework**: React ^18 + TypeScript 5.8.2
- **Build Tool**: Vite 6.2.2
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router 6.30.0
- **HTTP Client**: Axios 1.8.4
- Fronted (see [fronted repository](https://github.com/mateusribeirocampos/sysmp/tree/main/fronted))

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js 22.11.0
- npm 9.x+ or yarn 1.x+
- Backend API (see [backend repository](https://github.com/mateusribeirocampos/sysmp/tree/main/backend))

### Setup

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

### Project Structure

```plaintext
src/
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── hooks/            # Custom hooks
├── layouts/          # Application layouts
├── pages/            # Route components
├── services/         # API services and integrations
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

## Documentation

### API Integration

Refer to the [API documentation](https://github.com/mateusribeirocampos/sysmp/tree/main/backend/docs) for details on backend endpoints and integration.

### Component Library

The project uses a custom component library built with Tailwind CSS. Refer to the `components/` directory for reusable components.

### Deployment Guide

1. Build the project:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Serve the build files using a static server or integrate them with your backend.

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

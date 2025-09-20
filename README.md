# Sweet Shop Management System

A full-stack e-commerce web application designed as a TDD Kata to demonstrate modern development practices. Built with FastAPI backend and React frontend.

## Features

- 🍭 Browse and search sweet inventory
- 🛒 Purchase sweets with real-time inventory updates
- 👤 User authentication and authorization
- 🔐 Admin interface for inventory management
- 📱 Responsive design for all devices
- 🧪 Comprehensive test coverage with TDD approach

## Technology Stack

### Backend

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Reliable database with SQLAlchemy ORM
- **JWT Authentication** - Secure token-based auth
- **Pytest** - Comprehensive testing framework
- **Alembic** - Database migrations

### Frontend

- **React 18** - Modern UI library with JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **React Hook Form** - Form handling and validation
- **Vitest** - Fast testing framework

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

1. Navigate to backend directory:
    ```bash
    cd backend
    ```
2. Create virtual environment:
    ```bash
    python -m venv venv
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Set up environment variables:
    ```bash
    cp .env.example .env
    # Edit .env with your database credentials
    ```
5. Run database migrations:
    ```bash
    alembic upgrade head
    ```
6. Start the development server:
    ```bash
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```

### Frontend Setup

1. Navigate to frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Sweets Management

- `GET /api/v1/sweets/` - List all sweets
- `POST /api/v1/sweets/` - Create sweet (admin only)
- `GET /api/v1/sweets/search` - Search sweets
- `PUT /api/v1/sweets/{id}` - Update sweet (admin only)
- `DELETE /api/v1/sweets/{id}` - Delete sweet (admin only)
- `POST /api/v1/sweets/{id}/purchase` - Purchase sweet
- `POST /api/v1/sweets/{id}/restock` - Restock sweet (admin only)

### Users

- `GET /api/v1/users/me` - Get current user profile

## Project Structure

```
sweet-shop-management/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/    # API route handlers
│   │   ├── core/                # Configuration and security
│   │   ├── db/                  # Database setup
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   └── services/            # Business logic
│   ├── tests/                   # Backend tests
│   └── alembic/                 # Database migrations
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API services
│   │   └── test/                # Test utilities
│   └── public/                  # Static assets
└── project_specs/specs/         # Project specifications
```

## Development Workflow

This project follows Test-Driven Development (TDD) principles:

1. **Red** - Write failing tests first
2. **Green** - Implement minimal code to pass tests
3. **Refactor** - Improve code while maintaining test coverage

## My AI Usage

This project was developed with AI assistance to demonstrate modern development practices and TDD methodology. AI tools were used for:

- **Code Generation**: Initial boilerplate and component structures
- **Test Writing**: Comprehensive test suites following TDD principles
- **Documentation**: API documentation and README content
- **Best Practices**: Ensuring adherence to modern development standards

### AI Tools Used

- **Kiro AI Assistant**: Primary development partner for full-stack implementation
- **GitHub Copilot**: Code completion and suggestions
- **ChatGPT**: Architecture decisions and problem-solving

### AI Impact on Workflow

The AI assistance significantly accelerated development while maintaining high code quality:
- Faster initial setup and boilerplate generation
- Comprehensive test coverage from the start
- Consistent code patterns and best practices
- Rapid iteration on features and bug fixes

The combination of AI assistance and TDD methodology resulted in a robust, well-tested application that demonstrates modern full-stack development practices.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Implement the feature
5. Ensure all tests pass
6. Submit a pull request

## License


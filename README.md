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

## Overview with Images

<img width="1909" height="972" alt="image" src="https://github.com/user-attachments/assets/fe7c688d-5d40-4cec-af55-be7c142f1e59" />

## Home Page with sweets listing

<img width="1919" height="967" alt="image" src="https://github.com/user-attachments/assets/99bf1437-7f5e-473a-b584-f904ad2dcd32" />

## Footer Page

<img width="1919" height="929" alt="image" src="https://github.com/user-attachments/assets/b35a5f43-7b49-4758-b380-c988be9edcf4" />

## Contact us Page

<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/7a65c5bd-3eba-41b8-8d89-2d0507eab035" />

## Bulk order Page

<img width="1916" height="972" alt="image" src="https://github.com/user-attachments/assets/5d1abd92-a371-4b63-a564-0f485becbdb8" />

## Admin workflow

## Admin Login

<img width="1912" height="958" alt="image" src="https://github.com/user-attachments/assets/d2937e90-c740-46af-a1e8-e3c5cc034933" />

## Admin Panel

<img width="1919" height="584" alt="image" src="https://github.com/user-attachments/assets/714d3355-2602-4273-82a0-e34950fe0a31" />

## Inventory Management with search and filtering

<img width="1895" height="921" alt="image" src="https://github.com/user-attachments/assets/ba5bc92e-0e85-4c2c-b4ad-a9d52e55c15d" />

## Stock edit option

<img width="1919" height="918" alt="image" src="https://github.com/user-attachments/assets/4e973c1f-dd17-4727-ad5b-1d7d17b2175a" />

## Admin Sweet adding page

<img width="1919" height="960" alt="image" src="https://github.com/user-attachments/assets/3de07d14-4968-4dfd-bb2f-b6862db30270" />

## customer flow

## Register page for new customer

<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/0057a2ad-c375-431b-bcc9-fee1403fc5cb" />

## Customer login page

<img width="1917" height="914" alt="image" src="https://github.com/user-attachments/assets/372a92e0-e467-420a-967d-d21426070858" />

## Customer home page

<img width="1919" height="919" alt="image" src="https://github.com/user-attachments/assets/4b976230-50ee-458f-a930-81d85c6ca3b6" />

## Search and filter option

<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/a631c3da-4561-48d5-a6b1-c9f08dfffdc6" />

## Sweet collections page

<img width="1612" height="920" alt="image" src="https://github.com/user-attachments/assets/0a107766-dcd3-4561-96a1-ed91020424a7" />

## Customer cart page

<img width="1918" height="974" alt="image" src="https://github.com/user-attachments/assets/18db63a2-abbf-4988-97ad-e6e98828cf39" />

## Customer checkout page

<img width="1913" height="917" alt="image" src="https://github.com/user-attachments/assets/a3aba1c6-5ebd-49cd-930a-e8715b8b252d" />

## Customer order history page

<img width="1523" height="918" alt="image" src="https://github.com/user-attachments/assets/38593430-1691-4de6-8fdd-e735ac514782" />

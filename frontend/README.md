# ContestMaster Frontend

A modern Next.js frontend for the ContestMaster contest management platform.

## 🚀 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form** + **Zod** (Form validation)
- **Axios** (API client)
- **Lucide React** (Icons)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── organizer/           # Organizer section
│   │   │   ├── dashboard/       # Organizer dashboard
│   │   │   └── contests/        # Contest management
│   │   │       ├── create/      # Create contest
│   │   │       └── [id]/        # Contest details
│   │   ├── candidate/           # Candidate section (TODO)
│   │   └── jury/                # Jury section (TODO)
│   │
│   ├── components/              # React components
│   │   ├── shared/              # Shared components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Navbar.tsx
│   │   ├── organizer/           # Organizer-specific components
│   │   ├── candidate/           # Candidate-specific components
│   │   └── jury/                # Jury-specific components
│   │
│   ├── lib/                     # Utilities and configurations
│   │   ├── api.ts               # Axios API client
│   │   ├── auth.ts              # Auth utilities
│   │   └── utils.ts             # Helper functions
│   │
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts             # All API types
│   │
│   ├── actions/                 # Server actions
│   │   └── contests.ts          # Contest server actions
│   │
│   └── middleware.ts            # Next.js middleware (RBAC)
│
├── public/                      # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.mjs              # Next.js configuration
└── package.json                 # Dependencies
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### 4. Build for Production

```bash
npm run build
npm start
```

## 🔐 Authentication Flow

1. User registers/logs in via `/register` or `/login`
2. JWT token is stored in `localStorage`
3. Token is automatically attached to all API requests via Axios interceptor
4. Middleware protects routes based on authentication status
5. Role-based access control (RBAC) in layout components

## 👥 User Roles & Routes

### Organizer
- `/organizer/dashboard` - Dashboard with contest overview
- `/organizer/contests` - Contest list
- `/organizer/contests/create` - Create new contest
- `/organizer/contests/[id]` - Contest details & management

### Candidate (TODO)
- `/candidate/dashboard` - Candidate dashboard
- `/candidate/contests` - Available contests
- `/candidate/contests/[id]/register` - Contest registration
- `/candidate/submissions` - Submission management

### Jury Member (TODO)
- `/jury/dashboard` - Jury dashboard
- `/jury/evaluations` - Assigned evaluations
- `/jury/evaluations/[id]` - Evaluation interface

## 📝 Features Implemented

### ✅ Completed
- Authentication (Login/Register)
- Organizer Dashboard
- Contest Creation
- Contest Detail View
- Workflow Management
- Contest Statistics
- Rules Execution
- Jury Assignment
- Score Calculation
- Responsive UI with Tailwind CSS
- Form validation with React Hook Form + Zod
- Error handling and loading states
- RBAC middleware

### 🚧 TODO
- Candidate Section
  - Contest registration form
  - Submission upload (with progress bar)
  - Contest progress tracking
  - Results view
- Jury Section
  - Evaluation interface
  - Dynamic scoresheet
  - Anomaly alerts
- Advanced Features
  - Real-time updates (WebSocket/polling)
  - Pagination for large lists
  - Advanced filtering and search
  - File upload with progress
  - Export results (PDF/CSV)

## 🎨 UI Components

### Shared Components
- **Button** - Customizable button with variants (primary, secondary, danger, ghost)
- **Modal** - Reusable modal dialog
- **Alert** - Alert messages (success, error, warning, info)
- **Badge** - Status badges with color variants
- **Navbar** - Role-based navigation bar

### Form Components
All forms use React Hook Form with Zod validation for type-safe form handling.

## 🔌 API Integration

### API Client (`lib/api.ts`)
- Axios instance with base URL configuration
- Request interceptor for JWT token
- Response interceptor for error handling
- Automatic redirect on 401 Unauthorized

### Type Safety
All API responses are fully typed using TypeScript interfaces defined in `types/index.ts`.

## 🚦 Workflow Steps

1. **DRAFT** - Initial contest creation
2. **REGISTRATION** - Candidates can register
3. **PRE_SELECTION** - Rules execution and filtering
4. **JURY_EVALUATION** - Jury scoring phase
5. **RESULT** - Final results published

## 📊 Server Actions

Server actions are used for write operations (POST, PUT, DELETE):
- `createContestAction`
- `updateContestAction`
- `deleteContestAction`
- `transitionWorkflowAction`
- `executeRulesAction`
- `assignJuryAction`
- `calculateScoresAction`

## 🎯 Next Steps

1. **Implement Candidate Section**
   - Registration form with file uploads
   - Submission management
   - Progress tracking

2. **Implement Jury Section**
   - Dynamic scoresheet interface
   - Real-time score calculation
   - Anomaly detection UI

3. **Add Real-time Features**
   - WebSocket integration for live updates
   - Polling for dashboard statistics

4. **Enhance UX**
   - Loading skeletons
   - Optimistic UI updates
   - Toast notifications
   - Drag-and-drop file upload

5. **Testing**
   - Unit tests with Jest
   - Integration tests
   - E2E tests with Playwright

## 📚 Code Quality

- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting (recommended)
- **SOLID Principles** - Clean, maintainable code
- **Component Modularity** - Reusable components

## 🔗 API Endpoints Used

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /contests` - List contests (with pagination)
- `POST /contests` - Create contest
- `GET /contests/:id` - Get contest details
- `GET /contests/:id/statistics` - Get contest statistics
- `PUT /contests/:id` - Update contest
- `DELETE /contests/:id` - Delete contest
- `POST /workflow/:id/transition` - Transition workflow step
- `POST /rules/:id/execute` - Execute rules
- `POST /jury/:id/assign` - Assign jury
- `POST /scoring/:id/calculate` - Calculate scores
- `GET /scoring/:id/results` - Get contest results

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Add proper type definitions
4. Use React Hook Form for forms
5. Follow Tailwind CSS conventions
6. Add error handling for all API calls
7. Implement loading states

## 📄 License

MIT

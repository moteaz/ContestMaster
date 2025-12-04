# ContestMaster Frontend - Complete Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running on `http://localhost:3000`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

The `.env.local` file is already created with:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

If your backend runs on a different port, update this value.

### 3. Run Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3001`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3001
```

You'll be redirected to the login page.

## 👤 Test Users

Create test users using the registration page or via Postman:

### Organizer
```json
{
  "email": "organizer@test.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Organizer",
  "role": "ORGANIZER"
}
```

### Candidate
```json
{
  "email": "candidate@test.com",
  "password": "password123",
  "firstName": "Alice",
  "lastName": "Candidate",
  "role": "CANDIDATE",
  "age": 22,
  "institution": "University A"
}
```

### Jury Member
```json
{
  "email": "jury@test.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Expert",
  "role": "JURY_MEMBER",
  "age": 40,
  "institution": "University B"
}
```

## 🎯 Feature Testing Flow

### As Organizer

1. **Login** at `/login`
2. **Create Contest** at `/organizer/contests/create`
   - Fill in title, description, dates, max candidates
   - Click "Create Contest"
3. **View Dashboard** at `/organizer/dashboard`
   - See contest statistics
   - View all contests in table
4. **Manage Contest** at `/organizer/contests/[id]`
   - View contest details and statistics
   - Transition workflow steps
   - Execute rules
   - Assign jury
   - Calculate scores
   - View results

### As Candidate

1. **Login** at `/login`
2. **View Dashboard** at `/candidate/dashboard`
   - See available contests
   - View registered contests
3. **Browse Contests**
   - View contest details
   - Register for contests (TODO)
   - Upload submissions (TODO)

### As Jury Member

1. **Login** at `/login`
2. **View Dashboard** at `/jury/dashboard`
   - See assigned evaluations
   - View completed evaluations
3. **Evaluate Candidates** (TODO)
   - Access evaluation interface
   - Fill scoresheet
   - Submit scores

## 📁 Project Structure Explained

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── login/             # Authentication pages
│   │   ├── register/
│   │   ├── organizer/         # Organizer section
│   │   │   ├── dashboard/     # Main dashboard
│   │   │   └── contests/      # Contest management
│   │   │       ├── create/    # Create new contest
│   │   │       └── [id]/      # Contest details (dynamic route)
│   │   ├── candidate/         # Candidate section
│   │   │   ├── dashboard/
│   │   │   └── contests/
│   │   └── jury/              # Jury section
│   │       ├── dashboard/
│   │       └── evaluations/
│   │
│   ├── components/            # React components
│   │   ├── shared/           # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Alert.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Navbar.tsx
│   │   ├── organizer/        # Organizer-specific components
│   │   ├── candidate/        # Candidate-specific components
│   │   └── jury/             # Jury-specific components
│   │
│   ├── lib/                  # Utilities
│   │   ├── api.ts           # Axios API client with interceptors
│   │   ├── auth.ts          # Authentication utilities
│   │   └── utils.ts         # Helper functions
│   │
│   ├── types/               # TypeScript definitions
│   │   └── index.ts        # All API types
│   │
│   ├── actions/            # Server actions
│   │   └── contests.ts    # Contest server actions
│   │
│   └── middleware.ts       # Next.js middleware (auth & RBAC)
│
├── public/                 # Static assets
├── .env.local             # Environment variables
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind CSS config
└── next.config.mjs        # Next.js config
```

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token received from backend
3. Token stored in `localStorage`
4. Axios interceptor adds token to all requests
5. Middleware protects routes
6. Layout components enforce RBAC

## 🎨 UI Components Usage

### Button
```tsx
import Button from '@/components/shared/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

// Variants: primary, secondary, danger, ghost
// Sizes: sm, md, lg
```

### Modal
```tsx
import Modal from '@/components/shared/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  footer={
    <>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm}>Confirm</Button>
    </>
  }
>
  <p>Are you sure?</p>
</Modal>
```

### Alert
```tsx
import Alert from '@/components/shared/Alert';

<Alert type="success" message="Operation successful!" />
// Types: success, error, warning, info
```

### Badge
```tsx
import Badge from '@/components/shared/Badge';

<Badge variant="success">Active</Badge>
// Variants: default, success, warning, danger, info
```

## 🔌 API Integration

### Making API Calls

```tsx
import { api, handleApiError } from '@/lib/api';

// GET request
const fetchData = async () => {
  try {
    const response = await api.get('/contests');
    setData(response.data);
  } catch (err) {
    setError(handleApiError(err));
  }
};

// POST request
const createContest = async (data) => {
  try {
    const response = await api.post('/contests', data);
    return response.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

// PUT request
const updateContest = async (id, data) => {
  await api.put(`/contests/${id}`, data);
};

// DELETE request
const deleteContest = async (id) => {
  await api.delete(`/contests/${id}`);
};
```

### Type Safety

All API responses are typed:

```tsx
import type { Contest, PaginatedResponse } from '@/types';

const response = await api.get<PaginatedResponse<Contest>>('/contests');
// response.data is fully typed
```

## 📝 Form Handling

All forms use React Hook Form + Zod:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});

const onSubmit = async (data: FormData) => {
  // Handle form submission
};

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('title')} className="input" />
  {errors.title && <p className="error-text">{errors.title.message}</p>}
</form>
```

## 🚦 Workflow Management

Contest workflow steps:
1. **DRAFT** - Initial state
2. **REGISTRATION** - Open for candidate registration
3. **PRE_SELECTION** - Rules execution phase
4. **JURY_EVALUATION** - Jury scoring phase
5. **RESULT** - Final results published

Transition between steps:
```tsx
const handleTransition = async (toStep: WorkflowStep) => {
  await api.post(`/workflow/${contestId}/transition`, {
    toStep,
    triggeredBy: user.id
  });
};
```

## 🛠️ Development Tips

### Hot Reload
Next.js automatically reloads when you save files.

### TypeScript Errors
Run type checking:
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Clear Cache
If you encounter issues:
```bash
rm -rf .next
npm run dev
```

## 🐛 Troubleshooting

### "Cannot connect to API"
- Ensure backend is running on `http://localhost:3000`
- Check `.env.local` has correct API URL
- Verify CORS is enabled on backend

### "Unauthorized" errors
- Clear localStorage: `localStorage.clear()`
- Login again to get fresh token

### "Module not found" errors
- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```

### Styling not working
- Ensure Tailwind is properly configured
- Check `globals.css` is imported in layout
- Restart dev server

## 📦 Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

The build will be optimized and ready for deployment.

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
Set these in your hosting platform:
- `NEXT_PUBLIC_API_URL` - Your production API URL

## 📚 Next Steps

1. **Complete Candidate Features**
   - Contest registration form
   - File upload for submissions
   - Progress tracking

2. **Complete Jury Features**
   - Dynamic scoresheet interface
   - Score submission
   - Anomaly detection UI

3. **Add Real-time Features**
   - WebSocket for live updates
   - Polling for dashboard stats

4. **Enhance UX**
   - Loading skeletons
   - Toast notifications
   - Drag-and-drop uploads

5. **Testing**
   - Unit tests with Jest
   - E2E tests with Playwright

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT

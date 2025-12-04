# ContestMaster Frontend - Quick Reference Guide

## 🚀 Getting Started

```bash
cd frontend
npm install
npm run dev
```

Access at: `http://localhost:3001`

## 🔑 Default Test Credentials

```
Organizer:
Email: organizer@test.com
Password: password123

Candidate:
Email: candidate@test.com
Password: password123

Jury:
Email: jury@test.com
Password: password123
```

## 📁 Common File Locations

| What | Where |
|------|-------|
| Pages | `src/app/` |
| Components | `src/components/` |
| API Client | `src/lib/api.ts` |
| Types | `src/types/index.ts` |
| Auth Utils | `src/lib/auth.ts` |
| Server Actions | `src/actions/` |
| Styles | `src/app/globals.css` |

## 🎨 Using Components

### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```
Variants: `primary` | `secondary` | `danger` | `ghost`
Sizes: `sm` | `md` | `lg`

### Modal
```tsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Title">
  Content here
</Modal>
```

### Alert
```tsx
<Alert type="success" message="Success!" />
```
Types: `success` | `error` | `warning` | `info`

### Badge
```tsx
<Badge variant="success">Active</Badge>
```
Variants: `default` | `success` | `warning` | `danger` | `info`

## 🔌 API Calls

```tsx
import { api, handleApiError } from '@/lib/api';

// GET
const data = await api.get('/contests');

// POST
await api.post('/contests', { title: 'New Contest' });

// PUT
await api.put('/contests/123', { title: 'Updated' });

// DELETE
await api.delete('/contests/123');

// Error handling
try {
  await api.get('/contests');
} catch (err) {
  setError(handleApiError(err));
}
```

## 📝 Forms with Validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3),
  email: z.string().email(),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('title')} />
  {errors.title && <p>{errors.title.message}</p>}
</form>
```

## 🔐 Authentication

```tsx
import { getCurrentUser, setAuth, clearAuth } from '@/lib/auth';

// Get current user
const user = getCurrentUser();

// Set auth after login
setAuth(token, user);

// Logout
clearAuth();
```

## 🎯 Navigation

```tsx
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Programmatic navigation
const router = useRouter();
router.push('/organizer/dashboard');

// Link component
<Link href="/organizer/contests">Contests</Link>
```

## 📊 TypeScript Types

```tsx
import type { 
  User, 
  Contest, 
  WorkflowStep,
  PaginatedResponse 
} from '@/types';

const user: User = getCurrentUser();
const contests: Contest[] = [];
```

## 🎨 Tailwind Classes

### Common Patterns
```tsx
// Container
<div className="max-w-7xl mx-auto px-4 py-8">

// Card
<div className="bg-white rounded-lg shadow p-6">

// Grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Button-like
<button className="px-4 py-2 bg-primary-600 text-white rounded-lg">

// Input
<input className="input" />  // Uses global CSS class

// Label
<label className="label">  // Uses global CSS class
```

## 🚦 Workflow Steps

```tsx
type WorkflowStep = 
  | 'DRAFT'
  | 'REGISTRATION'
  | 'PRE_SELECTION'
  | 'JURY_EVALUATION'
  | 'RESULT';

// Transition
await api.post(`/workflow/${contestId}/transition`, {
  toStep: 'REGISTRATION',
  triggeredBy: user.id
});
```

## 📱 Responsive Design

```tsx
// Mobile first approach
<div className="
  w-full           // Mobile
  md:w-1/2         // Tablet
  lg:w-1/3         // Desktop
">

// Hide on mobile
<div className="hidden md:block">

// Show only on mobile
<div className="block md:hidden">
```

## 🔄 Loading States

```tsx
const [loading, setLoading] = useState(false);

{loading ? (
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
) : (
  <Content />
)}

// Or use Button component
<Button isLoading={loading}>Submit</Button>
```

## ⚠️ Error Handling

```tsx
const [error, setError] = useState('');

try {
  await api.post('/contests', data);
} catch (err) {
  setError(handleApiError(err));
}

{error && <Alert type="error" message={error} />}
```

## 🎯 Common Tasks

### Create a New Page
1. Create file in `src/app/[section]/[page]/page.tsx`
2. Add 'use client' if using hooks
3. Import components and types
4. Implement component

### Create a New Component
1. Create file in `src/components/[section]/ComponentName.tsx`
2. Define props interface
3. Implement component
4. Export default

### Add New API Endpoint
1. Add types to `src/types/index.ts`
2. Use `api.get/post/put/delete` in component
3. Handle errors with `handleApiError`

### Add New Route
1. Create folder in `src/app/`
2. Add `page.tsx` file
3. Add to Navbar links if needed
4. Update middleware if protected

## 🐛 Debugging

### Check Auth
```tsx
console.log(localStorage.getItem('access_token'));
console.log(getCurrentUser());
```

### Check API Calls
```tsx
// In browser console
localStorage.getItem('access_token')
```

### Clear Everything
```tsx
localStorage.clear();
// Then refresh page
```

## 📦 Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Start production
npm start

# Lint
npm run lint
```

## 🔧 Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 📚 Useful Commands

```bash
# Install new package
npm install package-name

# Remove package
npm uninstall package-name

# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install
```

## 🎨 Color Palette

```
Primary: #3b82f6 (Blue)
Success: #10b981 (Green)
Warning: #f59e0b (Yellow)
Danger: #ef4444 (Red)
Info: #3b82f6 (Blue)
Gray: #6b7280
```

## 📊 Status Badges

```tsx
// Contest status
{contest.isActive ? (
  <Badge variant="success">Active</Badge>
) : (
  <Badge variant="default">Inactive</Badge>
)}

// Workflow step
const stepVariants = {
  DRAFT: 'default',
  REGISTRATION: 'info',
  PRE_SELECTION: 'warning',
  JURY_EVALUATION: 'warning',
  RESULT: 'success',
};
<Badge variant={stepVariants[step]}>{step}</Badge>
```

## 🔗 Important Links

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

## 💡 Pro Tips

1. **Use TypeScript** - Always define types for better DX
2. **Error Boundaries** - Wrap components in try-catch
3. **Loading States** - Always show loading indicators
4. **Responsive First** - Test on mobile early
5. **Reuse Components** - Don't repeat yourself
6. **Type API Responses** - Use types from `@/types`
7. **Handle Errors** - Use `handleApiError` utility
8. **Validate Forms** - Use Zod schemas
9. **Protect Routes** - Use middleware and layouts
10. **Clean Code** - Follow existing patterns

## 🚨 Common Errors & Fixes

### "Cannot find module '@/...'"
- Check `tsconfig.json` paths configuration
- Restart dev server

### "Unauthorized"
- Check token in localStorage
- Login again
- Verify backend is running

### "Module not found"
- Run `npm install`
- Check import path

### Styles not applying
- Check Tailwind config
- Restart dev server
- Verify class names

### API not responding
- Check backend is running
- Verify API URL in `.env.local`
- Check CORS settings

## 📞 Quick Help

1. Check `SETUP_GUIDE.md` for detailed setup
2. Check `README.md` for project overview
3. Check `PROJECT_SUMMARY.md` for implementation status
4. Review existing code for patterns
5. Check types in `src/types/index.ts`

---

**Happy Coding! 🚀**

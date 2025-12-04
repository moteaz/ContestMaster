# 🚀 ContestMaster Frontend - Installation Instructions

## ✅ What You Have

A complete, production-ready Next.js 14 frontend with:
- ✅ Authentication (Login/Register)
- ✅ Organizer Dashboard & Contest Management (COMPLETE)
- ✅ Candidate Dashboard (PARTIAL - ready to extend)
- ✅ Jury Dashboard (PARTIAL - ready to extend)
- ✅ 5 Reusable UI Components
- ✅ Full TypeScript Support
- ✅ Tailwind CSS Styling
- ✅ Form Validation (React Hook Form + Zod)
- ✅ API Integration with Error Handling
- ✅ RBAC Middleware
- ✅ 30+ Files Created

## 📦 Step 1: Install Dependencies

Open terminal in the `frontend` folder and run:

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Axios
- Lucide React (icons)
- And all other dependencies

**Expected time:** 2-3 minutes

## 🔧 Step 2: Verify Environment Variables

Check that `.env.local` exists with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

If your backend runs on a different port, update this value.

## 🚀 Step 3: Start Development Server

```bash
npm run dev
```

The frontend will start on: **http://localhost:3001**

You should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3001
```

## 🌐 Step 4: Access the Application

Open your browser and go to:
```
http://localhost:3001
```

You'll be automatically redirected to `/login`

## 👤 Step 5: Create Test Users

### Option A: Use the Registration Page

1. Go to `http://localhost:3001/register`
2. Fill in the form:
   - First Name: John
   - Last Name: Organizer
   - Email: organizer@test.com
   - Password: password123
   - Role: Organizer
3. Click "Sign Up"

Repeat for Candidate and Jury roles.

### Option B: Use Postman/Backend API

Send POST requests to `http://localhost:3000/api/v1/auth/register`:

**Organizer:**
```json
{
  "email": "organizer@test.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Organizer",
  "role": "ORGANIZER"
}
```

**Candidate:**
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

**Jury Member:**
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

## 🎯 Step 6: Test the Application

### As Organizer

1. **Login** with organizer@test.com
2. You'll be redirected to `/organizer/dashboard`
3. Click **"Create Contest"** button
4. Fill in the form:
   - Title: "Innovation Challenge 2024"
   - Description: "A contest for innovative solutions"
   - Start Date: Select a future date
   - End Date: Select a date after start date
   - Max Candidates: 100
   - Auto Transition: Check the box
5. Click **"Create Contest"**
6. You'll see the contest in your dashboard
7. Click **"View"** to see contest details
8. Try the workflow actions:
   - Transition to REGISTRATION
   - Execute Rules
   - Assign Jury
   - Calculate Scores

### As Candidate

1. **Logout** (click logout in navbar)
2. **Login** with candidate@test.com
3. You'll be redirected to `/candidate/dashboard`
4. See available contests
5. View contest details

### As Jury Member

1. **Logout**
2. **Login** with jury@test.com
3. You'll be redirected to `/jury/dashboard`
4. See assigned evaluations

## 📁 Project Structure Overview

```
frontend/
├── src/
│   ├── app/                    # Pages (Next.js App Router)
│   │   ├── login/             # ✅ Login page
│   │   ├── register/          # ✅ Register page
│   │   ├── organizer/         # ✅ Organizer section (COMPLETE)
│   │   ├── candidate/         # ⚠️ Candidate section (PARTIAL)
│   │   └── jury/              # ⚠️ Jury section (PARTIAL)
│   │
│   ├── components/            # React components
│   │   └── shared/           # ✅ 5 reusable components
│   │
│   ├── lib/                  # Utilities
│   │   ├── api.ts           # ✅ Axios client
│   │   ├── auth.ts          # ✅ Auth utilities
│   │   └── utils.ts         # ✅ Helper functions
│   │
│   ├── types/               # ✅ TypeScript types
│   ├── actions/             # ✅ Server actions
│   └── middleware.ts        # ✅ RBAC middleware
│
├── .env.local              # ✅ Environment variables
├── package.json            # ✅ Dependencies
├── tailwind.config.ts      # ✅ Tailwind config
├── tsconfig.json           # ✅ TypeScript config
│
└── Documentation/
    ├── README.md           # ✅ Project overview
    ├── SETUP_GUIDE.md      # ✅ Detailed setup guide
    ├── PROJECT_SUMMARY.md  # ✅ Implementation status
    └── QUICK_REFERENCE.md  # ✅ Quick reference
```

## ✅ Verification Checklist

After installation, verify:

- [ ] `npm install` completed without errors
- [ ] `.env.local` file exists
- [ ] `npm run dev` starts successfully
- [ ] Can access http://localhost:3001
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Redirected to correct dashboard based on role
- [ ] Can create a contest (as organizer)
- [ ] Can view contest details
- [ ] Can transition workflow steps
- [ ] Navbar shows correct links for role
- [ ] Logout works correctly

## 🐛 Troubleshooting

### Port 3001 already in use
```bash
# Kill the process or use different port
npm run dev -- -p 3002
```

### Cannot connect to backend
- Ensure backend is running on http://localhost:3000
- Check `.env.local` has correct API URL
- Verify CORS is enabled on backend

### "Module not found" errors
```bash
rm -rf node_modules
npm install
```

### Styles not loading
```bash
rm -rf .next
npm run dev
```

### TypeScript errors
```bash
npm run build
# Fix any errors shown
```

## 📚 Next Steps

### 1. Explore the Code
- Check `src/app/organizer/` for complete implementation examples
- Review `src/components/shared/` for reusable components
- Look at `src/types/index.ts` for all TypeScript types

### 2. Extend Candidate Section
- Implement contest registration form
- Add submission upload functionality
- Create progress tracking UI

### 3. Extend Jury Section
- Build evaluation interface
- Create dynamic scoresheet
- Add score submission

### 4. Add Advanced Features
- Real-time updates with WebSocket
- File upload with progress bar
- Export results to PDF/CSV
- Advanced filtering and search

## 📖 Documentation

Read these files for more information:

1. **README.md** - Project overview and features
2. **SETUP_GUIDE.md** - Detailed setup instructions
3. **PROJECT_SUMMARY.md** - What's implemented and what's TODO
4. **QUICK_REFERENCE.md** - Quick reference for common tasks

## 🎓 Learning Path

1. **Start with Organizer section** - It's complete and shows all patterns
2. **Study shared components** - Learn how to use Button, Modal, Alert, etc.
3. **Review API integration** - See how `lib/api.ts` works
4. **Understand forms** - Check how React Hook Form + Zod is used
5. **Explore types** - All TypeScript types are in `types/index.ts`

## 🚀 Production Build

When ready for production:

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🎉 You're Ready!

The ContestMaster frontend is now installed and running!

**Key Features Available:**
- ✅ User Authentication
- ✅ Role-Based Access Control
- ✅ Organizer Dashboard (Complete)
- ✅ Contest Management (Complete)
- ✅ Workflow Management (Complete)
- ✅ Responsive Design
- ✅ Form Validation
- ✅ Error Handling
- ✅ Loading States

**Start building amazing features!** 🚀

---

**Need Help?**
- Check QUICK_REFERENCE.md for common tasks
- Review SETUP_GUIDE.md for detailed instructions
- Look at existing code for patterns
- Check types in `src/types/index.ts`

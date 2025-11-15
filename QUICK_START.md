# 🚀 Quick Start Guide - Firebase Authentication

## Test Your Authentication System

### 1. Start Dev Server
```bash
npm run dev
```

### 2. Create Test Account
1. Go to `http://localhost:3000`
2. Click "Student Login"
3. Click "Don't have an account? Sign up"
4. Use email: `yourname@cuny.edu`
5. Password: `test123456`
6. Click "Create Account"

### 3. Verify Email
1. Check your email inbox
2. Click verification link
3. Return to app

### 4. Login
1. Enter your credentials
2. Click "Sign In"
3. Access dashboard

---

## Key Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| Sign Up | ✅ | Create new accounts with CUNY email |
| Login | ✅ | Authenticate existing users |
| Email Verification | ✅ | Send and verify email addresses |
| CUNY Validation | ✅ | Only @cuny.edu domains allowed |
| Protected Routes | ✅ | Block unverified/unauthenticated users |
| Logout | ✅ | Sign out functionality |
| Error Handling | ✅ | User-friendly error messages |

---

## File Structure

```
lib/
├── firebase.ts          # Firebase configuration
├── AuthContext.tsx      # Global auth state
└── authHelpers.ts       # Auth functions

app/
├── layout.tsx           # Wrapped with AuthProvider
├── page.tsx             # Landing page with login/signup
├── verify-email/
│   └── page.tsx         # Email verification page
├── dashboard/
│   └── page.tsx         # Protected dashboard
├── courses/
│   └── page.tsx         # Protected courses page
└── chat/
    └── [courseId]/
        └── page.tsx     # Protected chat page

components/
└── ProtectedRoute.tsx   # Route protection wrapper
```

---

## Important Functions

### Sign Up
```typescript
import { signUpUser } from '@/lib/authHelpers';
await signUpUser(email, password);
```

### Login
```typescript
import { signInUser } from '@/lib/authHelpers';
const user = await signInUser(email, password);
```

### Check Verification
```typescript
import { checkEmailVerification } from '@/lib/authHelpers';
const isVerified = await checkEmailVerification();
```

### Access Current User
```typescript
import { useAuth } from '@/lib/AuthContext';
const { user, loading, signOut } = useAuth();
```

---

## Firebase Console Links

- **Users:** https://console.firebase.google.com/project/class-connect-182c0/authentication/users
- **Firestore:** https://console.firebase.google.com/project/class-connect-182c0/firestore
- **Email Templates:** https://console.firebase.google.com/project/class-connect-182c0/authentication/templates

---

## Common Test Scenarios

✅ Sign up with CUNY email → Success  
❌ Sign up with Gmail → Error: "Please use a valid CUNY email"  
✅ Login before verification → Redirect to /verify-email  
✅ Login after verification → Redirect to /dashboard  
✅ Access /dashboard without login → Redirect to /  
✅ Logout → Clear session, redirect to /  

---

## Week 1 Status: ✅ COMPLETE

**Deliverable Achieved:** Verified users can log in successfully

**Ready for Week 2:** Course Selection & Chat Creation


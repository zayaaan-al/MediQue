# Authentication System Guide

## Overview
The authentication system has been completely redesigned to provide a unified login experience with context-aware registration for different user types (patients, hospitals, and admin).

## Key Features

### 1. **Unified Login System**
- Single login form (`/login`) that automatically detects user type based on email
- Supports three user types:
  - **Admin**: Hardcoded credentials (admin222@gmail.com / admin@123)
  - **Hospitals**: Must be registered and approved by admin
  - **Patients**: Can register and login immediately

### 2. **Portal-Specific Access**
- **Patient Portal** (`/patient-portal`): Login/Register for patients only
- **Hospital Portal** (`/hospital-portal`): Login/Register for hospitals only
- Both portals have integrated login and registration in one page

### 3. **Hospital Registration & Approval Workflow**
1. Hospital registers via Hospital Portal or general signup
2. Registration status set to "pending"
3. Admin reviews and approves/rejects via Admin Dashboard
4. Hospital can only login after approval
5. Login attempt shows appropriate message based on status:
   - Pending: "Please wait for admin approval"
   - Rejected: Shows rejection reason
   - Approved: Successful login

## File Structure

### New Files Created
- `/components/Login.jsx` - Unified login component for all user types
- `/components/PatientPortal.jsx` - Patient-specific portal with login/register
- `/components/HospitalPortal.jsx` - Hospital-specific portal with login/register

### Modified Files
- `/components/SignUp.jsx` - Updated to support URL-based registration type
- `/components/LandingPage.jsx` - Updated portal links
- `/App.jsx` - Updated routing structure

### Removed Files
- Old `PatientLogin.jsx` and `HospitalAuth.jsx` are no longer used (can be deleted)

## Routes

### Public Routes
- `/` - Landing page
- `/login` - Unified login (auto-detects user type)
- `/signup` - General signup with toggle between patient/hospital
- `/patient-portal` - Patient login/register page
- `/hospital-portal` - Hospital login/register page

### Protected Routes
- `/patient/*` - Patient dashboard and features
- `/hospital/*` - Hospital dashboard and features
- `/admin/*` - Admin dashboard and features

## User Flows

### Patient Registration & Login
1. Click "Patient Portal" on landing page → `/patient-portal`
2. New users: Click "Register here" → Fill patient registration form
3. Existing users: Enter email/password → Login
4. Redirects to `/patient` dashboard

### Hospital Registration & Login
1. Click "Hospital Portal" on landing page → `/hospital-portal`
2. New hospitals: Click "Register Hospital" → Fill hospital registration form
3. System sets status to "pending"
4. Admin approves via `/admin/hospital-approvals`
5. Hospital can now login → Redirects to `/hospital` dashboard

### Admin Login
1. Use any login page (`/login`, `/patient-portal`, or `/hospital-portal`)
2. Enter admin credentials:
   - Email: admin222@gmail.com
   - Password: admin@123
3. Redirects to `/admin` dashboard

## Navigation Flow

### From Landing Page (Not Logged In)
- **Patient Portal** button → `/patient-portal` (Patient login/register)
- **Hospital Portal** button → `/hospital-portal` (Hospital login/register)
- **Sign Up** in nav → `/signup` (General signup with toggle)
- **Sign In** in nav → `/login` (Unified login)

### From Landing Page (Logged In)
- Shows user-specific dashboard links
- Sign Out button clears session and returns to landing page

## Data Storage (localStorage)

### Keys Used
- `registeredPatients` - Array of patient accounts
- `registeredHospitals` - Array of hospital accounts
- `currentPatient` - Currently logged-in patient
- `currentHospital` - Currently logged-in hospital
- `currentAdmin` - Currently logged-in admin

### Hospital Object Structure
```javascript
{
  id: "H1234567890",
  hospitalName: "General Hospital",
  email: "hospital@example.com",
  password: "encrypted_password",
  licenseNumber: "HL123456789",
  address: "123 Healthcare Ave",
  city: "New York",
  state: "NY",
  zipCode: "10001",
  phone: "+1 (555) 123-4567",
  hospitalPhoto: "base64_string_or_null",
  adminFirstName: "John",
  adminLastName: "Smith",
  adminPhone: "+1 (555) 987-6543",
  status: "pending|approved|rejected",
  rejectionReason: "reason_if_rejected",
  registeredAt: "2024-01-01T00:00:00.000Z"
}
```

### Patient Object Structure
```javascript
{
  id: "P1234567890",
  firstName: "John",
  lastName: "Doe",
  name: "John Doe",
  email: "john@example.com",
  password: "encrypted_password",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1990-01-01",
  avatar: "default_avatar_url",
  registeredAt: "2024-01-01T00:00:00.000Z"
}
```

## Testing the System

### Test Patient Registration
1. Go to `/patient-portal`
2. Click "Register here"
3. Fill in patient details
4. Submit → Should show success message
5. Login with same credentials → Should redirect to `/patient`

### Test Hospital Registration & Approval
1. Go to `/hospital-portal`
2. Click "Register Hospital"
3. Fill in all hospital and admin details
4. Submit → Should show "wait for admin approval" message
5. Login as admin (admin222@gmail.com / admin@123)
6. Go to `/admin/hospital-approvals`
7. Approve the hospital
8. Logout and login as hospital → Should redirect to `/hospital`

### Test Unified Login
1. Go to `/login`
2. Enter patient email/password → Redirects to `/patient`
3. Enter hospital email/password → Redirects to `/hospital`
4. Enter admin credentials → Redirects to `/admin`

## Security Notes

⚠️ **Important**: This is a demo implementation using localStorage. For production:
- Implement proper backend authentication
- Use secure password hashing (bcrypt, argon2)
- Implement JWT or session-based authentication
- Add CSRF protection
- Implement rate limiting
- Use HTTPS only
- Add email verification
- Implement proper password reset flow

## Future Enhancements

- Email verification for new registrations
- Two-factor authentication (2FA)
- Social login (Google, Facebook, etc.)
- Password strength meter
- Account recovery options
- Session timeout
- Remember me functionality
- Login history tracking

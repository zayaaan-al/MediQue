# Appointment Request Flow Guide

## Overview
Complete appointment booking system where patients can book appointments, hospitals can accept/reject them, and patients can see real-time status updates.

## Complete Flow

### 1. **Patient Books Appointment**

**Patient Actions:**
1. Navigate to `/patient/appointments` (Book Appointment)
2. Select a hospital from the list of approved hospitals
3. View available doctors at that hospital
4. Click "Book Appointment" on a doctor
5. Fill in appointment details:
   - Preferred Date
   - Preferred Time
   - Reason for Visit
6. Submit the booking request

**What Happens:**
- Appointment request is created with status: `pending`
- Request is saved to `localStorage` under `appointmentRequests`
- Request includes:
  - Patient information (ID, name, avatar)
  - Doctor information (ID, name, specialization)
  - Hospital name
  - Appointment date and time
  - Reason for visit
  - Creation timestamp
- Success toast notification shown to patient
- Request is immediately visible to the hospital

---

### 2. **Hospital Reviews Request**

**Hospital Actions:**
1. Navigate to `/hospital/appointments` (Appointment Requests)
2. View all appointment requests for their hospital
3. See request details:
   - Patient name and ID
   - Doctor assigned
   - Requested date and time
   - Reason for visit
   - Time since request was made
4. Filter requests by status (All, Pending, Approved, Rejected)

**Available Actions:**
- **Approve**: Accept the appointment request
- **Reject**: Decline with optional reason
- **Reschedule**: (Future feature)

---

### 3. **Hospital Approves/Rejects Request**

#### **If Approved:**
- Request status changes to `approved`
- `approvedAt` timestamp is added
- Updated in `localStorage`
- Success toast: "Appointment approved for [Patient Name]! Patient will be notified."
- Patient can see the approval in their Appointment Status page

#### **If Rejected:**
- Modal opens asking for rejection reason (optional)
- Request status changes to `rejected`
- `rejectedAt` timestamp and `rejectionReason` are added
- Updated in `localStorage`
- Warning toast: "Appointment rejected for [Patient Name]. Patient will be notified."
- Patient can see the rejection and reason in their Appointment Status page

---

### 4. **Patient Views Appointment Status**

**Patient Actions:**
1. Navigate to `/patient/appointment-status` (Appointment Status)
2. View all their appointment requests
3. See status of each request:
   - **Pending**: Yellow badge, waiting for hospital review
   - **Approved**: Green badge, appointment confirmed
   - **Rejected**: Red badge, with rejection reason if provided

**Status Information Displayed:**
- Doctor name and hospital
- Appointment date and time
- Reason for visit
- Request submission date
- Current status with color-coded badges
- Status-specific messages:
  - **Pending**: "Your appointment request is pending review by the hospital."
  - **Approved**: "Your appointment has been confirmed! Please arrive 15 minutes early."
  - **Rejected**: Shows rejection reason and suggests contacting hospital

**Filter Options:**
- All Appointments
- Pending
- Approved
- Rejected

**Statistics Dashboard:**
- Total Pending Appointments
- Total Approved Appointments
- Total Rejected Appointments
- Total Appointments

---

## Data Structure

### Appointment Request Object
```javascript
{
  id: 1234567890,                    // Unique timestamp ID
  patientId: "P1234567890",          // Patient's unique ID
  patientName: "John Doe",           // Patient's full name
  patientAvatar: "url...",           // Patient's profile picture
  doctorId: "D1234567890",           // Doctor's unique ID
  doctorName: "Dr. Sarah Smith",     // Doctor's full name
  specialization: "Cardiology",      // Doctor's specialization
  hospitalName: "General Hospital",  // Hospital name
  date: "2024-12-20",                // Appointment date
  time: "10:00 AM",                  // Appointment time
  reason: "Annual checkup",          // Reason for visit
  requestedTime: "2024-12-20, 10:00 AM", // Combined date/time
  status: "pending",                 // pending | approved | rejected
  timeAgo: "Just now",               // Human-readable time
  createdAt: "2024-12-15T10:30:00Z", // ISO timestamp
  approvedAt: "2024-12-15T11:00:00Z", // ISO timestamp (if approved)
  rejectedAt: "2024-12-15T11:00:00Z", // ISO timestamp (if rejected)
  rejectionReason: "Doctor unavailable" // Optional rejection reason
}
```

---

## User Interface Components

### Patient Module
1. **Book Appointment** (`/patient/appointments`)
   - View approved hospitals
   - Browse doctors by hospital
   - Submit appointment requests

2. **Appointment Status** (`/patient/appointment-status`)
   - View all appointment requests
   - See real-time status updates
   - Filter by status
   - View statistics

3. **Find Doctors** (`/patient/find-doctors`)
   - Alternative way to book appointments
   - Search and filter doctors
   - Book directly from doctor list

### Hospital Module
1. **Appointment Requests** (`/hospital/appointments`)
   - View all requests for the hospital
   - Filter by status
   - Approve/Reject requests
   - See statistics dashboard

---

## Key Features

### Real-Time Updates
- Changes made by hospital are immediately visible to patients
- No page refresh needed (data loaded from localStorage)
- Status changes persist across sessions

### Smart Filtering
- Both patients and hospitals can filter by status
- Quick access to pending requests
- Easy review of historical appointments

### User Notifications
- Toast notifications for all actions
- Success messages for approvals
- Warning messages for rejections
- Info messages for pending status

### Data Persistence
- All appointment data stored in `localStorage`
- Survives page refreshes
- Accessible across different sessions
- Key: `appointmentRequests`

---

## Navigation Paths

### Patient Routes
- `/patient/appointments` - Book new appointment
- `/patient/appointment-status` - View appointment status
- `/patient/find-doctors` - Browse and book with doctors

### Hospital Routes
- `/hospital/appointments` - Manage appointment requests
- `/hospital` - Dashboard (shows appointment summary)

---

## Status Flow Diagram

```
Patient Books Appointment
         ↓
    [PENDING]
         ↓
Hospital Reviews Request
         ↓
    ┌────┴────┐
    ↓         ↓
[APPROVED] [REJECTED]
    ↓         ↓
Patient    Patient
Notified   Notified
```

---

## Testing the Flow

### Test Case 1: Successful Appointment
1. Login as patient
2. Go to "Book Appointment"
3. Select a hospital and doctor
4. Fill appointment details and submit
5. Go to "Appointment Status" - see PENDING status
6. Logout and login as hospital
7. Go to "Appointment Requests"
8. Find the request and click "Approve"
9. Logout and login as patient
10. Go to "Appointment Status" - see APPROVED status ✅

### Test Case 2: Rejected Appointment
1. Follow steps 1-7 from Test Case 1
2. Click "Reject" instead
3. Enter rejection reason
4. Submit rejection
5. Logout and login as patient
6. Go to "Appointment Status" - see REJECTED status with reason ✅

### Test Case 3: Multiple Appointments
1. Book multiple appointments as patient
2. Login as hospital
3. Approve some, reject others
4. Login as patient
5. Use filters to view different statuses ✅

---

## Future Enhancements

- Email/SMS notifications for status changes
- Calendar integration
- Appointment reminders
- Rescheduling functionality
- Payment integration
- Video consultation option
- Appointment history export
- Rating system after appointment completion

---

## Technical Notes

### LocalStorage Keys
- `appointmentRequests` - Array of all appointment requests
- `currentPatient` - Currently logged-in patient
- `currentHospital` - Currently logged-in hospital
- `registeredHospitals` - List of all hospitals
- `hospitalDoctors` - List of all doctors

### Status Values
- `pending` - Awaiting hospital review
- `approved` - Confirmed by hospital
- `rejected` - Declined by hospital

### Color Coding
- **Yellow** - Pending (waiting)
- **Green** - Approved (success)
- **Red** - Rejected (error)

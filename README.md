# Medique - Healthcare Management System

A modern, AI-enhanced web application that revolutionizes hospital scheduling and patient management. Built with React, Tailwind CSS, and modern web technologies.

## 📁 Project Structure

This project is organized with a clear separation between frontend and backend:

```
medique/
├── frontend/                    # Frontend React application
│   ├── src/                    # Source code
│   ├── index.html             # HTML entry point
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── postcss.config.js      # PostCSS configuration
├── backend/                    # Backend API (future)
└── README.md                  # Project documentation
```

## 🚀 Features

### 👩‍⚕️ Patient Module
- **User Registration & Login**: Secure patient authentication system
- **Doctor Discovery**: Browse doctors by specialization with detailed profiles
- **Smart Booking**: AI-suggested time slots based on availability and patterns
- **Real-time Queue Tracking**: Live updates on appointment status and wait times
- **Appointment Management**: Book, cancel, reschedule appointments easily
- **History & Reviews**: View past appointments and leave doctor feedback

### 🏥 Hospital/Doctor Module
- **Doctor Profile Management**: Comprehensive doctor and schedule management
- **Dynamic Appointment Handling**: Accept/reject requests with real-time updates
- **Patient Overview**: Detailed patient information and appointment history
- **Live Queue Management**: Real-time queue status updates
- **AI Insights**: Predictive analytics for time management and patient load

### 🧑‍💼 Admin Module
- **Multi-Hospital Management**: Centralized control of hospitals and staff
- **Analytics Dashboard**: Performance metrics and appointment statistics
- **Queue Optimization**: Monitor peak hours and patient satisfaction
- **Feedback Management**: Handle user reviews and system improvements
- **AI-Powered Insights**: Data-driven healthcare management recommendations

## 🤖 AI & Automation Features

- **Smart Time Slot Prediction**: AI analyzes patterns for optimal booking times
- **Queue Prediction Engine**: Real-time wait time estimation using predictive modeling
- **Priority Scheduling**: Automatic prioritization of critical/emergency appointments
- **Sentiment Analysis**: Review and feedback analysis for performance improvement
- **Load Balancing**: AI-driven patient flow optimization

## 🛠️ Technology Stack

- **Frontend**: React.js + Tailwind CSS for responsive, modern UI
- **Routing**: React Router for seamless navigation
- **Icons**: Material Symbols for consistent iconography
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for fast development and building
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medique
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (Vite default port)

## 🏗️ Frontend Structure

```
frontend/
├── src/
│   ├── components/              # Shared components
│   │   ├── shared/             # Reusable UI components
│   │   │   ├── Layout.jsx      # Main layout wrapper
│   │   │   ├── Navigation.jsx  # Navigation component
│   │   │   └── Footer.jsx      # Footer component
│   │   ├── LandingPage.jsx     # Homepage with features showcase
│   │   ├── PatientLogin.jsx    # Patient authentication
│   │   ├── HospitalAuth.jsx    # Hospital authentication
│   │   └── QueueManagement.jsx # Real-time queue monitoring
│   ├── modules/                # Modular architecture
│   │   ├── admin/              # Admin Module
│   │   │   └── components/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminSidebar.jsx
│   │   │       ├── HospitalManagement.jsx
│   │   │       └── HospitalApprovals.jsx
│   │   ├── hospital/           # Hospital Module
│   │   │   └── components/
│   │   │       ├── HospitalDashboard.jsx
│   │   │       ├── HospitalSidebar.jsx
│   │   │       ├── AddDoctor.jsx
│   │   │       └── AppointmentRequests.jsx
│   │   └── patient/            # Patient Module
│   │       └── components/
│   │           ├── PatientDashboard.jsx
│   │           ├── PatientSidebar.jsx
│   │           └── DoctorsList.jsx
│   ├── App.jsx                 # Main application with routing
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html                  # HTML entry point
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js            # Vite configuration
└── postcss.config.js         # PostCSS configuration
```

## 🎨 Design System

### Colors
- **Primary**: `#13a4ec` - Medical blue for trust and professionalism
- **Background Light**: `#f6f7f8` - Clean, clinical appearance
- **Background Dark**: `#101c22` - Dark mode support

### Typography
- **Font Family**: Inter - Modern, readable sans-serif
- **Font Weights**: 400 (regular), 500 (medium), 700 (bold), 900 (black)

### Components
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: Full dark theme support
- **Accessibility**: WCAG compliant color contrasts and interactions

## 🌐 Routes

### Public Routes
- `/` - Landing page with system overview
- `/login` - Authentication and registration
- `/payment` - Secure payment processing

### Admin Module Routes
- `/admin` - Admin dashboard
- `/admin/hospitals` - Hospital management
- `/admin/doctors` - Doctor management
- `/admin/patients` - Patient management
- `/admin/appointments` - Appointment oversight
- `/admin/analytics` - System analytics
- `/admin/settings` - System settings

### Hospital Module Routes
- `/hospital` - Hospital dashboard
- `/hospital/doctors` - Doctor management
- `/hospital/appointments` - Appointment management
- `/hospital/queue` - Live queue monitoring
- `/hospital/schedules` - Schedule management
- `/hospital/reports` - Hospital reports
- `/hospital/settings` - Hospital settings

### Patient Module Routes
- `/patient` - Patient dashboard
- `/patient/find-doctors` - Doctor discovery
- `/patient/appointments` - Appointment management
- `/patient/queue-status` - Queue status tracking
- `/patient/medical-records` - Medical history
- `/patient/prescriptions` - Prescription management
- `/patient/billing` - Billing and payments
- `/patient/profile` - Profile settings
- `/patient/help` - Help and support

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🎯 Key Benefits

### For Patients
- ✅ Reduced waiting times with AI-optimized scheduling
- ✅ Real-time queue updates and notifications
- ✅ Convenient online appointment management
- ✅ Transparent communication with healthcare providers

### For Hospitals
- ✅ Streamlined workflow and reduced administrative overhead
- ✅ Improved patient throughput and satisfaction
- ✅ Data-driven insights for operational optimization
- ✅ Enhanced staff productivity and resource allocation

### For Administrators
- ✅ Centralized multi-hospital management
- ✅ Comprehensive analytics and reporting
- ✅ AI-powered predictive insights
- ✅ Scalable system architecture

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **Telemedicine Integration**: Video consultation capabilities
- **IoT Integration**: Smart hospital equipment connectivity
- **Advanced AI**: Machine learning for predictive healthcare
- **Multi-language Support**: Internationalization features
- **API Integration**: Third-party healthcare system connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact:
- Email: contact@qasystem.com
- Phone: +1 (234) 567-890

---

**Built with ❤️ for better healthcare management**

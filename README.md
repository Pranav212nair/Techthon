# VIGIL – Empathy-Driven Predictive Maintenance Platform

AI-powered automotive maintenance platform with predictive analytics, voice-first AI assistant, real-time vehicle health monitoring, and closed-loop OEM feedback.

## 🚀 Features

### Core Capabilities
- **Real-time Sensor Monitoring** – Live vehicle telemetry dashboard with animated gauges (battery voltage, coolant temperature, tire pressure, engine load)
- **Predictive Maintenance** – Vehicle-type-specific service interval predictions with smart scheduling
- **AI Assistant** – Voice-enabled conversational AI for maintenance queries and booking assistance
- **Analytics Dashboard** – Health trends, cost analysis, mileage progression with interactive charts
- **Notifications Center** – Critical alerts with customizable preferences (email, push, alert types)
- **Service History** – Complete maintenance log with cost tracking and export capabilities
- **Vehicle Profile** – Detailed vehicle information with personalized service schedules
- **Multi-role Support** – Tailored experiences for vehicle owners, fleet managers, service centers, and OEM quality teams

### Vehicle Types Supported
- 🏍️ Bikes/Motorcycles (3.5k km oil, 600 km chain)
- 🚗 Cars (10k km oil, 20k km brakes)
- 🚙 SUVs (10k km general, 20k km suspension)
- 🚚 Trucks/Commercial (15k km oil, 30k km clutch)
- ⚡ Electric Vehicles (20k km brakes/cooling)

## 🛠️ Tech Stack

- **Frontend:** React 18.2, TypeScript 5.6, Vite 5.4
- **Styling:** Tailwind CSS 3.4, Framer Motion 11
- **State Management:** Zustand 4.5, localStorage persistence
- **Data Visualization:** Recharts 2.12
- **Voice Input:** Web Speech API (webkitSpeechRecognition)
- **Routing:** React Router 6.28
- **Icons:** Lucide React
- **Error Handling:** React Error Boundaries

## ⚡ Quick Start

### Installation
```bash
# Clone repository
git clone https://github.com/Pranav212nair/Techthon.git
cd Techthon

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
techthon/
├── src/
│   ├── pages/              # Route components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AssistantPage.tsx
│   │   ├── ServicePage.tsx
│   │   ├── VehicleProfilePage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ServiceHistoryPage.tsx
│   │   ├── NotificationsPage.tsx
│   │   ├── AnalyticsPage.tsx
│   │   └── AppointmentsPage.tsx
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LiveSensorPanel.tsx
│   │   ├── VehicleHealthPanel.tsx
│   │   └── VoiceConversationPanel.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useVehicleStore.ts
│   │   └── useOnboarding.ts
│   ├── services/           # API and business logic
│   │   └── api.ts
│   ├── animations/         # Framer Motion presets
│   │   └── motionPresets.ts
│   ├── types.ts            # TypeScript definitions
│   ├── App.tsx             # Root component with routing
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tailwind.config.cjs     # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🎯 User Flows

### 1. New User Onboarding
1. Sign up / Log in
2. Select role (Owner, Fleet Manager, Service Center, OEM)
3. Enter vehicle details (type, make, model, year, odometer, climate)
4. Set driving preferences
5. → Dashboard with personalized recommendations

### 2. Service Booking
1. Navigate to Assistant or Service page
2. View AI-generated service recommendations
3. Select service type and preferred date/time
4. Confirm booking with service center
5. Receive confirmation and reminders

### 3. Health Monitoring
1. View real-time sensor data on Dashboard
2. Check health score and trend analytics
3. Receive critical alerts via Notifications
4. Track mileage and predict next service

## 🔐 Data Storage

Uses localStorage for client-side persistence:
- `vigil_auth` – User authentication data
- `onboarding` – Vehicle and preference data
- `appointments` – Service booking records
- `service_history` – Maintenance log entries
- `notifications` – Alert inbox
- `notification_preferences` – User settings

## 🎨 Design System

- **Color Palette:** Dark theme with accent colors (cyan/teal)
- **Typography:** System fonts with uppercase tracking
- **Components:** Glass-morphism panels with neon glows
- **Animations:** Smooth transitions with Framer Motion
- **Responsive:** Mobile-first design with Tailwind breakpoints

## 🧪 Testing

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributors

**Pranav Nair** – [GitHub](https://github.com/Pranav212nair)

## 🔗 Links

- **Repository:** https://github.com/Pranav212nair/Techthon
- **Live Demo:** [Coming Soon]

---

Built with ❤️ for the Techathon

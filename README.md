# 🎓 Abroad Simplified — Study Abroad & Counselling Platform

**Abroad Simplified** is a modern, AI-powered study abroad counseling ecosystem designed to empower ambitious international students and streamline advisor workflows.

---

## ✨ Features

- 🎓 **Smart University Predictor**: Search and compare 500+ top universities across 40+ countries based on academic profile, GPA, GRE/IELTS scores, and fees.
- 🧠 **Psychometric & IQ Cognitive Assessments**: Comprehensive evaluations to map student personalities to high-growth career tracks and top-tier global programs.
- 👨‍🏫 **Counsellor Allotment & Workload Engine**: Automated Shortest Job First (SJF) algorithm for allocating students to certified study abroad advisors.
- 🔐 **Redesigned Split-Screen Authentication**:
  - Left Side: Sleek Sign In / Register / Forgot Password card with mobile-responsive 2-column input layout.
  - Right Side: Modern **Bento Box Architecture** featuring 2D brand vector graphics, live statistics counters, and feature highlights.
- 📊 **Role-Based Portals (Student, Counsellor, Admin)**:
  - **Student Dashboard**: Application progress, test reports, advisor allotment, and tool access requests.
  - **Counsellor Panel**: Student allotment queues, meeting notes, profile management, and application tracking.
  - **Admin Control**: User role management, tool access permissions, and platform-wide analytics.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: Vanilla CSS Modules, Tailwind CSS Utilities, Custom CSS Variable Tokens
- **Authentication & Backend**: Firebase Authentication, Cloud Firestore
- **Icons & Assets**: Custom 2D Vector Graphics, Lucide / Feather Icons

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js (v18+)** and **npm** installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/abroad-simplified.git
   cd "as ds"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
as ds/
├── public/                     # Static assets & 2D infographic graphics
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── (main)/             # Core layout & platform tools
│   │   ├── api/                # REST endpoints (auth, counsellor, tests)
│   │   └── auth/               # Split-screen Auth page (Login/Register)
│   ├── components/             # Reusable UI components
│   │   ├── Admin/              # Admin dashboard controls
│   │   ├── Auth/               # AuthForm & Bento AuthInfographics
│   │   ├── Counsellor/         # Counsellor panel components
│   │   ├── Dashboard/          # Student dashboard widgets
│   │   └── Layout/             # Topbar, Sidebar, Navigation
│   ├── lib/                    # Firebase config, SJF allotment, test logic
│   └── styles/                 # CSS Modules (auth, dashboard, globals)
└── README.md
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.

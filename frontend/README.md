# Infralab Frontend

Infralab is a modern, interactive SaaS platform for practicing and evaluating system design architectures. This is the frontend application built with React, TypeScript, and Vite.

## 🚀 Key Features

*   **Interactive Design Canvas**: Drag-and-drop interface powered by React Flow to build system architectures.
*   **AI-Powered Evaluation**: Get instant feedback on your design's scalability, bottleneck analysis, and best practices using **Google Gemini AI**.
*   **Flow Animation**: Visualize request flow through your architecture with animated edges and nodes.
*   **User Authentication**: Seamless sign-up and login with Google OAuth integration.
*   **Role-Based Access**: Access different levels of system design problems (Free vs. Pro).
*   **Responsive UI**: Modern, clean interface designed with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Zustand
- **Diagramming**: React Flow (@xyflow/react)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

## 📁 Project Structure

```
src/
├── api/             # API client and service calls
├── components/      # Reusable UI components (Button, Input, Panel, etc.)
├── features/        # Feature-based modules
│   └── workspace/   # Core design workspace (Canvas, Palette, Feedback)
├── pages/           # Application pages (Login, Signup, Workspace, Dashboard)
├── store/           # Global state (Zustand store)
├── types/           # TypeScript interfaces
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- Backend running (see [Backend README](../Infralab-backend/README.md))

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Note**: 
- `VITE_API_BASE_URL` should point to your backend server.
- `VITE_GOOGLE_CLIENT_ID` must match the one used in the backend.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

This will generate a `dist` folder containing the static assets ready for deployment.

### 6. Preview Production Build

```bash
npm run preview
```

## 🎨 Design System

We use a custom design system with Tailwind CSS variables for theming.
- **Colors**: Defined in `index.css` as CSS variables (e.g., `--color-primary`, `--color-bg-secondary`).
- **Components**: Found in `src/components`, styled with `clsx` and `tailwind-merge` for flexibility.

## 🧪 Deployment

This project can be easily deployed to Vercel, Netlify, or any static site host.
Ensure you set the environment variables in your deployment platform settings.

## 📄 License

MIT

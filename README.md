# My Game List Frontend

[![Maintainability](https://api.codeclimate.com/v1/badges/005e009f096170220106/maintainability)](https://codeclimate.com/github/MyGameListPlaceholder/my-game-list-frontend/maintainability)

A modern, responsive web application for gamers to track their game collections, write reviews, rate titles, and connect with friends. This project serves as the frontend client for the My Game List platform.

## 🚀 Features

- **Game Management:** Browse extensive game libraries, view details, and manage your personal lists (Playing, Completed, Plan to Play, etc.).
- **Social Connection:** Search for users, send friend requests, and view friend's activities.
- **Reviews & Ratings:** Rate games and write detailed reviews.
- **Advanced Search:** Filter games by company, genre, or title.
- **User Profiles:** Customize your profile and view statistics.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [DaisyUI](https://daisyui.com/)
- **State Management & Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)
- **API Client Generation:** [OpenAPI-TS](https://hey-api.dev/openapi-ts)
- **Testing:** [Vitest](https://vitest.dev/)
- **Linting & Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

## ⚙️ Prerequisites

- **Node.js:** v18 or higher recommended.
- **Backend:** The application relies on the [My Game List Backend](https://github.com/MyGameListPlaceholder/my-game-list-backend). Ensure you have access to the backend API and its `openapi.json` definition.

## 📥 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/my-game-list-frontend.git
   cd my-game-list-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**
   The project uses environment variables. You can check `env/.env.development` for reference.
   Create a `.env` file in the root directory if you need custom configurations:

   ```bash
   VITE_API_URL=http://localhost:8000
   ```

4. **API Definition:**
   The `dev` script expects the backend's `openapi.json` file to generate the API client.
   - **Option A:** Have the backend project checked out at `../my-game-list-backend/`. The script will attempt to copy `openapi.json` from there.
   - **Option B:** Manually place the `openapi.json` file in the root of this project before running dev.

## 🏃‍♂️ Running the Application

### Development Server

Starts the Vite development server. This command will also attempt to regenerate the API client from `openapi.json`.

```bash
npm run dev
```

### Production Build

Builds the application for production.

```bash
npm run build
```

### Preview Production Build

Locally preview the production build.

```bash
npm run preview
```

## 🧪 Testing & Code Quality

- **Run Tests:**

  ```bash
  npm run test
  ```

- **Check Test Coverage:**

  ```bash
  npm run coverage
  ```

- **Lint Code:**

  ```bash
  npm run lint
  ```

- **Format Code:**

  ```bash
  npm run format
  ```

## 🐳 Docker

To build and run the application using Docker:

1. **Build the image:**

   ```bash
   docker build -t my-game-list-frontend .
   ```

2. **Run the container:**

   ```bash
   docker run -p 3000:80 my-game-list-frontend
   ```

## 📂 Project Structure

```text
src/
├── assets/         # Static assets (images, logos)
├── client/         # Generated API client code (do not edit manually)
├── components/     # Reusable UI components (Forms, Filters, Layouts)
├── css/            # Global styles and color definitions
├── helpers/        # Constants, Types, and helper functions
├── hooks/          # Custom React hooks (Data fetching, logic)
├── pages/          # Application page views (Home, Login, GameDetail, etc.)
├── services/       # Service layer
└── tests/          # Unit and integration tests
```

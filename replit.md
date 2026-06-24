# Confizio Admin Panel

## Overview
A React-based admin panel for managing conferences. Built with Create React App (CRA), Tailwind CSS, and React Router.

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, React Hook Form, React Hot Toast, React Helmet
- **Styling**: Tailwind CSS 3, PostCSS, Autoprefixer
- **Build System**: Create React App (react-scripts)

## Project Structure
```
src/
  App.js              - Main app with routing
  index.js            - Entry point
  index.css           - Global styles
  pages/
    Login.js          - Login page
    Pagenotfound.js   - 404 page
    Admin/            - Admin-only pages
      AdminDashboard.js
      AdminProfile.js
      AllConferences.js
      ConferenceRequests.js
      RejectedConferences.js
      UpdateConference.js
  components/
    AdminSidebar.js
    ConfirmationModal.js
    Header.js
    Layout.js
    Spinner.js
  context/
    Auth.js           - Authentication context
  routes/
    adminAuth.js      - Protected route for admin
public/
  index.html
```

## Configuration
- **Port**: 5000 (dev server)
- **Host**: 0.0.0.0 (allows Replit proxy)
- **Host check**: Disabled via `DANGEROUSLY_DISABLE_HOST_CHECK=true`
- **Backend proxy**: `http://localhost:3012` (configured in package.json)
- **API base URL**: Set via `REACT_APP_API` environment variable

## Running the App
```bash
npm start
```

## Deployment
- Type: Static site
- Build command: `npm run build`
- Public dir: `build`

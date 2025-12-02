# Profit Hub

This is the Profit Hub project, a web application built with React and Rsbuild.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 20.x or higher
- **npm**: Usually comes with Node.js

## Local Setup

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd profit-hub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory of the project. You can use the `.env.example` file as a reference if available.
    
    Add the necessary environment variables. For example:
    ```env
    VITE_DERIV_APP_ID=113960
    VITE_DERIV_REDIRECT_URL=http://localhost:5000/callback
    ```
    
    > **Note:** `VITE_DERIV_APP_ID` is required for Deriv API authentication. `VITE_DERIV_REDIRECT_URL` should match the redirect URL configured in your Deriv App settings.

4.  **Start the development server:**
    ```bash
    npm start
    ```
    The application should now be running at `http://localhost:5000`.

## Build for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment to Vercel

You can easily deploy this project to Vercel using the Vercel website.

1.  **Push your code to GitHub/GitLab/Bitbucket.**

2.  **Log in to Vercel:**
    Go to [vercel.com](https://vercel.com) and log in with your account.

3.  **Add New Project:**
    - Click on **"Add New..."** and select **"Project"**.
    - Import your `profit-hub` repository.

4.  **Configure Project:**
    - **Framework Preset:** Vercel should automatically detect the settings.
    - **Build Command:** `npm run build` (Default).
    - **Output Directory:** `dist` (Automatically configured via `vercel.json`).
    - **Install Command:** `npm install` (Default).

5.  **Environment Variables:**
    - Expand the **"Environment Variables"** section.
    - Add all the environment variables from your `.env` file here.
    - **Crucial:** Ensure `VITE_DERIV_REDIRECT_URL` is set to your Vercel deployment URL (e.g., `https://your-project.vercel.app/callback`).

6.  **Deploy:**
    - Click **"Deploy"**.
    - Vercel will build and deploy your application.

### Important Note on Redirect URL
When deploying to Vercel, you must update the `VITE_DERIV_REDIRECT_URL` environment variable in Vercel settings to match your production URL (e.g., `https://your-app-name.vercel.app/callback`). You also need to ensure this URL is whitelisted in your Deriv App settings.

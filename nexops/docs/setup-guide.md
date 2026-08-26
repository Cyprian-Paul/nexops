# NexOps Setup Guide

## What you need before starting

- A GitHub account, since Railway deploys from a GitHub repository
- A Railway account, at railway.app
- A free Google AI Studio account, for the Gemini API key
- A free Cloudinary account, for profile picture uploads
- A free Resend account, for password reset emails
- Node.js installed locally, for running the React frontend during development
- PHP installed locally, if you want to test the backend on your own machine before deploying

## Project structure

```
nexops/
  frontend/       React application
  backend/        PHP API, organized by feature
  docs/           This documentation
```

## Step 1: Set up the database

1. Open backend/database/schema.sql
2. Run this file against a MySQL database, either locally through XAMPP or WAMP,
   or directly on Railway once you add a MySQL plugin to your project
3. This creates all required tables: users, tickets, assets, network_devices, password_resets

## Step 2: Set environment variables

These are never written directly into the code. Set them in Railway's project settings,
under the Variables tab, or in a local .env file if testing on your own machine.

| Variable | Purpose |
|---|---|
| DB_HOST | Database host address |
| DB_NAME | Database name, nexops |
| DB_USER | Database username |
| DB_PASSWORD | Database password |
| DB_PORT | Database port, usually 3306 |
| GEMINI_API_KEY | Your Google AI Studio API key, for the AI ticket assistant |
| RESEND_API_KEY | Your Resend API key, for password reset emails |

## Step 3: Deploy the backend to Railway

1. Push your project to a GitHub repository
2. In Railway, create a new project and connect that repository
3. Add a MySQL plugin from Railway's plugin menu
4. Add all environment variables listed above under your project's Variables tab
5. Railway automatically builds and deploys on every push to your repository

## Step 4: Connect Cloudinary

1. Create a free Cloudinary account
2. In your Cloudinary dashboard, note your cloud name
3. Create an unsigned upload preset under Settings, Upload
4. Open frontend/src/pages/Settings.jsx and replace the placeholder cloud name and
   upload preset with your own values

## Step 5: Run the frontend locally during development

```
cd frontend
npm install
npm run start
```

## Step 6: Test the full flow

1. Register a new account as an admin
2. Log in and confirm the dashboard shows the full admin view
3. Register a second account as a regular user, confirm it only shows tickets
4. Submit a test ticket and confirm the AI suggestion appears
5. From the admin account, update the ticket's status and assignment
6. Add a test network device and run a manual check
7. Add a test asset and assign it to a user
8. Open the reports page and confirm the numbers reflect your test data

## Troubleshooting

- If login fails with a database error, double check your environment variables match
  exactly what Railway's MySQL plugin provided
- If the AI suggestion never appears, confirm GEMINI_API_KEY is set correctly and that
  your Google AI Studio key has not been revoked
- If network checks always show offline, some hosting environments block ICMP ping
  traffic. This is a known limitation to revisit if it comes up after deployment

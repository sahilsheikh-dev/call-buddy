# 📞 Call Buddy

**Call Buddy** is a lightweight, mobile-friendly calling assistant designed to streamline outbound sales and cold-calling workflows. It forces discipline into call tracking instead of letting data rot in free-text chaos.

🌐 **Live URL**: [https://call-buddy.dev](https://call-buddy.dev)

---

## 🚀 Project Overview

Manual call tracking fails for three reasons:
humans forget, humans improvise, and humans lie to CRMs.

Call Buddy fixes that by enforcing a **one-lead-at-a-time workflow** with mandatory outcomes.

With Call Buddy, users can:

* Log in with predefined credentials
* View **one unprocessed lead at a time**
* Initiate calls directly from the browser (mobile-friendly)
* Record call outcomes, comments, and optional recordings
* Automatically move to the next lead after saving

No skipping. No half-filled records. No excuses.

---

## 🛠️ Tech Stack

Built with tools that are fast, boring, and proven:

* **Vite** – fast dev server and optimized builds
* **React** – predictable component architecture
* **TypeScript** – fewer runtime surprises
* **Tailwind CSS** – utility-first, no CSS bloat
* **shadcn/ui** – accessible, composable UI components

No over-engineering. No framework worship.

---

## 🧑‍💻 Local Development

### Prerequisites

* Node.js (LTS recommended)
* npm

---

### Setup Steps

```sh
# 1. Clone the repository
git clone https://github.com/sahilsheikh-dev/call-buddy.git

# 2. Enter the project directory
cd call-buddy

# 3. Install dependencies
npm install
```

---

### 🔐 Environment Configuration (MANDATORY)

This project **will not work** without environment variables.

1. Create a `.env` file in the project root:

```sh
touch .env
```

2. Add the following variables **(replace values with your own credentials):**

```env
# Google Sheets Configuration
VITE_GOOGLE_SHEET_ID=YOUR_GOOGLE_SHEET_ID
VITE_GOOGLE_SHEET_NAME=YOUR_SHEET_NAME

# Google Drive (for call recordings / assets)
VITE_GOOGLE_DRIVE_FOLDER_ID=YOUR_DRIVE_FOLDER_ID

# Google API & Auth
VITE_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_GOOGLE_ACCESS_TOKEN=YOUR_GOOGLE_ACCESS_TOKEN

# Google Apps Script Webhook
VITE_SHEET_WEBHOOK_DEPLOYMENT_ID=YOUR_APPS_SCRIPT_DEPLOYMENT_ID
```

⚠️ **Rules you don’t get to ignore:**

* `.env` **must NOT be committed**
* Add `.env` to `.gitignore`
* Restart the dev server after changing env values
* All variables must be prefixed with `VITE_` (Vite requirement)

---

### ▶️ Start the Development Server

```sh
# 4. Run the app
npm run dev
```

The app starts with hot-reload enabled for rapid iteration.

---

## ✏️ Editing the Code

Choose your weapon. They all work.

### Option 1: Local IDE

* VS Code, WebStorm, Vim
* Commit and push normally

### Option 2: GitHub Web Editor

* Open any file
* Click ✏️ Edit
* Commit directly to the branch

### Option 3: GitHub Codespaces

* Code → Codespaces
* Zero local setup
* Full dev environment in browser

---

## 🚢 Deployment

This is a standard **Vite + React** build.

```sh
npm run build
```

Deploy the generated `dist/` folder to:

* Netlify
* Vercel
* Cloudflare Pages
* Any static hosting or server


# Typographic Minimalist Portfolio

A clean, premium, single-column portfolio website for **Chalicheemala Surya Thejas** built using vanilla HTML, CSS, and JavaScript. 

The design is typography-led, utilizing the serif **Fraunces** for headings, **Inter** for body text, and **JetBrains Mono** for technical labels and tags. It features custom dark/light theme switching, a top scroll progress bar, smooth scroll-fade-in animations, and a ready-to-use Formspree contact form.

## File Structure

```text
Portfolio/
├── index.html         # Content structure and accessibility markup
├── style.css          # Design system, responsive layouts, and themes
├── script.js          # Scroll progress, theme toggle, and form validation
└── README.md          # Setup and deployment documentation
```

---

## Getting Started

### Local Development
To run and preview the website locally:
1. Open the directory containing the files.
2. Double-click `index.html` to open it directly in your web browser, or use a local development server (such as the VS Code Live Server extension) for live-reloading.

---

## Configuration

### Activating the Contact Form
The contact form is pre-configured to work with **Formspree** (a free form endpoint service). To make it functional:
1. Visit [Formspree](https://formspree.io/) and sign up for a free account.
2. Click **New Form**, name it (e.g., "Portfolio Contact"), and select the email where you want to receive messages.
3. Formspree will provide a form endpoint URL (e.g., `https://formspree.io/f/your_form_id`).
4. Open [index.html](file:///c:/Users/Surya/Thejas/OneDrive/Dokumen/Portfolio/index.html) and locate the contact form element:
   ```html
   <form action="https://formspree.io/f/YOUR_FORMSPREE_ID_HERE" method="POST" class="contact-form" id="contact-form">
   ```
5. Replace `YOUR_FORMSPREE_ID_HERE` with your actual form ID (e.g., `xbjwpnzd`). Save the file.
6. Test the form. Successful submissions will show a status message under the button, and you will receive email alerts.

---

## Deployment Options

This website is a zero-compilation static site, meaning it has no build processes. You can deploy it for free in minutes.

### 1. Vercel (Recommended — Fastest)
1. Install Vercel CLI globally (or run via npx):
   ```bash
   npx vercel
   ```
2. Follow the prompt questions (login, select project name, confirm settings).
3. The project will deploy instantly and provide a production-ready `.vercel.app` URL.

### 2. GitHub Pages (Ideal for Developers)
1. Create a new repository on your GitHub account.
2. Initialize Git locally and push the files to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initialize portfolio website"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```
3. On GitHub, navigate to your repository's **Settings** tab.
4. Select **Pages** from the left-hand menu.
5. Under **Build and deployment**, choose **Deploy from a branch** as the source, select `main` (or the branch you pushed), set directory to `/ (root)`, and click **Save**.
6. Your portfolio will live at `https://your-username.github.io/your-repo-name/`.

### 3. Netlify
1. Go to [Netlify](https://www.netlify.com/) and log in.
2. Navigate to the **Sites** dashboard.
3. Drag-and-drop the entire `Portfolio` folder directly onto the **"Want to deploy a new site without connecting to Git? Drag and drop your site folder here"** area.
4. Netlify will deploy it instantly. You can go to **Site Settings** to customize your domain name.

### 4. Firebase Hosting
Since you have Firebase access:
1. Install Firebase tools globally (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```
2. Login to your account:
   ```bash
   firebase login
   ```
3. Initialize hosting in your portfolio directory:
   ```bash
   firebase init hosting
   ```
   *Choose your Firebase project, set public directory to `.` (as index.html is in the root), configure as a single-page app if desired, and do not overwrite index.html if prompted.*
4. Deploy the site:
   ```bash
   firebase deploy --only hosting
   ```

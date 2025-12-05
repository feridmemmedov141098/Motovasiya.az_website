# Motovasiya.az

A modern web application built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```
   This creates an optimized build in the `dist` folder.

4. **Preview production build:**
   ```bash
   npm run preview
   ```
   Preview the production build at `http://localhost:4173`

## 📦 Deployment to GitHub Pages

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Automatic Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Build and deployment", select **Source**: "GitHub Actions"
   - The workflow will automatically build and deploy your site

3. **Access your site:**
   - Your site will be available at: `https://[your-username].github.io/[repository-name]/`
   - The URL will be shown in the Pages settings after deployment

### Manual Deployment

If you prefer to deploy manually:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder:**
   - Upload the contents of the `dist` folder to your GitHub Pages repository
   - Make sure to include the `assets` subfolder and `index.html`

## 🛠️ Tech Stack

- **React 18.2** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via CDN)
- **Lucide React** - Icons

## 📝 Important Notes

- **Do NOT open `index.html` directly in your browser** - Modern web apps require a development server due to ES modules and CORS restrictions
- **Always use `npm run dev`** for local development
- **The `dist` folder** contains the production build - this is what gets deployed to GitHub Pages
- **Source files** (`.tsx`, `.ts`) are compiled by Vite during the build process

## 🐛 Troubleshooting

### Blank white page locally
- Make sure you're using `npm run dev` or `npm run preview`, not opening the HTML file directly
- Check that all dependencies are installed with `npm install`

### Blank white page on GitHub Pages
- Ensure the GitHub Actions workflow has completed successfully
- Check that GitHub Pages is configured to use "GitHub Actions" as the source
- Verify the `dist` folder was properly uploaded in the workflow

### Build errors
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Make sure you're using Node.js 18 or higher

## 📄 License

This project is private and proprietary.

# CRCP6340-1257_WebApp

This is a Node.js web application using Express to serve static content for Brittni's Fall 2025 CRCP 6340 project. The application serves HTML, CSS, images, and other static assets from the `public` directory.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites
- Node.js and npm are already available (v20.19.4+ and v10.8.2+)
- No additional SDK installations required

### Setup and Dependencies
- Install dependencies: `npm install` -- takes ~2 seconds
- No build process required (static file server only)

### Running the Application
- Production server: `npm start` -- starts immediately on port 3000
- Development server (with auto-reload): `npm run dev` -- starts immediately with nodemon
- Application serves content at: `http://localhost:3000`

### Testing
- Test command: `npm test` -- currently not implemented, exits with error code 1
- Lint command: `npm run lint` -- runs ESLint on configuration, server, and scripts
- No test suite is available in this repository

## Validation

### Manual Validation Requirements
After making any changes, ALWAYS validate the application by:

1. **Start the server**: Run `npm start` and verify it shows "CRCP 6340 (1257) WebApp listening at http://localhost:3000"
2. **Test HTTP response**: Run `curl -I http://localhost:3000` and verify you get "HTTP/1.1 200 OK"
3. **Test content delivery**: Run `curl -s http://localhost:3000 | head -20` and verify HTML content is returned
4. **Manual UI testing**: Open `http://localhost:3000` in a browser and verify:
   - Page loads with purple navigation bar
   - "brittni's fall 2025 nfts" branding displays
   - Navigation links ("home", "about", "projects", "contact") are clickable and functional
   - **Splash screen displays** with animated p5.js canvas showing:
     - Animated colorful circles appearing and fading (both filled circles and outline circles)
     - "brittni watkins" text centered on screen (64px JetBrains Mono)
     - "Fall 2025 NFTs" text below (32px JetBrains Mono)
     - Full viewport height canvas (100vh)
   - **Featured project section** displays with coming soon card and "view all projects" button
   - "about brittni" section displays with real biographical content
   - Footer displays copyright notice and navigation links

### Expected Behavior
- Server starts immediately (within 1 second)
- No compilation or build step required
- Static assets serve correctly from `/public` directory
- Navigation uses anchor links for single-page scrolling (home page) and page navigation (contact, projects)
- ESLint passes without errors on all configured files

### Known Issues
- External resources (Google Fonts, Bootstrap CDN, p5.js CDN) may be blocked in some environments - this is normal and doesn't affect core functionality
- Test command is not implemented and will fail with exit code 1
- Splash screen animation requires JavaScript to be enabled

## Project Structure

### Key Files and Directories
```
/home/runner/work/CRCP6340-1257_WebApp/CRCP6340-1257_WebApp/
├── app.js                    # Main Express server entry point
├── eslint.config.js          # ESLint configuration with comprehensive rules
├── package.json              # Node.js dependencies and scripts
├── package-lock.json         # Dependency lock file
├── public/                   # Static web content directory
│   ├── index.html           # Main homepage with navigation, splash, featured project, and about sections
│   ├── contact.html         # Contact page with full header and footer
│   ├── projects.html        # Projects page with full header and footer
│   ├── scripts/
│   │   └── splash.js        # p5.js animated splash screen with fill and outline circles
│   ├── style/
│   │   └── style.css        # Custom CSS styles
│   └── images/
│       ├── coming-soon-poster.png  # Featured project placeholder image
│       └── icons/
│           └── favicon-32x32.png  # Site favicon
├── .github/
│   ├── workflows/
│   │   └── codeql.yml       # CodeQL security scanning
│   ├── dependabot.yml      # Dependency update automation
│   └── CODEOWNERS           # Code ownership
├── .gitignore               # Git ignore rules
├── LICENSE                  # MIT License
└── README.md                # Project description
```

### Important Code Locations
- **Server configuration**: `app.js` (Express server setup, port 3000, static file serving)
- **ESLint configuration**: `eslint.config.js` (comprehensive linting rules for code quality)
- **Main webpage**: `public/index.html` (homepage with navigation, p5.js splash screen, featured project, and about sections)
- **Contact page**: `public/contact.html` (full contact page with header, footer, and navigation)
- **Projects page**: `public/projects.html` (full projects page with header, footer, and navigation)
- **Splash animation**: `public/scripts/splash.js` (p5.js animated canvas with both fill and outline circles)
- **Styling**: `public/style/style.css` (custom purple theme, JetBrains Mono font, splash styles)
- **Static assets**: `public/images/` (favicon, coming soon poster, and other images)

## Common Commands Output Reference

### Repository Root Contents
```
$ ls -la
.git
.github
.gitignore
LICENSE
README.md
app.js
eslint.config.js           # ESLint configuration
node_modules/        # Created after npm install
package-lock.json
package.json
public/
```

### Package.json Scripts
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "lint": "eslint ./eslint.config.js ./app.js ./public/scripts",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Dependencies
```json
{
  "dependencies": {
    "express": "^5.1.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.34.0",
    "@stylistic/eslint-plugin": "^5.2.3",
    "eslint": "^9.34.0",
    "eslint-plugin-es-x": "^9.1.0",
    "eslint-plugin-n": "^17.21.3",
    "eslint-plugin-security": "^3.0.1",
    "nodemon": "^3.1.10"
  }
}
```

### External CDN Dependencies
- **p5.js**: `https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/p5.min.js` (for splash screen animation)
- **Bootstrap CSS**: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css`
- **Bootstrap JS**: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js`
- **Google Fonts**: JetBrains Mono font family

## Development Guidelines

### Making Changes
- This is a simple static file server - no transpilation or build process
- Changes to files in `public/` directory are immediately available after server restart
- Use `npm run dev` during development for automatic server restart on file changes
- Always test both production (`npm start`) and development (`npm run dev`) modes

### Code Style
- ESLint is configured with comprehensive rules in `eslint.config.js`
- Includes rules for code quality, security, Node.js best practices, and stylistic consistency
- Run `npm run lint` to check code style and quality
- Follow existing code patterns in the repository

### CI/CD
- Only CodeQL security scanning is configured in `.github/workflows/codeql.yml`
- No build or test pipelines exist
- Dependabot is configured for npm and GitHub Actions dependency updates

### Common Development Tasks
- **Add new static page**: Create HTML file in `public/` directory with proper header/footer structure
- **Modify styling**: Edit `public/style/style.css`
- **Add images**: Place in `public/images/` directory
- **Update navigation**: Modify nav sections in HTML files (header and footer)
- **Modify splash animation**: Edit `public/scripts/splash.js` (p5.js sketch with Circle class)
- **Add JavaScript functionality**: Create files in `public/scripts/` directory
- **Server configuration**: Edit `app.js` (port, middleware, etc.)
- **Code quality**: Run `npm run lint` to check for issues and maintain code standards

## Troubleshooting

### Server Won't Start
- Check that port 3000 is not already in use: `lsof -i :3000`
- Verify Node.js is available: `node --version`
- Ensure dependencies are installed: `npm install`

### Content Not Loading
- Verify files exist in `public/` directory
- Check browser developer tools for 404 errors
- Confirm server is running and responding: `curl -I http://localhost:3000`

### External Resources Blocked
- Google Fonts and Bootstrap CDN may be blocked in some environments
- p5.js CDN may be blocked in some environments
- This is normal and doesn't affect core site functionality
- Custom CSS in `public/style/style.css` provides fallback styling
- Splash screen will not animate if p5.js fails to load
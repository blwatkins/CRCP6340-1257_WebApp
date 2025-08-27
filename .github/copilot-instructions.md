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
   - Navigation links ("home", "about") are clickable
   - "about brittni" section displays with Lorem ipsum content
   - Footer displays copyright notice

### Expected Behavior
- Server starts immediately (within 1 second)
- No compilation or build step required
- Static assets serve correctly from `/public` directory
- Navigation uses anchor links for single-page scrolling

### Known Issues
- External resources (Google Fonts, Bootstrap CDN) may be blocked in some environments - this is normal and doesn't affect core functionality
- Test command is not implemented and will fail with exit code 1

## Project Structure

### Key Files and Directories
```
/home/runner/work/CRCP6340-1257_WebApp/CRCP6340-1257_WebApp/
├── app.js                    # Main Express server entry point
├── package.json              # Node.js dependencies and scripts
├── package-lock.json         # Dependency lock file
├── public/                   # Static web content directory
│   ├── index.html           # Main homepage
│   ├── contact.html         # Contact page (placeholder)
│   ├── projects.html        # Projects page (placeholder)
│   ├── style/
│   │   └── style.css        # Custom CSS styles
│   └── images/
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
- **Main webpage**: `public/index.html` (homepage with navigation and about section)
- **Styling**: `public/style/style.css` (custom purple theme, JetBrains Mono font)
- **Static assets**: `public/images/` (favicon and other images)
- **Placeholder pages**: `public/contact.html` and `public/projects.html` (TODO comments only)

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
    "nodemon": "^3.1.10"
  }
}
```

## Development Guidelines

### Making Changes
- This is a simple static file server - no transpilation or build process
- Changes to files in `public/` directory are immediately available after server restart
- Use `npm run dev` during development for automatic server restart on file changes
- Always test both production (`npm start`) and development (`npm run dev`) modes

### Code Style
- No linting tools configured
- No code formatting tools configured
- Follow existing code patterns in the repository

### CI/CD
- Only CodeQL security scanning is configured in `.github/workflows/codeql.yml`
- No build or test pipelines exist
- Dependabot is configured for npm and GitHub Actions dependency updates

### Common Development Tasks
- **Add new static page**: Create HTML file in `public/` directory
- **Modify styling**: Edit `public/style/style.css`
- **Add images**: Place in `public/images/` directory
- **Update navigation**: Modify nav section in `public/index.html`
- **Server configuration**: Edit `app.js` (port, middleware, etc.)

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
- This is normal and doesn't affect core site functionality
- Custom CSS in `public/style/style.css` provides fallback styling
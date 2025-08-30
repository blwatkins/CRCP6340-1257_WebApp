# CRCP6340-1257_WebApp

This is a Node.js web application using Express to serve static content and handle contact form submissions for Brittni's Fall 2025 CRCP 6340 project. The application serves HTML, CSS, images, and other static assets from the `public` directory, and includes a working contact form with email notification functionality.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites
- Node.js and npm are already available (v20.19.4+ and v10.8.2+)
- No additional SDK installations required

### Setup and Dependencies
- Install dependencies: `npm install` -- takes ~15 seconds (includes jest, nodemailer, dotenv, supertest)
- Environment variables: Create `.env` file for email functionality (SMTP settings, see Environment Variables section). For enhanced security, consider using dotenvx encryption features to encrypt sensitive environment variables.
- No build process required (static file server with API routes)

### Running the Application
- Production server: `npm start` -- starts immediately on port 3000 (uses dotenvx and server.js)
- Development server (with auto-reload): `npm run dev` -- starts immediately with nodemon (uses dotenvx and server.js)
- Application serves content at: `http://localhost:3000`
- Contact form requires environment variables for email functionality

### Testing
- Test command: `npm test` -- runs Jest test suite with 130+ tests and coverage reporting
- Unit tests implemented for:
  - Express app routes (including POST /mail endpoint)
  - Express app utility functions (string validation, email send with mocked nodemailer)
  - Static file serving
- Lint command: `npm run lint` -- runs ESLint on configuration, server, scripts, and src directories
- Test coverage reports generated in `./out/tests-coverage/`
- All tests should pass with 100% code coverage

## Validation

### Manual Validation Requirements
After making any changes, ALWAYS validate the application by:

1. **Start the server**: Run `npm start` and verify it shows "CRCP 6340 (1257) WebApp listening at http://localhost:3000"
2. **Test HTTP response**: Run `curl -I http://localhost:3000` and verify you get "HTTP/1.1 200 OK"
3. **Test content delivery**: Run `curl -s http://localhost:3000 | head -20` and verify HTML content is returned
4. **Test contact form API**: Run `curl -X POST -H "Content-Type: application/json" -d '{"subject":"Test","message":"Test message"}' http://localhost:3000/mail` and verify appropriate response (success requires .env configuration)
5. **Manual UI testing**: Open `http://localhost:3000` in a browser and verify:
   - Page loads with purple navigation bar
   - "brittni's fall 2025 nfts" branding displays
   - Navigation links ("home", "about", "projects", "contact") are clickable and functional
   - **Splash screen displays** with animated p5.js canvas showing:
     - Animated colorful circles appearing and fading (both filled circles and outline circles)
     - Circles distributed evenly across the canvas using poisson disc sampling algorithm
     - "brittni watkins" text centered on screen (64px JetBrains Mono)
     - "Fall 2025 NFTs" text below (32px JetBrains Mono)
     - Full viewport height canvas (100vh)
   - **Featured project section** displays with coming soon card and "view all projects" button
   - "about brittni" section displays with real biographical content
   - Footer displays copyright notice and navigation links
6. **Contact form testing**: Navigate to `/contact.html` and verify:
   - Contact form loads with proper Bootstrap styling
   - Form validation works (required fields, email format, custom validation)
   - Custom validation prevents empty strings and whitespace-only strings for name and message fields
   - Form disables submit button during processing
   - Form shows appropriate success/error messages
   - Form clears on successful submission, retains data on error

### Expected Behavior
- Server starts immediately (within 1 second)
- No compilation or build step required
- Static assets serve correctly from `/public` directory
- Navigation uses anchor links for single-page scrolling (home page) and page navigation (contact, projects)
- ESLint passes without errors on all configured files
- Jest tests pass with 100% code coverage
- Contact form validates input and submits via POST /mail endpoint
- Custom client-side validation prevents empty strings and whitespace-only strings
- Email notifications sent when SMTP environment variables are properly configured

### Known Issues
- External resources (Google Fonts, Bootstrap CDN, p5.js CDN) may be blocked in some environments - this is normal and doesn't affect core functionality
- Contact form email functionality requires proper SMTP environment configuration in `.env` file
- Server will show "[MISSING_ENV_FILE]" warning if `.env` file is not present (this is normal for static-only usage)
- Splash screen animation requires JavaScript to be enabled

## Project Structure

### Key Files and Directories
```
/home/runner/work/CRCP6340-1257_WebApp/CRCP6340-1257_WebApp/
├── src/                      # Source code directory (CommonJS modules)
│   ├── main/                 # Main application code
│   │   ├── app.js           # Express app configuration and routes (POST /mail)
│   │   ├── server.js        # Server startup and initialization
│   │   └── utils/
│   │       └── utils.js     # Utility functions (Validation, EmailClient)
│   └── test/                 # Jest test files
│       ├── app.test.js      # Express app route tests
│       ├── static.test.js   # Static file serving tests
│       └── utils/
│           └── utils.test.js # Utility function tests
├── public/                   # Static web content directory
│   ├── index.html           # Main homepage with navigation, splash, featured project, and about sections
│   ├── contact.html         # Contact page with working contact form
│   ├── projects.html        # Projects page with full header and footer
│   ├── scripts/
│   │   ├── splash.js        # p5.js animated splash screen with fill and outline circles
│   │   └── contact-email.js # Contact form validation and submission handling
│   ├── style/
│   │   └── style.css        # Custom CSS styles
│   └── images/
│       ├── coming-soon-poster.png  # Featured project placeholder image
│       └── icons/
│           └── favicon-32x32.png  # Site favicon
├── out/                      # Generated files (test coverage, etc.)
│   └── tests-coverage/      # Jest coverage reports (generated)
├── eslint.config.mjs         # ESLint configuration with comprehensive rules (ES modules)
├── jest.config.js           # Jest testing configuration with coverage
├── package.json             # Node.js dependencies and scripts
├── package-lock.json        # Dependency lock file
├── velocity-copyright-template.txt # Copyright header template
├── .env                     # Environment variables (not in repo, required for email functionality)
├── .github/
│   ├── workflows/
│   │   ├── nodejs.yml        # Node.js lint and test workflow
│   │   └── codeql.yml        # CodeQL security scanning
│   ├── dependabot.yml       # Dependency update automation
│   ├── CODEOWNERS           # Code ownership
│   └── copilot-instructions.md # This file
├── .gitignore               # Git ignore rules
├── LICENSE                  # MIT License
└── README.md                # Project description
```

### Important Code Locations
- **Server configuration**: `src/main/server.js` (Express server startup, port 3000)
- **Express app**: `src/main/app.js` (routes, middleware, POST /mail endpoint)
- **Utility functions**: `src/main/utils/utils.js` (Validation class, EmailClient class with nodemailer)
- **ESLint configuration**: `eslint.config.mjs` (comprehensive linting rules for code quality, ES modules)
- **Jest configuration**: `jest.config.js` (test configuration with coverage reporting)
- **Main webpage**: `public/index.html` (homepage with navigation, p5.js splash screen, featured project, and about sections)
- **Contact page**: `public/contact.html` (contact page with working form, validation, Bootstrap styling)
- **Projects page**: `public/projects.html` (full projects page with header, footer, and navigation)
- **Splash animation**: `public/scripts/splash.js` (p5.js animated canvas with Circle and CirclePoissonDiscSampler classes)
- **Contact form script**: `public/scripts/contact-email.js` (form validation, submission, UI feedback, and custom validation methods)
- **Styling**: `public/style/style.css` (custom purple theme, JetBrains Mono font, splash styles)
- **Static assets**: `public/images/` (favicon, coming soon poster, and other images)
- **Test files**: `src/test/` (Jest unit tests for app routes, utilities, and static serving)

## Environment Variables

### Required for Email Functionality
Create a `.env` file in the repository root with the following variables for contact form email functionality:

```env
# SMTP Configuration
SMTP_SERVICE=gmail
SMTP_REQUIRE_TLS=true

# Email Authentication
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Email Addresses
MAIL_FROM=your-email@gmail.com
MAIL_TO=recipient@example.com
```

### Environment Variable Details
- **SMTP_SERVICE**: Email service provider (gmail, outlook, etc.)
- **SMTP_REQUIRE_TLS**: Whether to require TLS encryption (true/false)
- **MAIL_USER**: SMTP authentication username
- **MAIL_PASSWORD**: SMTP authentication password (use app-specific passwords for Gmail)
- **MAIL_FROM**: Email address to send from
- **MAIL_TO**: Email address to send contact form submissions to

### Environment File Encryption (Recommended)
For enhanced security, you can encrypt your `.env` file using dotenvx encryption features:

#### 1. Generate Encryption Keys
```bash
# Generate a keypair for your .env file
npx @dotenvx/dotenvx keypair

# Or generate for a specific file
npx @dotenvx/dotenvx keypair -f .env
```

This creates a `.env.keys` file containing the private key needed for decryption.

#### 2. Encrypt Your .env File
```bash
# Encrypt the .env file (creates .env.vault)
npx @dotenvx/dotenvx encrypt

# Or encrypt a specific file
npx @dotenvx/dotenvx encrypt -f .env
```

This creates an encrypted `.env.vault` file and updates your `.env` file with a reference to the encrypted version.

#### 3. Secure Key Management
- **Keep `.env.keys` secure**: This file contains the private key needed to decrypt your environment variables
- **Add to .gitignore**: Ensure `.env.keys` is in your `.gitignore` file (never commit encryption keys)
- **Team sharing**: Share the `.env.keys` file securely with team members who need access
- **Production deployment**: Use the encrypted `.env.vault` file in production with the appropriate decryption key

#### 4. Decryption (if needed)
```bash
# Decrypt back to plain .env file
npx @dotenvx/dotenvx decrypt

# Or decrypt a specific file
npx @dotenvx/dotenvx decrypt -f .env.vault
```

#### Benefits of Encryption
- **Security**: Sensitive data like passwords and API keys are encrypted at rest
- **Version control safe**: Encrypted `.env.vault` files can be safely committed to repositories
- **Team collaboration**: Share encrypted environment files without exposing sensitive data
- **Runtime decryption**: dotenvx automatically decrypts variables when running the application

### Important Notes
- Environment variables are loaded using `@dotenvx/dotenvx`
- Contact form will return errors if environment variables are not properly configured
- For Gmail, use app-specific passwords rather than regular account passwords
- The application will show "[MISSING_ENV_FILE]" warning if `.env` file is missing (this is normal for static-only usage)
- **Encryption is optional but recommended** for enhanced security, especially in team environments

## Common Commands Output Reference

### Repository Root Contents
```
$ ls -la
.git
.github
.gitignore
LICENSE
README.md
eslint.config.mjs           # ESLint configuration (ES modules)
jest.config.js              # Jest testing configuration
node_modules/               # Created after npm install
out/                        # Generated files (test coverage)
package-lock.json
package.json
public/
src/                        # Source code directory
velocity-copyright-template.txt
```

### Package.json Scripts
```json
{
  "scripts": {
    "start": "dotenvx run -- node ./src/main/server.js",
    "dev": "dotenvx run -- nodemon ./src/main/server.js",
    "lint": "eslint ./eslint.config.mjs ./jest.config.js ./public/scripts ./src",
    "test": "jest"
  }
}
```

### Dependencies
```json
{
  "dependencies": {
    "@dotenvx/dotenvx": "^1.49.0",
    "express": "^5.1.0",
    "nodemailer": "^7.0.5"
  },
  "devDependencies": {
    "@eslint/js": "^9.34.0",
    "@stylistic/eslint-plugin": "^5.2.3",
    "eslint": "^9.34.0",
    "eslint-plugin-es-x": "^9.1.0",
    "eslint-plugin-n": "^17.21.3",
    "eslint-plugin-security": "^3.0.1",
    "jest": "^30.1.1",
    "nodemon": "^3.1.10",
    "supertest": "^7.1.4"
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
- Server application with static files and API routes - no transpilation or build process
- Changes to files in `public/` directory are immediately available after server restart
- Changes to files in `src/main/` require server restart to take effect
- Use `npm run dev` during development for automatic server restart on file changes
- Always test both production (`npm start`) and development (`npm run dev`) modes
- Run `npm test` to ensure changes don't break existing functionality
- All source code files should include copyright headers (see `velocity-copyright-template.txt`)

### Code Style
- ESLint is configured with comprehensive rules in `eslint.config.mjs` (ES modules format)
- Includes rules for code quality, security, Node.js best practices, and stylistic consistency
- Run `npm run lint` to check code style and quality
- Follow existing code patterns in the repository
- Use CommonJS modules (`require`/`module.exports`) in `src/main/` directory
- All source code files must include copyright headers (use `velocity-copyright-template.txt` as reference)
- Favor async/await syntax over Promise chains

### CI/CD
- Node.js lint and test workflow configured in `.github/workflows/nodejs.yml`
- CodeQL security scanning configured in `.github/workflows/codeql.yml`
- Jest test suite provides comprehensive test coverage
- Dependabot configured for npm and GitHub Actions dependency updates
- All tests must pass before merging changes

### Common Development Tasks
- **Add new static page**: Create HTML file in `public/` directory with proper header/footer structure and copyright header
- **Modify styling**: Edit `public/style/style.css`
- **Add images**: Place in `public/images/` directory
- **Update navigation**: Modify nav sections in HTML files (header and footer)
- **Modify splash animation**: Edit `public/scripts/splash.js` (p5.js sketch with Circle class and CirclePoissonDiscSampler for even distribution)
- **Add client-side JavaScript**: Create files in `public/scripts/` directory with copyright headers
- **Add server routes**: Edit `src/main/app.js` (Express routes and middleware)
- **Add utility functions**: Edit `src/main/utils/utils.js` (Validation class, EmailClient class)
- **Server configuration**: Edit `src/main/server.js` (port, startup logic)
- **Add unit tests**: Create test files in `src/test/` directory (Jest format)
- **Environment setup**: Edit `.env` file for email configuration (not committed to repo)
- **Code quality**: Run `npm run lint` and `npm test` to check for issues and maintain standards

## Troubleshooting

### Server Won't Start
- Check that port 3000 is not already in use: `lsof -i :3000`
- Verify Node.js is available: `node --version`
- Ensure dependencies are installed: `npm install`
- Check for syntax errors in `src/main/server.js` or `src/main/app.js`

### Contact Form Issues
- Verify `.env` file exists with proper SMTP configuration
- Check server logs for email sending errors
- Test email configuration with external SMTP tool
- Verify environment variables are loaded: check for "[MISSING_ENV_FILE]" warnings

### Test Failures
- Run `npm test` to see specific test failures
- Check for linting issues: `npm run lint`
- Verify Jest configuration in `jest.config.js`
- Ensure all dependencies are installed: `npm install`

### Content Not Loading
- Verify files exist in `public/` directory
- Check browser developer tools for 404 errors
- Confirm server is running and responding: `curl -I http://localhost:3000`
- Test API endpoints: `curl -X POST -H "Content-Type: application/json" -d '{"subject":"Test","message":"Test"}' http://localhost:3000/mail`

### External Resources Blocked
- Google Fonts and Bootstrap CDN may be blocked in some environments
- p5.js CDN may be blocked in some environments
- This is normal and doesn't affect core site functionality
- Custom CSS in `public/style/style.css` provides fallback styling
- Splash screen will not animate if p5.js fails to load
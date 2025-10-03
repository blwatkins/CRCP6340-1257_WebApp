# CRCP6340-1257_WebApp

This is a Node.js web application using Express with EJS templating to serve dynamic content and handle contact form submissions for Brittni's Fall 2025 CRCP 6340 project. The application uses EJS templates in the `views` directory for dynamic page rendering, serves static assets from the `public` directory, and includes a working contact form with email notification functionality.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites
- Node.js and npm are already available (v20.19.4+ and v10.8.2+)
- No additional SDK installations required

### Setup and Dependencies
- Install dependencies: `npm install` -- takes ~15 seconds (includes ejs, vitest, nodemailer, dotenvx, mysql2, html-entities, supertest, @vitest/ui, webpack, webpack-cli, css-loader, style-loader, mini-css-extract-plugin)
- Environment variables: Create `.env` file for email functionality (SMTP settings, see Environment Variables section). For enhanced security, consider using dotenvx encryption features to encrypt sensitive environment variables.
- Build process: Client-side assets are bundled using webpack from `client-src/` to `public/dist/`
- Run `npm run build` to build client-side assets before running the application

### Running the Application
- Build client assets: `npm run build` -- builds ES6 modules and CSS from `client-src/` to `public/dist/`
- Production server: `npm start` -- starts immediately on port 3000 (uses dotenvx and server.mjs)
- Development server (with auto-reload): `npm run dev` -- starts immediately with nodemon (uses dotenvx and server.mjs)
- Development build commands:
  - `npm run build:dev` -- builds assets in development mode
  - `npm run build:watch` -- builds assets in development mode with file watching
- Application serves content at: `http://localhost:3000`
- Contact form requires environment variables for email functionality

### Testing
- Test command: `npm test` -- runs Vitest test suite with 184 tests (plus 5 TODO tests) and coverage reporting
- Additional test scripts available:
  - `npm run test:watch` -- runs Vitest in watch mode for development
  - `npm run test:ui` -- runs Vitest with UI interface for interactive testing
  - `npm run test:coverage` -- runs tests with coverage reporting
- Unit tests implemented for:
  - Express app routes
  - Express app utility functions
  - Static file serving
- Lint command: `npm run lint` -- runs ESLint on configuration, server, scripts, src, tests, and client-src directories
- Test coverage reports generated in `./_coverage/`
- All tests should pass with 100% code coverage
- **TODO Tests**: The following tests are marked as `test.todo()` and will be implemented in future iterations:
  - `ProjectsClient` class tests (`tests/db/projects-client.test.mjs`) 
  - `Projects` class tests (`tests/models/projects.test.mjs`)
  - `GET /projects/$id` route tests (`tests/app.test.mjs`)
  - `EmailClient` constructor tests (`tests/utils/email-client.test.mjs`)
  - `Validation.isValidNumber()` tests (`tests/utils/validation.test.mjs`)
  - `Random` class tests (`tests/utils/random.test.mjs`)

## Validation

### Manual Validation Requirements
After making any changes, ALWAYS validate the application by:

1. **Start the server**: Run `npm start` and verify it shows "CRCP 6340 (1257) WebApp listening at http://localhost:3000"
2. **Test HTTP response**: Run `curl -I http://localhost:3000` and verify you get "HTTP/1.1 200 OK"
3. **Test content delivery**: Run `curl -s http://localhost:3000 | head -20` and verify HTML content is returned
4. **Test contact form API**: Run `curl -X POST -H "Content-Type: application/json" -d '{"subject":"Test","message":"Test message"}' http://localhost:3000/mail` and verify appropriate response (success requires .env email configuration)
5. **Manual UI testing**: Open `http://localhost:3000` in a browser and verify:
   - Page loads with purple navigation bar
   - "brittni's fall 2025 nfts" branding displays and links to index.html
   - Navigation links ("home", "about", "projects", "contact", "acknowledgements") are clickable and functional
   - "Connect Wallet" button displays in header navigation for EVM wallet connections
   - **Splash screen displays** with animated p5.js canvas showing:
     - Animated colorful circles appearing and fading (both filled circles and outline circles)
     - Circles distributed evenly across the canvas using poisson disc sampling algorithm
     - "brittni watkins" text centered on screen (64px JetBrains Mono)
     - "Fall 2025 NFTs" text below (32px JetBrains Mono)
     - Full viewport height canvas (100vh)
   - **Featured project section** displays with randomly selected project from database and "view all projects" button
   - "about brittni" section displays with real biographical content
   - Footer displays copyright notice, social media links with FontAwesome icons, and navigation links
6. **Contact form testing**: Navigate to `/contact` and verify:
   - Contact form loads with proper Bootstrap styling
   - Form validation works (required fields, email format, custom validation)
   - Custom validation prevents empty strings and whitespace-only strings for name and message fields
   - Form disables submit button during processing
   - Form shows appropriate success/error messages
   - Form clears on successful submission, retains data on error
7. **Acknowledgements page testing**: Navigate to `/acknowledgements` and verify:
   - Page loads with proper header and footer structure
   - Acknowledgements for Express, Nodemailer, Bootstrap, and FontAwesome are displayed with icons
   - Social media links work and open in new tabs with proper accessibility attributes
   - Footer social media icons display correctly using FontAwesome
8. **Projects page testing**: Navigate to `/projects` and verify:
   - Page loads with proper header and footer structure
   - Project cards are displayed in a grid layout (up to 3 columns) using `project-card.ejs` layout
   - Each project card links to individual project pages (`/projects/1`, `/projects/2`, etc.)
   - Individual project pages load with project title and placeholder content
   - Project data is dynamically loaded from database (requires MySQL configuration)
9. **Error page testing**: 
   - Navigate to `/nonexistent` and verify 404 error page displays with proper styling
   - Test server error handling (500 error page should display for server errors)
10. **Wallet connection testing**:
   - Verify "Connect Wallet" button displays in header navigation
   - Test wallet connection functionality (requires MetaMask or compatible EVM wallet)
   - Verify button shows wallet address preview after successful connection
   - Test wallet connection error handling when no wallet extension is available

### Expected Behavior
- Server starts immediately (within 1 second)
- No compilation or build step required
- Static assets serve correctly from `/public` directory
- EJS templates render correctly with dynamic content
- Navigation uses Express routes for page navigation (/, /projects, /contact, /acknowledgements) and anchor links for single-page scrolling (/#about)
- ESLint passes without errors on all configured files
- Vitest tests pass with 100% code coverage
- Contact form validates input and submits via POST /mail endpoint
- Custom client-side validation prevents empty strings and whitespace-only strings
- Email notifications sent when SMTP environment variables are properly configured
- Social media links in footer open in new tabs with proper accessibility attributes
- Project pages are dynamically generated using Projects data
- Featured project on homepage is randomly selected from database projects
- EVM wallet connection functionality available via "Connect Wallet" button with webpack-bundled ES6 modules
- Client-side assets are bundled using webpack from ES6 modules in `client-src/` to `public/dist/`
- Error pages (404, 500) render correctly with proper styling

### Known Issues
- External resources (Google Fonts, Bootstrap CDN, p5.js CDN, FontAwesome CDN) may be blocked in some environments - this is normal and doesn't affect core functionality
- Contact form email functionality requires proper SMTP environment configuration in `.env` file
- Database functionality requires proper MySQL environment configuration in `.env` file
- Server will show "[MISSING_ENV_FILE]" warning if `.env` file is not present (this is normal for static-only usage)
- Database connection errors will appear if MySQL environment variables are missing or incorrect
- Projects page functionality depends on database connectivity for displaying dynamic project data
- Splash screen animation requires JavaScript to be enabled
- Social media links require FontAwesome to load for icons to display properly
- Wallet connection requires MetaMask or compatible EVM wallet extension to be installed
- **Client-side assets must be built** using `npm run build` before running the application for bundled functionality to work

## Project Structure

### Key Files and Directories
```
/home/runner/work/CRCP6340-1257_WebApp/CRCP6340-1257_WebApp/
├── src/                      # Source code directory (ES modules)
│   ├── app.mjs              # Express app configuration and routes (GET and POST routes)
│   ├── server.mjs           # Server startup and initialization
│   ├── db/                  # Database-related modules
│   │   ├── database-client.mjs  # DatabaseClient class for MySQL connection
│   │   └── projects-client.mjs  # ProjectsClient class for projects data access
│   ├── models/              # Data model classes
│   │   └── projects.mjs     # Projects class for project data processing
│   └── utils/               # Utility functions
│       ├── email-client.mjs # EmailClient class
│       ├── random.mjs       # Random class
│       └── validation.mjs   # Validation class
├── views/                    # EJS template directory
│   ├── includes/            # Reusable EJS partials
│   │   ├── head.ejs         # Common HTML head content
│   │   ├── header-navigation.ejs  # Navigation header
│   │   ├── footer-navigation.ejs  # Footer with social links and navigation
│   │   ├── closing-scripts.ejs    # Bootstrap JS scripts
│   │   └── project-card.ejs # Project card layout for project cards
│   ├── errors/              # Error page templates
│   │   ├── 404.ejs          # 404 error page
│   │   └── 500.ejs          # 500 error page
│   ├── index.ejs            # Homepage template with navigation, splash, featured project, and about sections
│   ├── contact.ejs          # Contact page template with working contact form
│   ├── projects.ejs         # Projects page template with dynamic project cards
│   ├── project.ejs          # Individual project page template
│   └── acknowledgements.ejs # Acknowledgements page template
├── tests/                    # Vitest test files
│   ├── app.test.mjs         # Express app route tests
│   ├── public.test.mjs      # Static file serving tests
│   ├── db/                  # Database class tests
│   │   ├── database-client.test.mjs  # DatabaseClient tests
│   │   └── projects-client.test.mjs  # ProjectsClient tests (TODO)
│   ├── models/              # Model class tests
│   │   └── projects.test.mjs # Projects class tests (TODO)
│   └── utils/               # Utility function tests
│       ├── email-client.test.mjs     # EmailClient tests (with TODO constructor tests)
│       ├── random.test.mjs           # Random class tests (TODO)
│       └── validation.test.mjs       # Validation tests (with TODO isValidNumber tests)
├── client-src/                # Client-side source code (ES modules)
│   ├── js/                    # JavaScript source files
│   │   ├── index.js          # Main entry point for bundled JavaScript
│   │   ├── wallet.js         # WalletManager class for EVM wallet connection
│   │   ├── contact-email.js  # ContactForm class for form handling
│   │   └── splash.js         # SplashScreen class for p5.js animated splash
│   └── css/                  # CSS source files
│       └── index.css         # Main CSS entry point
├── public/                   # Static web content directory
│   ├── dist/                 # Webpack build output (bundled assets)
│   │   ├── bundle.js         # Bundled JavaScript (from client-src/js)
│   │   ├── styles.css        # Bundled CSS (from client-src/css)
│   │   └── styles.js         # CSS extraction artifact
│   ├── scripts/              # Legacy individual scripts (now bundled)
│   │   ├── splash.js         # [DEPRECATED] Individual splash script
│   │   ├── contact-email.js  # [DEPRECATED] Individual contact form script
│   │   └── wallet.js         # [DEPRECATED] Individual wallet script
│   ├── style/
│   │   └── style.css         # Custom CSS styles
│   └── images/
│       ├── coming-soon-poster.png  # Featured project placeholder image
│       ├── projects/
│       │   └── gradient-graphs.png # Project image for gradient graphs NFT project
│       └── icons/
│           └── favicon-32x32.png  # Site favicon
├── schema/                     # Database schema and test data files
│   ├── schema.sql              # Database table creation script
│   ├── projects.sql            # Sample project data insertion script
│   └── queries.sql             # Example database queries
├── _coverage/                  # Generated files for test coverage reports
│   └── [generated files]       # Vitest coverage reports (generated)
├── eslint.config.mjs           # ESLint configuration with comprehensive rules (ES modules)
├── vitest.config.mjs           # Vitest testing configuration with coverage
├── webpack.config.js           # Webpack configuration for client-side asset bundling
├── package.json                # Node.js dependencies and scripts (includes webpack build commands)
├── package-lock.json           # Dependency lock file
├── velocity-copyright-template.txt # Copyright header template
├── .env                     # Environment variables (not in repo, required for email functionality)
├── .github/
│   ├── workflows/
│   │   ├── npm-test.yml        # npm lint and test workflow
│   │   └── codeql.yml          # CodeQL security scanning
│   ├── dependabot.yml          # Dependency update automation
│   ├── CODEOWNERS              # Code ownership
│   └── copilot-instructions.md # This file
├── .gitignore                  # Git ignore rules (includes public/dist/ for webpack build artifacts)
├── LICENSE                     # MIT License
└── README.md                   # Project description
```

### Important Code Locations
- **Server configuration**: `src/server.mjs` (Express server startup, port 3000, database shutdown logic)
- **Express app**: `src/app.mjs` (routes, middleware, EJS view engine, GET and POST endpoints, DatabaseClient initialization)
- **Webpack configuration**: `webpack.config.js` (ES module webpack config for bundling client-side assets)
- **Client-side entry point**: `client-src/js/index.js` (main JavaScript entry point, imports all ES6 modules)
- **Client-side modules**: `client-src/js/` (WalletManager, ContactForm, SplashScreen classes as ES6 modules)
- **Client-side CSS**: `client-src/css/index.css` (main CSS entry point for bundling)
- **Bundled assets**: `public/dist/` (webpack output directory with bundle.js and styles.css)
- **Database client**: `src/db/database-client.mjs` (DatabaseClient class for MySQL connection management with improved error handling)
- **Projects client**: `src/db/projects-client.mjs` (ProjectsClient class for database queries)
- **Projects model**: `src/models/projects.mjs` (Projects class for project data processing)
- **Email client**: `src/utils/email-client.mjs` (EmailClient class with nodemailer)
- **Random utilities**: `src/utils/random.mjs` (Random class with selectRandomElement method)
- **Validation utilities**: `src/utils/validation.mjs` (Validation class)
- **ESLint configuration**: `eslint.config.mjs` (comprehensive linting rules)
- **Vitest configuration**: `vitest.config.mjs` (test configuration with coverage reporting)
- **Main webpage**: `views/index.ejs` (homepage template with navigation, p5.js splash screen, featured project, and about sections)
- **Contact page**: `views/contact.ejs` (contact page template with working form, validation, Bootstrap styling)
- **Projects page**: `views/projects.ejs` (projects page template with dynamic project cards using `project-card.ejs` layout)
- **Individual project page**: `views/project.ejs` (template for individual project pages)
- **Acknowledgements page**: `views/acknowledgements.ejs` (credits page template with social media links)
- **Error pages**: `views/errors/404.ejs` and `views/errors/500.ejs` (error page templates)
- **EJS includes**: `views/includes/` (reusable EJS partials for head, header, footer, and scripts)
- **Project card layout**: `views/includes/project-card.ejs` (reusable project card component)
- **Splash animation**: `client-src/js/splash.js` (SplashScreen ES6 class with p5.js animated canvas, Circle and CirclePoissonDiscSampler classes)
- **Contact form script**: `client-src/js/contact-email.js` (ContactForm ES6 class for form validation, submission, UI feedback, and custom validation methods)
- **Wallet connection script**: `client-src/js/wallet.js` (WalletManager ES6 class for EVM wallet connection functionality with MetaMask support)
- **Styling**: `public/style/style.css` (custom purple theme, JetBrains Mono font, splash styles, bg-secondary-subtle override)
- **Static assets**: `public/images/` (favicon, coming soon poster, project images, and other images)
- **Database schema**: `schema/` (SQL files for database creation, sample data, and queries)
- **Test files**: `tests/` (Vitest unit tests for app routes, utilities, database with improved error handling tests, models, and static serving)

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

### Required for Database Functionality
The following MySQL database environment variables must also be added to your `.env` file:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your-database-user
MYSQL_PASSWORD=your-database-password
MYSQL_DATABASE=your-database-name
```

### Environment Variable Details
**Email Configuration:**
- **SMTP_SERVICE**: Email service provider (gmail, outlook, etc.)
- **SMTP_REQUIRE_TLS**: Whether to require TLS encryption (true/false)
- **MAIL_USER**: SMTP authentication username
- **MAIL_PASSWORD**: SMTP authentication password (use app-specific passwords for Gmail)
- **MAIL_FROM**: Email address to send from
- **MAIL_TO**: Email address to send contact form submissions to

**Database Configuration:**
- **MYSQL_HOST**: MySQL server hostname or IP address
- **MYSQL_PORT**: MySQL server port (typically 3306)
- **MYSQL_USER**: MySQL database username
- **MYSQL_PASSWORD**: MySQL database password
- **MYSQL_DATABASE**: MySQL database name

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
- Contact form will return errors if email environment variables are not properly configured
- Database functionality will fail if MySQL environment variables are not properly configured
- For Gmail, use app-specific passwords rather than regular account passwords
- The application will show "[MISSING_ENV_FILE]" warning if `.env` file is missing (this is normal for static-only usage)
- Database connection errors will appear in logs if MySQL environment variables are missing or incorrect
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
vitest.config.mjs           # Vitest testing configuration
node_modules/               # Created after npm install
_coverage/                  # Generated files (test coverage)
schema/                     # Database schema and SQL files
package-lock.json
package.json
public/
src/                        # Source code directory
tests/                      # Vitest test files
velocity-copyright-template.txt
views/                      # EJS template directory
```

### Package.json Scripts
```json
{
  "scripts": {
    "start": "dotenvx run -- node ./src/server.mjs",
    "dev": "dotenvx run -- nodemon ./src/server.mjs",
    "lint": "eslint ./eslint.config.mjs ./vitest.config.mjs ./public/scripts ./src ./tests",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Dependencies
```json
{
  "dependencies": {
    "@dotenvx/dotenvx": "^1.51.0",
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "html-entities": "^2.6.0",
    "mysql2": "^3.15.0",
    "nodemailer": "^7.0.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.36.0",
    "@stylistic/eslint-plugin": "^5.4.0",
    "@vitest/coverage-v8": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "eslint": "^9.36.0",
    "eslint-plugin-es-x": "^9.1.0",
    "eslint-plugin-n": "^17.23.1",
    "eslint-plugin-security": "^3.0.1",
    "nodemon": "^3.1.10",
    "supertest": "^7.1.4",
    "vitest": "^3.2.4"
  }
}
```

### External CDN Dependencies
- **p5.js**: `https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/p5.min.js` (for splash screen animation)
- **Bootstrap CSS**: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css`
- **Bootstrap JS**: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js`
- **FontAwesome**: `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css` (for social media icons)
- **Google Fonts**: JetBrains Mono font family

## Development Guidelines

### Making Changes
- Express application with EJS templating and static files - no transpilation or build process
- Changes to files in `public/` directory are immediately available after server restart
- Changes to files in `src/` require server restart to take effect
- Changes to EJS templates in `views/` require server restart to take effect
- Use `npm run dev` during development for automatic server restart on file changes
- Always test both production (`npm start`) and development (`npm run dev`) modes
- Run `npm test` to ensure changes don't break existing functionality
- All source code files should include copyright headers (see `velocity-copyright-template.txt`)

### Code Style
- ESLint is configured with comprehensive rules in `eslint.config.mjs` (ES modules format)
- Includes rules for code quality, security, Node.js best practices, and stylistic consistency
- Key rules include require-await for async function validation and error handling improvements
- Run `npm run lint` to check code style and quality
- Follow existing code patterns in the repository
- Use ES modules (`import`/`export`) with `.mjs` extensions in `src/` and `tests/` directories
- All source code files must include copyright headers (use `velocity-copyright-template.txt` as reference)
- Favor async/await syntax over Promise chains

### Client-Side Asset Bundling with Webpack
- **Source directory**: All client-side source code lives in `client-src/` directory
- **ES6 modules**: All JavaScript uses ES6 module syntax (import/export) in `client-src/js/`
- **CSS bundling**: CSS files in `client-src/css/` are processed and bundled
- **Build process**: Run `npm run build` to bundle assets to `public/dist/`
- **Development builds**: Use `npm run build:dev` for development mode or `npm run build:watch` for file watching
- **Main entry points**: 
  - `client-src/js/index.js` - imports and initializes all JavaScript modules
  - `client-src/css/index.css` - main CSS entry point
- **Build output**: Webpack generates `public/dist/bundle.js` and `public/dist/styles.css`
- **EJS templates**: Updated to reference `/dist/bundle.js` instead of individual script files
- **ES6 module structure**: All client-side functionality organized as classes (WalletManager, ContactForm, SplashScreen)

### CI/CD
- Node.js lint and test workflow configured in `.github/workflows/npm-test.yml` with proper permissions
- CodeQL security scanning configured in `.github/workflows/codeql.yml` for JavaScript/TypeScript and GitHub Actions
- Vitest test suite provides comprehensive test coverage
- Dependabot configured for npm and GitHub Actions dependency updates
- All tests must pass before merging changes

### Common Development Tasks
- **Add new page**: Create EJS file in `views/` directory with proper includes for header/footer structure and copyright header
- **Add new include**: Create EJS partial in `views/includes/` directory for reusable components
- **Modify styling**: Edit `public/style/style.css`
- **Add images**: Place in `public/images/` directory
- **Update navigation**: Modify `views/includes/header-navigation.ejs` and `views/includes/footer-navigation.ejs`
- **Update social media links**: Edit footer section in `views/includes/footer-navigation.ejs`
- **Modify splash animation**: Edit `client-src/js/splash.js` (SplashScreen ES6 class with p5.js sketch, Circle class and CirclePoissonDiscSampler for even distribution)
- **Add client-side JavaScript**: Create ES6 modules in `client-src/js/` directory with copyright headers, then run `npm run build`
- **Add wallet functionality**: Edit `client-src/js/wallet.js` (WalletManager ES6 class for EVM wallet connection with MetaMask integration)
- **Add server routes**: Edit `src/app.mjs` (Express routes and middleware)
- **Add database functionality**: Edit `src/db/database-client.mjs` (DatabaseClient class) and `src/db/projects-client.mjs` (ProjectsClient class)
- **Add data models**: Create classes in `src/models/` directory (e.g., Projects class)
- **Add email functionality**: Edit `src/utils/email-client.mjs` (EmailClient class)
- **Add random utilities**: Edit `src/utils/random.mjs` (Random class with selectRandomElement method)
- **Add validation**: Edit `src/utils/validation.mjs` (Validation class)
- **Server configuration**: Edit `src/server.mjs` (port, startup logic, shutdown handling)
- **Add unit tests**: Create test files in `tests/` directory (Vitest format, using .mjs extension)
- **Environment setup**: Edit `.env` file for email and database configuration (not committed to repo)
- **Code quality**: Run `npm run lint` and `npm test` to check for issues and maintain standards
- **Interactive testing**: Use `npm run test:ui` for interactive test running and debugging
- **Test development**: Use `npm run test:watch` for continuous testing during development
- **Update project data**: Modify `Projects` class in `src/models/projects.mjs` to add/modify project information
- **Create error pages**: Add custom error templates in `views/errors/` directory
- **Database development**: Reference `schema/` directory for database structure, sample data, and example queries

## Troubleshooting

### Server Won't Start
- Check that port 3000 is not already in use: `lsof -i :3000`
- Verify Node.js is available: `node --version`
- Ensure dependencies are installed: `npm install`
- Check for syntax errors in `src/server.mjs` or `src/app.mjs`
- Verify database environment variables are configured if using database features

### Contact Form Issues
- Verify `.env` file exists with proper SMTP configuration
- Check server logs for email sending errors
- Test email configuration with external SMTP tool
- Verify environment variables are loaded: check for "[MISSING_ENV_FILE]" warnings

### Database Issues
- Verify `.env` file contains proper MySQL configuration
- Check that MySQL server is running and accessible
- Verify database exists and user has proper permissions
- Check server logs for database connection errors
- Ensure DatabaseClient initialization doesn't throw errors

### Test Failures
- Run `npm test` to see specific test failures
- Check for linting issues: `npm run lint`
- Verify Vitest configuration in `vitest.config.mjs`
- Ensure all dependencies are installed: `npm install`
- Note that some tests are marked as TODO and will be skipped

### Content Not Loading
- Verify EJS templates exist in `views/` directory
- Check for EJS syntax errors in templates
- Verify includes are properly referenced in EJS templates
- Check browser developer tools for 404 errors
- Confirm server is running and responding: `curl -I http://localhost:3000`
- Test API endpoints: `curl -X POST -H "Content-Type: application/json" -d '{"subject":"Test","message":"Test"}' http://localhost:3000/mail`
- Test individual routes: `curl -I http://localhost:3000/projects`, `curl -I http://localhost:3000/contact`, etc.

### External Resources Blocked
- Google Fonts and Bootstrap CDN may be blocked in some environments
- p5.js CDN may be blocked in some environments
- FontAwesome CDN may be blocked in some environments
- This is normal and doesn't affect core site functionality
- Custom CSS in `public/style/style.css` provides fallback styling
- Splash screen will not animate if p5.js fails to load
- Social media icons will not display if FontAwesome fails to load

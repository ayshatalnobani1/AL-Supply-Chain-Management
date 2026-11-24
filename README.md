# AL — Supply Chain Workspace

AL is a full-stack B2B supply-chain portfolio prototype connecting company and supplier workspaces. It brings a shared product marketplace, operational records, and visual reporting into one application. The local demonstration uses fictional data and is not a production-ready multi-tenant system.

## Features

- **Company portal:** dashboard statistics and recent activity, a searchable product marketplace, order records, and operational reports.
- **Supplier portal:** a basic dashboard, shared marketplace, and catalog visualization. Supplier-specific operational ownership is not established.
- **Read-only data views:** products, warehouses, production recipes, stock adjustments, and other records where access is authorized.
- **Account access:** username login, session restoration, logout, organization-based portal navigation, and protected API routes.
- **Reports:** tables and interactive charts for warehouses, supplier orders, inventory movements, and payments.

Availability depends on the authenticated user's permissions and local development configuration. Purchasing and business data mutations are not enabled.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | Angular, TypeScript, RxJS, Chart.js, ng2-charts |
| Backend | Node.js, Express, REST APIs, node-oracledb |
| Database | Oracle Database 19c |
| Authentication | JWT, HttpOnly cookies, bcrypt |

## Architecture and data

The Angular application calls Express REST APIs. Backend middleware verifies the session and applies access checks before controllers query Oracle Database through node-oracledb. The frontend provides separate company and supplier routes based on the user's verified organization association.

The documented Oracle schema covers companies, users and roles, products and images, warehouses and inventory movements, supplier orders, payments, production, recipes, and stock adjustments. Suppliers are represented by company records. Some records do not have a verified organization ownership relationship, so operational data cannot safely be filtered by company throughout the application. See [AL_DATABASE_SCHEMA.md](AL_DATABASE_SCHEMA.md) for the schema reference.

## Authentication and authorization

- Successful login establishes a short-lived signed JWT in an HttpOnly, SameSite cookie; the token is not returned in the JSON response.
- bcrypt hashes are supported; legacy plain-text password verification remains temporarily available for existing accounts. Public signup is disabled.
- Angular guards manage authenticated portal navigation. The backend independently verifies sessions, organization membership, and applicable permissions.
- Marketplace reads require an eligible role and verified organization. Global operational reads are restricted to explicitly approved local-development users and are disabled by default; the development allowlist is inactive in production.
- Logout clears the cookie but does not revoke a previously copied stateless JWT before it expires.

See [AL_PERMISSIONS.md](AL_PERMISSIONS.md) and [AL_RESOURCE_ACCESS.md](AL_RESOURCE_ACCESS.md) for permission and ownership details.

## Reports and charts

Four report tabs combine database records with seven Chart.js visualizations: warehouse capacity; orders by status and over time; inventory quantities by movement type and movement history; and recorded payment amounts by method and payment counts by status. The operational reports show global data for authorized local development, not company-specific results. Recorded payments are not presented as revenue.

## Local setup

**Prerequisites:** Node.js and npm, a running Oracle Database, and an existing compatible schema and account. The repository documents the schema but does not provide a database export, seed data, or a complete schema installation script. Public registration is unavailable, and no demo credentials are included.

1. In `al-backend`, copy `.env.example` to `.env` and configure your own values. Keep `.env` private and generate a cryptographically random JWT secret of at least 32 characters.
2. Install and start the backend:

   ```sh
   cd al-backend
   npm install
   node server.js
   ```

3. In a separate terminal, install and start the frontend:

   ```sh
   cd al-frontend/al-frontend-app
   npm install
   npm start
   ```

4. Open `http://localhost:4200` and sign in with an existing account in your local Oracle database. The API listens on port 3000.

### Backend environment variables

Use `.env.example` as the template; the following values are placeholders, not working credentials:

```dotenv
ORACLE_DB_USER=YOUR_ORACLE_USER
ORACLE_DB_PASSWORD=YOUR_ORACLE_PASSWORD
ORACLE_CONNECT_STRING=YOUR_ORACLE_CONNECT_STRING
JWT_SECRET=YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
DEV_ADMIN_USER_IDS=
```

`DEV_ADMIN_USER_IDS` is an optional comma-separated list of explicitly approved user IDs for global operational reads in local development. Leave it empty to deny that access. Never commit real credentials, tokens, or the populated `.env` file.

### Checks

- Backend tests: `npm test` in `al-backend`.
- Frontend tests: `npm test -- --watch=false --browsers=ChromeHeadless` in `al-frontend/al-frontend-app`.
- Frontend production build: `npm run build` in `al-frontend/al-frontend-app`.

## Screenshots

Screenshots can be added here to showcase the landing page, company and supplier portals, marketplace, and reports.

## Current limitations and future work

- Purchasing, public registration, and full CRUD are unfinished; business mutations remain disabled.
- Most operational records lack verified ownership relationships. Company-specific operational filtering and supplier-order ownership require further design; the shared marketplace also needs production publication rules.
- The local development allowlist is a temporary demonstration policy, not a production authorization model.
- Future work includes migrating legacy passwords to bcrypt, completing ownership-aware permissions and mutation safeguards, and adding account management and production deployment hardening.

This project is intended as a local portfolio demonstration. A separate security and data-ownership review is needed before any production use.

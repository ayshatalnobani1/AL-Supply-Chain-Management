# AL — Supply Chain Workspace

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![Oracle](https://img.shields.io/badge/Oracle%20Database-19c-F80000?logo=oracle)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)

AL is a full-stack B2B supply-chain portfolio prototype that connects a shared product marketplace with company and supplier workspaces. It demonstrates Angular and TypeScript frontend development, Node.js and Express REST APIs, Oracle data integration, and authenticated, permission-aware access to operational information.

The application is designed for local demonstration using fictional data. Its operational views are read-only and available according to the user's access and development configuration.

## Highlights

- **Company workspace:** dashboard statistics and recent activity, searchable marketplace, order records, and reports.
- **Supplier workspace:** a dedicated dashboard, shared marketplace, and catalog insights.
- **Data visualization:** eight interactive Chart.js visualizations across the company reports and supplier catalog, with tables and loading, empty, and error states.
- **Security:** username-based login with bcrypt verification and JWT sessions, organization-aware Angular route guards, and backend authorization checks.
- **Engineering:** typed Angular services, an HTTP interceptor that sends credentials only to the trusted backend, parameterized Oracle queries, and frontend and backend automated tests.

## Screenshots

### Landing page

![AL landing page](screenshots/landing-page.png)

### Sign in

![AL sign-in page](screenshots/login.PNG)

### Orders

![Company orders](screenshots/orders.PNG)

### Supplier orders report

![Supplier orders report and charts](screenshots/supplier%20reports.PNG)

### Payments report

![Payments report and charts](screenshots/payment%20records.PNG)

## Architecture

```text
Angular / TypeScript
  Components · services · route guards · HTTP interceptor
                    |
              REST API requests
                    |
Node.js / Express
  Authentication · authorization · routes · controllers
                    |
              node-oracledb
                    |
          Oracle Database 19c
```

The documented Oracle schema contains **15 tables**, covering companies, users and roles, products and images, warehouses, inventory movements, supplier orders, payments, invoices, production, recipes, and stock adjustments. Supplier organizations are represented by company records. See [AL_DATABASE_SCHEMA.md](AL_DATABASE_SCHEMA.md) for the schema reference.

## Reports and analytics

Seven company-report charts visualize warehouse capacity, order status and trends, inventory movement quantities and history, and recorded payments by method and status. A supplier catalog chart provides an eighth visualization. Operational reports use global data for authorized local development; they do not represent company-specific filtering or revenue.

## Authentication and access

- Login creates a short-lived signed JWT in an HttpOnly, SameSite cookie. The token is not returned in the JSON response.
- bcrypt password hashes and existing legacy plain-text passwords are currently supported. Public signup is disabled.
- Angular guards manage session restoration and portal navigation. Express independently verifies the session, current organization association, and applicable permissions.
- Marketplace reads require an eligible role and verified organization. Global operational reads require an explicitly approved local-development user; this allowlist is inactive in production.
- Logout clears the cookie, but a copied stateless JWT remains valid until it expires.

See [AL_PERMISSIONS.md](AL_PERMISSIONS.md) and [AL_RESOURCE_ACCESS.md](AL_RESOURCE_ACCESS.md) for permission and ownership details.

## Project Availability

AL runs locally and requires an existing compatible Oracle database and user account. The repository documents the schema but does not include a database export or seed data.

## Future improvements

- Complete purchasing, registration, and full CRUD; business mutations are currently disabled.
- Establish verified ownership relationships and company-specific operational filtering, including supplier-order ownership and marketplace publication rules.
- Migrate legacy plain-text passwords to bcrypt and complete production security and authorization hardening.

AL is a local portfolio prototype, not a production-ready multi-tenant system. A separate security and data-ownership review is required before production use.
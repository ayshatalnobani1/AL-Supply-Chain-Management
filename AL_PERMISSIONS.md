# Proposed organization-scoped permission matrix

This is a provisional proposal except for the expressly enabled reads below. The original application does not document detailed role permissions. Other choices must be approved before they are applied to routes.

Each cell describes `read` and `manage` capabilities: R = read; M = manage; — = neither. Manage is a proposed capability, not permission to execute current mutation endpoints.

| Role | Products | Orders | Inventory | Warehouses | Production | Reports | Payments | Users | Roles |
|---|---|---|---|---|---|---|---|---|---|
| Admin | R, M | R, M | R, M | R, M | R, M | R, M | R, M | R, M | R, M |
| Manager | R, M | R, M | R, M | R, M | R, M | R | — | — | — |
| Employee | R | R | R | R | R | — | — | — | — |
| Supplier | R | R | — | — | — | — | — | — | — |
| eng | — | — | — | — | — | — | — | — | — |

The identifiers are `<resource>:read` and `<resource>:manage` for each resource listed in the table. Unknown roles and permission identifiers are denied. `eng` has no documented purpose and receives no business permissions.

Marketplace reads are enforced for Admin, Manager, Employee, and Supplier: `products:read` covers products and product images, and the separate `suppliers:read` capability covers the supplier directory. `eng` and unknown roles are denied. Organization membership remains a separate prerequisite. These reads preserve the existing shared local-development catalog, not a company ownership rule; production marketplace publication and visibility rules remain unresolved.

These capabilities are organization-scoped intentions, not global privileges. The permission helper does not verify organization membership or ownership: future routes must first authenticate using current Oracle identity, verify organization membership, and enforce verified resource-level organization scope. Until ownership and filtering rules are established, passing a role check alone must never grant access to global operational data.

The current temporary endpoint policy remains authoritative: marketplace reads require an authenticated verified organization and the relevant marketplace permission; global operational reads require the explicit local-development allowlist; self user/profile reads and the Admin same-company user directory are permitted under their separate rules; other user/profile reads are denied; and business mutations are disabled. The local-development allowlist does not bypass marketplace permissions, remains inactive in production, and must not be interpreted as permanent Admin authority.

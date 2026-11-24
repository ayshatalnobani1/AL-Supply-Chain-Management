# AL database schema reference

> Generated from read-only Oracle dictionary and aggregate queries while the AL application was running. The active Oracle schema is the authoritative reference for restoration work. This document contains metadata and aggregate counts only: it intentionally excludes all account credentials, password values, and password-hash values.

## Scope and conventions

- **Active tables:** 15. Recycle-bin objects are excluded.
- **Required** means Oracle marks the column `NOT NULL`; **optional** means it is nullable.
- Unless a default is explicitly listed, the Oracle dictionary reports no default.
- All listed constraints are enabled. `PK`, `FK`, `UQ`, and `CHECK` mean primary key, foreign key, unique, and check constraint.

## Record counts

| Table | Rows |
|---|---:|
| COMPANIES | 9 |
| INVENTORY_MOVEMENTS | 4 |
| INVOICES | 3 |
| ORDER_STATUS | 5 |
| PAYMENTS | 2 |
| PRODUCTIONS | 11 |
| PRODUCTION_RECIPES | 13 |
| PRODUCTS | 28 |
| PRODUCT_IMAGES | 24 |
| ROLES | 5 |
| STOCK_ADJUSTMENTS | 11 |
| SUPPLIER_ORDERS | 23 |
| USERS | 67 |
| USER_PROFILES | 2 |
| WAREHOUSES | 7 |

## Tables and columns

### COMPANIES

**Keys and constraints:** PK `COMPANY_ID`; UQ `COMPANY_NAME`; UQ `EMAIL`; FK `USER_ID` → `USERS.USER_ID`; CHECK `COMPANY_TYPE IN ('company', 'supplier')`.

| Column | Type | Required | Default |
|---|---|---|---|
| COMPANY_ID | NUMBER | Yes | identity sequence `ISEQ$$_78644.NEXTVAL` |
| COMPANY_NAME | VARCHAR2(255) | Yes | — |
| EMAIL | VARCHAR2(255) | Yes | — |
| PASSWORD_HASH | VARCHAR2(255) | Yes | — |
| ADDRESS | VARCHAR2(255) | No | — |
| PHONE | VARCHAR2(50) | No | — |
| CREATED_AT | DATE | No | `SYSDATE` |
| USER_ID | NUMBER | No | — |
| COMPANY_TYPE | VARCHAR2(50) | No | — |

### INVENTORY_MOVEMENTS

**Keys and constraints:** PK `MOVEMENT_ID`; FK `PRODUCT_ID` → `PRODUCTS.PRODUCT_ID`; FK `WAREHOUSE_ID` → `WAREHOUSES.WAREHOUSE_ID`; FK `SUPPLIER_ORDER_ID` → `SUPPLIER_ORDERS.SUPPLIER_ORDER_ID`; CHECK `MOVEMENT_TYPE IN ('IN', 'OUT')`.

| Column | Type | Required | Default |
|---|---|---|---|
| MOVEMENT_ID | NUMBER | Yes | — |
| PRODUCT_ID | NUMBER | No | — |
| WAREHOUSE_ID | NUMBER | No | — |
| MOVEMENT_TYPE | VARCHAR2(10) | No | — |
| QUANTITY | NUMBER | No | — |
| MOVEMENT_DATE | DATE | No | — |
| MOVEMENT_REASON | VARCHAR2(255) | No | — |
| SUPPLIER_ORDER_ID | NUMBER | No | — |

### INVOICES

**Keys and constraints:** PK `INVOICE_ID`; FK `SUPPLIER_ORDER_ID` → `SUPPLIER_ORDERS.SUPPLIER_ORDER_ID`; required `INVOICE_NUMBER`, `SUPPLIER_ORDER_ID`, `AMOUNT`, and `DUE_DATE`.

| Column | Type | Required | Default |
|---|---|---|---|
| INVOICE_ID | NUMBER | Yes | — |
| INVOICE_NUMBER | VARCHAR2(50) | Yes | — |
| SUPPLIER_ORDER_ID | NUMBER | Yes | — |
| AMOUNT | NUMBER(10,2) | Yes | — |
| DUE_DATE | DATE | Yes | — |
| DESCRIPTION | VARCHAR2(255) | No | — |

### ORDER_STATUS

**Keys and constraints:** PK `STATUS_ID`.

| Column | Type | Required | Default |
|---|---|---|---|
| STATUS_ID | NUMBER | Yes | — |
| STATUS_NAME | VARCHAR2(50) | No | — |

### PAYMENTS

**Keys and constraints:** PK `PAYMENT_ID`; FK `SUPPLIER_ORDER_ID` → `SUPPLIER_ORDERS.SUPPLIER_ORDER_ID`; CHECK `PAYMENT_STATUS IN ('Pending', 'Completed', 'Failed')`.

| Column | Type | Required | Default |
|---|---|---|---|
| PAYMENT_ID | NUMBER | Yes | — |
| SUPPLIER_ORDER_ID | NUMBER | No | — |
| AMOUNT | NUMBER(10,2) | No | — |
| PAYMENT_DATE | DATE | No | — |
| PAYMENT_METHOD | VARCHAR2(20) | No | — |
| PAYMENT_STATUS | VARCHAR2(20) | No | — |

### PRODUCTIONS

**Keys and constraints:** PK `PRODUCTION_ID`; FK `PRODUCT_ID` → `PRODUCTS.PRODUCT_ID`; FK `RECIPE_ID` → `PRODUCTION_RECIPES.RECIPE_ID`.

| Column | Type | Required | Default |
|---|---|---|---|
| PRODUCTION_ID | NUMBER | Yes | — |
| PRODUCT_ID | NUMBER | No | — |
| PRODUCTION_DATE | DATE | No | — |
| QUANTITY | NUMBER | No | — |
| RECIPE_ID | NUMBER | No | — |

### PRODUCTION_RECIPES

**Keys and constraints:** PK `RECIPE_ID`.

| Column | Type | Required | Default |
|---|---|---|---|
| RECIPE_ID | NUMBER | Yes | — |
| RECIPE_NAME | VARCHAR2(100) | No | — |
| INGREDIENTS | VARCHAR2(255) | No | — |
| PREPARATION_METHOD | VARCHAR2(500) | No | — |

### PRODUCTS

**Keys and constraints:** PK `PRODUCT_ID`; FK `WAREHOUSE_ID` → `WAREHOUSES.WAREHOUSE_ID`; FK `COMPANY_ID` → `COMPANIES.COMPANY_ID`; CHECK `IS_ACTIVE IN ('Y', 'N')`.

| Column | Type | Required | Default |
|---|---|---|---|
| PRODUCT_ID | NUMBER | Yes | — |
| PRODUCT_NAME | VARCHAR2(100) | No | — |
| PRODUCT_CATEGORY | VARCHAR2(50) | No | — |
| PRICE | NUMBER(10,2) | No | — |
| STOCK_QUANTITY | NUMBER | No | — |
| EXPIRY_DATE | DATE | No | — |
| IS_ACTIVE | CHAR(1) | No | — |
| WAREHOUSE_ID | NUMBER | No | — |
| COMPANY_ID | NUMBER | No | — |

### PRODUCT_IMAGES

**Keys and constraints:** PK `IMAGE_ID`; FK `PRODUCT_ID` → `PRODUCTS.PRODUCT_ID`; UQ `PRODUCT_ID` (`UNIQUE_PRODUCT_IMAGE`).

| Column | Type | Required | Default |
|---|---|---|---|
| IMAGE_ID | NUMBER | Yes | — |
| PRODUCT_ID | NUMBER | No | — |
| IMAGE_URL | VARCHAR2(255) | No | — |

### ROLES

**Keys and constraints:** PK `ROLE_ID`.

| Column | Type | Required | Default |
|---|---|---|---|
| ROLE_ID | NUMBER | Yes | — |
| ROLE_NAME | VARCHAR2(50) | No | — |
| DESCRIPTION | VARCHAR2(255) | No | — |

### STOCK_ADJUSTMENTS

**Keys and constraints:** PK `ADJUSTMENT_ID`; FK `PRODUCT_ID` → `PRODUCTS.PRODUCT_ID`.

| Column | Type | Required | Default |
|---|---|---|---|
| ADJUSTMENT_ID | NUMBER | Yes | — |
| PRODUCT_ID | NUMBER | No | — |
| ADJUSTMENT_DATE | DATE | No | — |
| QUANTITY_ADJUSTED | NUMBER | No | — |
| REASON | VARCHAR2(255) | No | — |

### SUPPLIER_ORDERS

**Keys and constraints:** PK `SUPPLIER_ORDER_ID`; FK `USER_ID` → `USERS.USER_ID`; FK `STATUS_ID` → `ORDER_STATUS.STATUS_ID`; FK `PRODUCT_ID` → `PRODUCTS.PRODUCT_ID`; FK `COMPANY_ID` → `COMPANIES.COMPANY_ID`; CHECK `STATUS IN ('Pending', 'Shipped', 'Received')`.

| Column | Type | Required | Default |
|---|---|---|---|
| SUPPLIER_ORDER_ID | NUMBER | Yes | — |
| USER_ID | NUMBER | No | — |
| ORDER_DATE | DATE | No | — |
| STATUS | VARCHAR2(20) | No | — |
| TOTAL_AMOUNT | NUMBER(10,2) | No | — |
| STATUS_ID | NUMBER | No | — |
| PRODUCT_ID | NUMBER | No | — |
| COMPANY_ID | NUMBER | No | — |
| QUANTITY | NUMBER | No | — |

### USERS

**Keys and constraints:** PK `USER_ID`; FK `ROLE_ID` → `ROLES.ROLE_ID`; FK `COMPANY_ID` → `COMPANIES.COMPANY_ID`; required `USERNAME` and `USER_PASSWORD`; CHECK `COMPANY_TYPE IN ('company', 'supplier')`.

| Column | Type | Required | Default |
|---|---|---|---|
| USER_ID | NUMBER | Yes | — |
| USERNAME | VARCHAR2(50) | Yes | — |
| USER_PASSWORD | VARCHAR2(100) | Yes | — |
| FULL_NAME | VARCHAR2(100) | No | — |
| EMAIL | VARCHAR2(100) | No | — |
| PHONE_NUMBER | VARCHAR2(15) | No | — |
| ROLE_ID | NUMBER | No | — |
| COMPANY_TYPE | VARCHAR2(20) | No | — |
| COMPANY_ID | NUMBER | No | — |

### USER_PROFILES

**Keys and constraints:** PK `PROFILE_ID`; FK `USER_ID` → `USERS.USER_ID`.

| Column | Type | Required | Default |
|---|---|---|---|
| PROFILE_ID | NUMBER | Yes | — |
| USER_ID | NUMBER | No | — |
| FULL_NAME | VARCHAR2(100) | No | — |
| COMPANY_NAME | VARCHAR2(100) | No | — |
| CONTACT_NUMBER | VARCHAR2(20) | No | — |
| ADDRESS | VARCHAR2(255) | No | — |
| IMAGE_URL | VARCHAR2(255) | No | — |

### WAREHOUSES

**Keys and constraints:** PK `WAREHOUSE_ID`.

| Column | Type | Required | Default |
|---|---|---|---|
| WAREHOUSE_ID | NUMBER | Yes | — |
| WAREHOUSE_LOCATION | VARCHAR2(100) | No | — |
| CAPACITY | NUMBER(10,0) | No | — |
| MANAGER | VARCHAR2(100) | No | — |

## Relationship map

```text
ROLES ──< USERS >── COMPANIES
             │          │
             └──< USER_PROFILES

COMPANIES ──< PRODUCTS >── WAREHOUSES
                  │
                  ├──< PRODUCT_IMAGES
                  ├──< INVENTORY_MOVEMENTS >── SUPPLIER_ORDERS
                  ├──< STOCK_ADJUSTMENTS
                  └──< PRODUCTIONS >── PRODUCTION_RECIPES

COMPANIES ──< SUPPLIER_ORDERS >── USERS
                     │       └── ORDER_STATUS
                     ├──< PAYMENTS
                     └──< INVOICES
```

`SUPPLIER_ORDERS` has no active foreign key to a supplier entity. Its name is historical/domain terminology, not proof of a current supplier-table relationship.

## Roles

| ROLE_ID | ROLE_NAME |
|---:|---|
| 1 | Admin |
| 2 | Manager |
| 3 | Employee |
| 4 | Supplier |
| 5 | eng |

## Companies and suppliers: evidence and limits

There is no active `SUPPLIERS` table. Supplier representation in the current schema is instead evidenced by:

- `COMPANIES.COMPANY_TYPE` is constrained to `company` or `supplier`; current aggregate counts are 3 `company` and 6 `supplier` rows.
- `USERS.COMPANY_TYPE` has the same permitted values; current aggregate counts are 24 `company`, 4 `supplier`, and 39 null rows.
- `ROLES` includes `Supplier` (`ROLE_ID = 4`).
- `USERS.COMPANY_ID` and `COMPANIES.USER_ID` create an enabled two-way association at the schema level.

The role and company-type concepts are **not equivalent**: aggregate data shows Admin and Manager users may also have `company_type = supplier`, while the Supplier role currently has a null `COMPANY_TYPE`. Therefore no rule can safely infer supplier identity from role alone. There is also no FK from `SUPPLIER_ORDERS` to a supplier company or supplier user. The intended supplier-side ownership/fulfilment relationship remains uncertain.

## Sequences and triggers

All listed sequences have increment 1 and are non-cycling/non-ordered. Existing sequences:

`COMPANIES_SEQ`, `INVENTORY_MOVEMENTS_SEQ`, `INVOICES_SEQ`, `ISEQ$$_78644`, `ORDER_STATUS_SEQ`, `PAYMENTS_SEQ`, `PRODUCTIONS_SEQ`, `PRODUCTION_RECIPES_SEQ`, `PRODUCTS_SEQ`, `PRODUCT_IMAGES_SEQ`, `ROLES_SEQ`, `SEQ_COMPANY_ID`, `STOCK_ADJUSTMENTS_SEQ`, `SUPPLIERS_SEQ`, `SUPPLIER_ORDERS_SEQ`, `USERS_SEQ`, `USER_PROFILES_SEQ`, and `WAREHOUSES_SEQ`.

No active database triggers were found. `COMPANIES.COMPANY_ID` has an identity-style default backed by `ISEQ$$_78644`; `COMPANIES.CREATED_AT` defaults to `SYSDATE`.

`SUPPLIERS_SEQ` exists even though no active `SUPPLIERS` table exists. It is retained historical metadata and must not be treated as evidence that the supplier table is still available.

## Known backend discrepancies

| Backend area | Live schema finding |
|---|---|
| `suppliersController` | Queries nonexistent `SUPPLIERS`; active schema has no such table. |
| `productsController` | Uses `name` and `category`; table columns are `PRODUCT_NAME` and `PRODUCT_CATEGORY`. |
| `warehousesController` | Uses `location`; table column is `WAREHOUSE_LOCATION`. |
| `supplier_ordersController` | Uses `ORDER_ID` and `SUPPLIER_ID`; table uses `SUPPLIER_ORDER_ID` and has no `SUPPLIER_ID`. |
| `paymentsController` | Uses `ORDER_ID` and `method`; table uses `SUPPLIER_ORDER_ID` and `PAYMENT_METHOD`. |
| `productionsController` | Uses `QUANTITY_PRODUCED`; table uses `QUANTITY`. |
| `production_recipesController` | Expects product/ingredient/quantity fields; table has recipe name, ingredients, and preparation method instead. |
| `stock_adjustmentsController` | Expects warehouse/type/quantity fields; table has `QUANTITY_ADJUSTED` and `REASON`, with no warehouse reference. |
| `orderStatusController` | Uses `DESCRIPTION`; table has no `DESCRIPTION` column. |
| `usersController` | Uses `PASSWORD`; live schema has `USER_PASSWORD` only. |
| API serialization | Controllers return raw Oracle rows, which become positional arrays rather than named JSON properties required by Angular. |
| Missing API domains | Populated `COMPANIES` and `INVOICES` tables have no mounted backend routes/controllers. |

## Restoration rule

Use this document and the live Oracle schema as the source of truth. Align backend DTOs and SQL to it before connecting or rebuilding Angular data views. Do not infer or recreate a supplier relationship until the intended business rule is confirmed.

# Listalicious Backend API Reference

**Framework:** FastAPI (Python) + MongoDB (Motor async driver)
**Dev base URL:** `http://192.168.50.207:8000`
**Swagger UI:** `<base_url>/docs`
**CORS allowed origins:** `http://localhost:8081`, `https://localhost:8081`

---

## Authentication

- **Type:** JWT Bearer (HS256, 60-minute expiry)
- **Token payload:** `{ "sub": "user@email.com", "exp": ... }`
- **All routes except `/auth/register` and `/auth/login` require:**
  ```
  Authorization: Bearer <access_token>
  ```

---

## Auth Endpoints

### `POST /auth/register`
**Body (JSON):**
```json
{ "email": "user@example.com", "password": "secret", "username": "optional" }
```
**Response 201:**
```json
{ "id": "...", "email": "...", "username": "...", "created_at": "...", "updated_at": "..." }
```
**Errors:** `400 { "detail": "Email already registered" }`

---

### `POST /auth/login`
**Body (form-urlencoded):**
```
username=user@example.com&password=secret
```
> Note: field is named `username` but accepts an email address (OAuth2PasswordRequestForm convention)

**Response 200:**
```json
{ "access_token": "eyJ...", "token_type": "bearer" }
```
**Errors:** `401 { "detail": "Invalid credentials" }`

---

### `GET /auth/me` — *requires auth*
**Response 200:**
```json
{ "email": "...", "username": "...", "_id": "...", "created_at": "...", "updated_at": "..." }
```

---

## Lists Endpoints

### `POST /lists` — *requires auth*
**Body (JSON):**
```json
{ "title": "Weekly Shop" }
```
**Response 201:**
```json
{
  "id": "...", "title": "Weekly Shop",
  "owner_id": "...", "items": [], "shared_with": [],
  "created_at": "...", "updated_at": "..."
}
```

---

### `GET /lists` — *requires auth*
Returns all lists **owned by** the current user.
**Response 200:** Array of list objects (same shape as POST response).

---

### `GET /lists/{list_id}` — *requires auth*
Returns a single list. Accessible if user is owner **or** in `shared_with`.
**Errors:** `404` (not found or no access), `403` (forbidden)

---

### `PUT /lists/{list_id}` — *requires auth, owner only*
**Body (JSON):**
```json
{ "title": "New Title" }
```
**Response 200:** Updated list object.
**Errors:** `403 { "detail": "Owner required" }`, `404`

---

### `DELETE /lists/{list_id}` — *requires auth, owner only*
**Response 204** (no body).

---

## Items Endpoints

All items are scoped under a list: `/lists/{list_id}/items`
Access: any user who owns the list **or** is in its `shared_with` array.

---

### `GET /lists/{list_id}/items` — *requires auth*
**Response 200:**
```json
[
  {
    "id": "...", "name": "Milk", "quantity": 2, "unit": "liters",
    "note": "Whole milk", "is_checked": false,
    "list_id": "...", "created_at": "...", "updated_at": "..."
  }
]
```

---

### `POST /lists/{list_id}/items` — *requires auth*
**Body (JSON):**
```json
{
  "name": "Milk",
  "quantity": 2,
  "unit": "liters",       // optional
  "note": "Whole milk",   // optional
  "is_checked": false     // optional, default false
}
```
**Response 201:** Created item object.

---

### `PUT /lists/{list_id}/items/{item_id}` — *requires auth*
All fields optional (partial update). **Do not send extra/unknown fields — returns 422.**
```json
{
  "name": "Oat Milk",
  "quantity": 1,
  "unit": "liters",
  "note": "",
  "is_checked": true
}
```
**Response 200:** Updated item object.
**Errors:** `400 { "detail": "No fields to update" }`, `404`, `403`

---

### `DELETE /lists/{list_id}/items/{item_id}` — *requires auth*
**Response 204** (no body).

---

## Sharing Endpoints

### `POST /lists/{list_id}/share` — *requires auth, owner only*
Shares the list with another user by email. Idempotent (won't duplicate).
```json
{ "email": "friend@example.com" }
```
**Response 200:**
```json
{ "list_id": "...", "shared_with": ["user_id_1", "user_id_2"] }
```
**Errors:** `404 { "detail": "User not found" }`, `403`

---

### `POST /lists/{list_id}/unshare` — *requires auth, owner only*
Removes a user's access by email.
```json
{ "email": "friend@example.com" }
```
**Response 200:**
```json
{ "list_id": "...", "shared_with": ["user_id_1"] }
```

---

## Data Shapes Summary

### User (in responses)
```ts
{ id: string, email: string, username?: string, created_at: string, updated_at: string }
```

### GroceryList
```ts
{
  _id: string, title: string, owner_id: string,
  items: [],           // always empty array in list doc (items fetched separately)
  shared_with: string[], // array of user ID strings
  created_at: string, updated_at: string
}
```

### Item
```ts
{
  _id: string, name: string, quantity: number, unit?: string,
  note?: string, is_checked: boolean, list_id: string,
  created_at: string, updated_at: string
}
```

---

## Error Format

All errors return:
```json
{ "detail": "Error message" }
```

| Status | Meaning |
|---|---|
| 201 | Created |
| 200 | OK |
| 204 | Deleted (no body) |
| 400 | Bad request (duplicate email, no fields to update) |
| 401 | Invalid/expired token or wrong credentials |
| 403 | Forbidden (not owner, no list access) |
| 404 | Not found (also used when hiding existence from unauthorized users) |
| 422 | Validation error (bad body shape, extra fields in ItemUpdate) |
| 500 | DB/server error |

---

## Access Control Rules

| Action | Who can do it |
|---|---|
| Read a list / its items | Owner or any user in `shared_with` |
| Create/update/delete a list | Owner only |
| Create/update/delete items | Owner or any user in `shared_with` |
| Share / unshare a list | Owner only |

---

## Key Notes for Frontend

- **Timestamps** are ISO 8601 strings (e.g. `"2024-03-29T10:00:00"`)
- **IDs** are MongoDB ObjectIds serialized as plain strings
- The `items` field on a list document is always an empty array — fetch items via `GET /lists/{list_id}/items`
- Share/unshare takes an **email address**; the server resolves it to a user ID
- `GET /lists` only returns lists you **own** — no combined owned+shared endpoint yet
- Login uses `application/x-www-form-urlencoded`, not JSON

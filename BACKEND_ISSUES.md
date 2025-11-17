# Backend API Issues and Limitations

## ✅ RESOLVED: Issue 1: `/users/users/` endpoint doesn't return employee information

### ~~Current~~ Previous Behavior (FIXED)
- **GET `/users/users/`** returns:
  ```json
  {
    "count": 3,
    "results": [
      {
        "id": 1,
        "username": "admin",
        "email": "asdmi@asdads.com",
        "first_name": "фывфыв",
        "last_name": "фывфц",
        "full_name": "фывфыв фывфц",
        "is_active": true,
        "date_joined": "2025-11-17T11:38:28.234407+05:00"
      }
    ]
  }
  ```

- **Missing fields:** `phone`, `role`, `sex`, `photo` (employee information)

### ✅ Current Behavior (AFTER FIX)
The endpoint NOW includes employee information in the response:

```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "email": "asdmi@asdads.com",
      "first_name": "фывфыв",
      "last_name": "фывфц",
      "full_name": "фывфыв фывфц",
      "is_active": true,
      "date_joined": "2025-11-17T11:38:28.234407+05:00",
      "employee_info": {
        "id": 1,
        "role": "owner",
        "role_display": "Владелец",
        "phone": "+998888888888",
        "position": null,
        "is_active": true,
        "hired_at": "2025-11-17",
        "photo": null
      }
    }
  ]
}
```

### ✅ Resolution
**Backend fix has been implemented!** The endpoint now returns complete employee information including:
- `id` - Employee ID
- `role` - Role code (owner, manager, cashier, etc.)
- `role_display` - Human-readable role name (Владелец, Менеджер, Кассир, etc.)
- `phone` - Employee phone number
- `position` - Employee position (optional)
- `is_active` - Employee active status
- `hired_at` - Hire date
- `photo` - Employee photo URL

### Frontend Updates
- ✅ Updated `User` type to match new `employee_info` structure
- ✅ Changed Seller page to use `role_display` for better UX
- ✅ Kept optional chaining for backward compatibility
- ✅ All employee data now displays correctly

---

## Issue 2: Inconsistent field structure for user creation/update

### Current Behavior
- **POST `/users/users/`** expects flat fields:
  ```json
  {
    "username": "user1",
    "password": "pass123",
    "first_name": "John",
    "phone": "+998901234567",
    "role": "cashier",
    "sex": "male"
  }
  ```

- **PATCH `/users/users/{id}/`** also expects flat fields (without role):
  ```json
  {
    "first_name": "John",
    "phone": "+998901234567",
    "sex": "male"
  }
  ```

### Expected Behavior
For consistency, consider using nested `employee` or `employee_info` structure:

```json
{
  "username": "user1",
  "password": "pass123",
  "first_name": "John",
  "employee": {
    "phone": "+998901234567",
    "role": "cashier",
    "sex": "male"
  }
}
```

### Frontend Status
✅ Frontend currently works with the flat structure (as designed by backend)

### Recommendation
Keep the current flat structure for simplicity, but ensure GET endpoints return the same fields that are accepted in POST/PATCH.

---

## Summary

### ✅ Completed (All Issues Resolved!)
- ✅ `/users/users/` GET endpoint now returns `employee_info` nested object
- ✅ Frontend types updated to match new API structure
- ✅ Seller page displays phone numbers and roles correctly
- ✅ Using `role_display` for better UX
- ✅ User creation/update works correctly with current API structure
- ✅ Optional chaining provides backward compatibility

### ✅ Additional Improvements
- ✅ Backend provides `/users/users/{id}/update-employee/` endpoint for updating employee info
  - Allows updating: `role`, `phone`, `position`, `is_active`
  - Available for owner and manager roles
  - Supports partial updates (can update only specific fields)
- ✅ Frontend now uses separate API calls for user and employee updates

### Priority 2 (Nice to have)
- [ ] Consider standardizing field structure across all user endpoints
- [ ] ~~Add role field to PATCH `/users/users/{id}/`~~ - Role updates handled via `/update-employee/`

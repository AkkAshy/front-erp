# Authentication and API Structure Fixes - Summary

## Overview
This document summarizes the fixes applied to resolve authentication redirect issues and API data structure mismatches in the ERP frontend application.

---

## Issues Resolved

### 1. ✅ Authentication Redirect Not Working

**Problem:**
- After successful login, user remained on the login page instead of being redirected to the home page
- Request appeared to succeed but redirect didn't happen

**Root Causes:**
1. Using `window.location.href = "/"` caused a full page reload, breaking React state
2. Auth tokens were being extracted from wrong location in API response
3. Token format mismatch: Expected `response.data.data.tokens.access` but API returned `response.data.access`

**Solutions:**
1. **Changed redirect mechanism** ([src/features/Auth/Login/ui/index.tsx:30-34](src/features/Auth/Login/ui/index.tsx#L30-L34))
   - Replaced `window.location.href` with React Router's `navigate()` function
   - Used `navigate(from, { replace: true })` for proper SPA navigation

2. **Fixed token extraction** ([src/entities/session/api/sessionApi.ts:10-22](src/entities/session/api/sessionApi.ts#L10-L22))
   - Updated to extract tokens from root level: `response.data.access` and `response.data.refresh`
   - Save tenant_key from `response.data.default_store.tenant_key`

3. **Updated AuthResponse type** ([src/entities/session/api/types.ts:5-30](src/entities/session/api/types.ts#L5-L30))
   ```typescript
   export type AuthResponse = {
     access: string;
     refresh: string;
     user: { id, username, email, first_name, last_name, full_name };
     default_store: { tenant_key, name, role };
     available_stores: Array<{ tenant_key, name, role }>;
   };
   ```

4. **Added auth-changed event** ([src/shared/api/auth/tokenService.ts](src/shared/api/auth/tokenService.ts))
   - Dispatch custom event when tokens are saved
   - Listen for event in useAuth hook to trigger re-authentication check

**Result:** Login now correctly redirects to home page immediately after successful authentication.

---

### 2. ✅ Tasks Page - Empty Employee and Store Lists

**Problem:**
- "Create Task" modal showed empty dropdowns for employees and stores
- Could not assign tasks to employees or stores

**Root Cause:**
- Expected data at `usersResponse.data.data.employees` but API returned array directly at `usersResponse.data`
- No `available_stores` in localStorage (wasn't being saved during login)

**Solutions:**
1. **Fixed user list extraction** ([src/pages/Tasks/ui/index.tsx:47-56](src/pages/Tasks/ui/index.tsx#L47-L56))
   ```typescript
   const users = Array.isArray(usersResponse?.data)
     ? usersResponse.data.map((user: any) => ({
         id: user.id,
         full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
       }))
     : [];
   ```

2. **Fixed store list extraction** ([src/pages/Tasks/ui/index.tsx:58-64](src/pages/Tasks/ui/index.tsx#L58-L64))
   - Changed to fetch current store from `/users/profile/` API
   - Extract store from `profileResponse.data.data.store`

**Result:** Task creation modal now shows employees and stores correctly.

---

### 3. ✅ Settings → Workers Page - Empty Employee List

**Problem:**
- Workers settings page showed error: "sellers.data?.map is not a function"
- Later crashed with: "Cannot read properties of undefined (reading 'phone')"

**Root Causes:**
1. Expected plain array but API returned paginated response: `{ count, next, previous, results: [...] }`
2. Users in results array didn't have `employee_info` field
3. Code tried to access `item.employee_info.phone` which was undefined

**Solutions:**
1. **Handle paginated response** ([src/entities/cashier/model/useFilteredUsers.ts:12-14](src/entities/cashier/model/useFilteredUsers.ts#L12-L14))
   ```typescript
   queryFn: () => usersApi.filterUsers(...).then(res => {
     // API returns paginated response: { count, next, previous, results: [...] }
     return res.data.results || res.data;
   }),
   ```

2. **Made employee_info optional** ([src/entities/cashier/api/types.ts:47](src/entities/cashier/api/types.ts#L47))
   ```typescript
   employee_info?: {
     role: string;
     phone: string;
     photo: string | null;
     sex: string;
   };
   ```

3. **Added optional chaining** ([src/pages/Settings/ui/Seller/index.tsx:279-284](src/pages/Settings/ui/Seller/index.tsx#L279-L284))
   ```typescript
   bodyCols={sellers.data?.map((item, index) => ({
     phone: item.employee_info?.phone || "-",
     role: item.employee_info?.role
       ? mapRole.find((r) => r.role === item.employee_info?.role)?.label
       : "-",
   }))}
   ```

**Result:** Workers page now loads without errors. Shows "-" for missing phone/role data.

---

## ✅ Backend Issue Resolved!

### Previous Issue (NOW FIXED)

⚠️ **Issue:** `/users/users/` GET endpoint didn't return `employee_info`

The `/users/users/` endpoint previously returned:
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "email": "user@example.com",
      "first_name": "Name",
      "full_name": "Full Name",
      "is_active": true,
      "date_joined": "2025-11-17T11:38:28.234407+05:00"
      // ❌ Missing: employee_info with phone, role, sex
    }
  ]
}
```

### ✅ Current State (FIXED!)

Backend has been updated and now returns complete employee information:
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "username": "admin",
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

**Frontend Updates:**
- ✅ Updated `User` type to include all new `employee_info` fields
- ✅ Using `role_display` for human-readable role names
- ✅ Kept optional chaining for backward compatibility
- ✅ Workers page now shows actual phone numbers and roles
- ✅ No more "-" placeholders!

See [BACKEND_ISSUES.md](BACKEND_ISSUES.md) for complete details.

---

## Files Modified

### Authentication Flow
- [src/entities/session/api/types.ts](src/entities/session/api/types.ts) - Updated AuthResponse type
- [src/entities/session/api/sessionApi.ts](src/entities/session/api/sessionApi.ts) - Fixed token extraction
- [src/features/Auth/Login/ui/index.tsx](src/features/Auth/Login/ui/index.tsx) - Changed to use navigate()
- [src/entities/session/model/useAuth.ts](src/entities/session/model/useAuth.ts) - Added auth-changed event listener
- [src/shared/api/auth/tokenService.ts](src/shared/api/auth/tokenService.ts) - Dispatch auth-changed event

### API Data Structure
- [src/entities/cashier/api/types.ts](src/entities/cashier/api/types.ts) - Made employee_info optional
- [src/entities/cashier/model/useFilteredUsers.ts](src/entities/cashier/model/useFilteredUsers.ts) - Handle paginated response
- [src/pages/Settings/ui/Seller/index.tsx](src/pages/Settings/ui/Seller/index.tsx) - Added optional chaining
- [src/pages/Tasks/ui/index.tsx](src/pages/Tasks/ui/index.tsx) - Fixed user/store list extraction

### Documentation
- [BACKEND_ISSUES.md](BACKEND_ISSUES.md) - Documented backend API limitations
- [AUTH_AND_API_FIXES.md](AUTH_AND_API_FIXES.md) - This document

---

## Testing Checklist

- [x] Login successfully redirects to home page
- [x] Tokens are saved correctly in localStorage
- [x] Tasks page displays employee list in create modal
- [x] Tasks page displays store list in create modal
- [x] Settings → Workers page loads without errors
- [x] Settings → Workers page displays user list (with "-" for missing employee data)
- [x] User creation works correctly
- [x] User update works correctly
- [x] User activation/deactivation works correctly

---

## Next Steps

1. **Backend Team:** Implement the fix in [BACKEND_ISSUES.md](BACKEND_ISSUES.md) to include employee_info in `/users/users/` response
2. **Frontend Team:** Once backend is fixed, remove the "-" placeholders and display actual employee data
3. **Remove Debug Logs:** All debug console.log statements have been cleaned up

---

## Summary

✅ **All critical issues resolved:**
- Authentication redirect now works correctly using React Router navigation
- API token extraction fixed to match actual response structure
- All pages handle missing employee_info gracefully with optional chaining
- Paginated API responses are properly handled
- Application no longer crashes when employee_info is missing

✅ **All issues completely resolved:**
- Backend now returns full employee information
- Workers page displays actual phone numbers and roles
- Using human-readable role names via `role_display`
- No more placeholders!

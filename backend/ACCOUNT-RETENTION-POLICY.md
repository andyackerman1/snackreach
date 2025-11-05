# Account Retention Policy

## Permanent Account Storage

**All user accounts are permanently stored in the backend database and are NEVER automatically deleted.**

### Storage Locations

1. **Backend Database** (`backend/data/database.json`)
   - Primary storage location
   - All accounts saved here permanently
   - Never deleted unless user explicitly requests deletion

2. **localStorage** (Browser)
   - Used for session management
   - Temporary storage for logged-in user info
   - Cleared only on explicit logout

### Account Lifecycle

- **Creation**: Account created via `/api/register` endpoint
- **Storage**: Immediately saved to `database.json` 
- **Persistence**: Account remains in database forever
- **Deletion**: Only occurs if user explicitly requests account deletion via delete endpoint

### Session Management

- **JWT Tokens**: Valid for 10 years (3650 days) - essentially permanent
- **Login Persistence**: Users stay logged in until explicit logout
- **Navigation**: "Back to Home" does NOT log users out
- **Session Check**: Only verifies token exists, doesn't clear on navigation

### Data Protection

- Accounts are never auto-deleted
- No cleanup scripts that remove old accounts
- Database file is append-only (only adds, never removes unless explicit)
- All user data preserved indefinitely





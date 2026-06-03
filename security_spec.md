# Security Specification for Gemini Workspace Automator

## 1. Data Invariants
- A `Workflow` must belong to a valid `User` UID.
- A `Workflow` status can only transition from `PENDING` to `COMPLETED` or `FAILED`.
- `Intelligence` documents must store a valid `userId` matching the creator's UID.
- Users can only read/write their own documents based on `userId` or document ID (for user profiles).

## 2. The "Dirty Dozen" Payloads (Red Team Tests)
- P1: Create a `Workflow` for another `userId`.
- P2: Update a `Workflow` status to `COMPLETED` twice.
- P3: Inject a 1MB string into a `Workflow` context.
- P4: Modify `createdAt` on an update.
- P5: Read another user's `Intelligence` record.
- P6: Create a `User` profile with a different UID than current auth.
- P7: Update `type` of a workflow after it's been created.
- P8: Delete another user's workflow.
- P9: List all workflows without a `userId` filter.
- P10: Inject script tags into `outputResult` string.
- P11: Create a `Workflow` with an invalid enum status.
- P12: Update someone else's `User` profile using their email.

## 3. Test Runner (Draft)
Verification will be performed via the generated rules logic.

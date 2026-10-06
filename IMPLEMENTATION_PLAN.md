# Web and Mobile HRMS Feature Implementation Plan

## Implementation status (2026-10-06)

The login, punch, attendance filter, pending leave edit and overlap rules, and daily task CRUD/filter/report changes are implemented in the Laravel API, React web app, and Flutter app. Three migrations add task status, leave type, and leave audit history. The shared endpoint contract is in `docs/hrms_feature_api.md`.

Verification completed: PHP syntax checks, Dart analysis with no compile errors, a React production build, PDF byte smoke test, and `git diff --check`. Laravel feature tests were added but could not run in this checkout because PHP dependencies are unavailable offline; run `composer install`, `php artisan migrate`, and `php artisan test --filter=HrmsWorkflowTest` in the target environment before release. Leave and daily task routes now require bearer tokens, so coordinate the API deployment with updated clients; older mobile builds that do not send the token will receive 401 responses.

## Goal

Deliver consistent login, attendance, leave, and daily task workflows on the web and mobile apps. Keep business rules in the Laravel backend so both clients receive the same results and error messages.

## 0. Establish the Current Baseline

1. Identify the Laravel authentication, attendance, and leave routes, controllers, models, policies, migrations, and tests. Identify the web views/components and the mobile app framework, screens, API client, and local storage behavior.
2. Reproduce the reported Punch In and Punch Out failures on both clients. Record the request, response, server exception, relevant attendance row, timezone, and device time for each failure. Confirm whether the current flow supports overnight shifts, breaks, location, or photos before changing its rules.
3. Document current roles and permissions (employee, manager, HR/admin), leave approval states, attendance day boundaries, existing report generation, and the API response format. Use the existing conventions when implementing the items below.
4. Add a small shared API contract document covering field names, validation errors, pagination, date format, timezone, and authorization for all new or changed endpoints.

## 1. Login Enhancements

### Backend

- Validate required credentials, supported username/email format, and input length. Normalize only fields that are already case-insensitive; do not alter passwords.
- Return a consistent field-level validation response and a clear failed-login message. Use the same generic message for an unknown account and a wrong password to avoid revealing which accounts exist.
- Check disabled or inactive accounts and return an actionable account-status message where the current security policy allows it.
- Review rate limiting, session/token expiry, logout, and mobile token storage. Preserve intended redirect/deep-link after successful login.

### Web and mobile

- Add accessible show/hide password control that preserves focus and does not change the field value. Default to hidden; hide it again when the login form is reset or left.
- Show validation beside the affected field and a concise form-level message for authentication or network failures. Keep entered username/email after a failed attempt; avoid logging or displaying passwords.
- Disable duplicate submission while a request is running, show progress, and provide a retry path for network errors. Verify keyboard submission, password-manager/autofill behavior, and mobile keyboard layout.

### Done when

- Empty/invalid input, wrong credentials, inactive account, throttling, and network failure produce understandable states on both clients. Successful login reaches the intended screen and show/hide works with keyboard and screen readers.

## 2. Punch In / Punch Out

### Diagnose and fix

- Resolve the reproduced failures at their actual source (client request, authentication, validation, attendance state, database write, or response handling). Add regression tests for each reproduced case.
- Define the attendance state transitions in the backend: no open session → Punch In → open session → Punch Out → closed session. Reject duplicate Punch In and Punch Out without an open session with specific, recoverable errors.
- Make state changes atomic so rapid taps or retries cannot create duplicate open sessions or multiple Punch Outs. Use a database transaction and suitable locking or uniqueness constraints for the current data model.
- Store and display timestamps using the application's chosen timezone policy; test local day boundaries and overnight shifts according to the existing shift rules.

### Web and mobile

- Show the current state, latest punch time, and the next available action. Prevent repeat taps while submitting, refresh state after success, and reconcile state after a timeout instead of assuming the punch failed.
- Surface server validation and permission errors clearly. Check mobile behavior after app resume and when connectivity drops.

### Done when

- A normal Punch In/Out cycle works on both clients; retries, duplicate taps, stale screens, and the documented shift boundary cases do not corrupt attendance.

## 3. Attendance Log Filters

- Add server-side filters for date range and attendance status; include employee/team filters only for roles authorized to view other employees. Confirm useful statuses from the existing attendance model before implementing the UI.
- Default to a practical period (for example, the current month), validate range order and maximum range, and preserve filter values across pagination. Sort newest first and paginate results.
- Add matching web and mobile filter controls, active-filter display, clear/reset action, loading/empty/error states, and a summary of the displayed period if existing attendance data supports it.
- Apply authorization to filtered queries so users cannot obtain another employee's records by changing request parameters.

### Done when

- Filters combine correctly, pagination retains them, empty results are explained, and employee-scoped access is enforced on the API.

## 4. Leave Management

### Rules and API

- Map existing leave types, balances, date units (full/half day), holidays, approval flow, and cancellation policy before changing behavior.
- Allow the requester to update a **pending** leave request, subject to the existing approval workflow and permissions. Revalidate the entire revised request and recalculate its duration/balance impact. Approved, rejected, and cancelled requests are read-only unless an existing role-specific policy explicitly permits changes.
- Prevent overlapping leave dates for the same employee across active requests, including pending and approved requests. Exclude the request being edited from its own overlap check. Decide how half-day requests interact based on the current leave policy, and enforce the rule atomically to avoid simultaneous duplicate submissions.
- Validate required dates, start ≤ end, type, reason length, available balance where applicable, attachment type/size if supported, past dates/notice period if policy requires them, and conflicts with existing leave/holiday rules. Return field-specific errors.
- Ensure every create/update/cancel/approval operation is authorized and auditable. Keep leave balance changes consistent when pending requests are edited or their approval state changes.

### Web and mobile

- Add Edit to pending requests only; prefill the form and show recalculated duration and any balance effect before saving. Refresh the detail/list state after a successful update.
- Show overlapping dates and other validation errors at the form, preserve user-entered values after an error, and prevent duplicate submission.
- Improve list/detail views with clear status, date range, leave type, reason, approver feedback, and available actions. Keep the approval experience aligned with the current roles.

### Done when

- A pending request can be edited on both clients; a nonpending request cannot. Overlapping active leave is rejected for create and update, including concurrent requests. Balances and approval history remain correct.

## 5. Daily Task Management

### Data and API

- Add a daily task record owned by an employee with task date, title, description, status, optional time spent or notes only if these fit the current product model, and created/updated timestamps. Define whether multiple tasks per day are allowed (default: yes).
- Provide authorized, paginated CRUD endpoints: create, list/detail, update, and delete. Employees manage their own tasks; manager/HR visibility and edit rights follow the existing permission model. Define whether delete is soft delete based on current audit conventions.
- Validate task date, required title, length limits, allowed status, and any optional fields. Apply consistent timezone and date handling.
- Add server-side filters for date range, status, and employee/team where authorized. Keep sorting and pagination stable.

### Web and mobile

- Build task list, detail, create, edit, and delete-confirmation flows with filter controls and clear empty/error states. Show task date and status prominently. Refresh lists after mutations.
- Support both weekly and monthly report requests with explicit period selection. Display the selected period and active filters before download.

### Reports

- Generate CSV and PDF from the **same authorized, filtered backend query** so totals and rows agree. Define week start and timezone from the application's locale/policy and use calendar months for monthly reports.
- Include employee, report period, task date, title, description, status, and any approved optional fields; add generated-at time and totals. Escape CSV values correctly, use UTF-8, and prevent spreadsheet formula execution when files are opened in spreadsheet apps.
- Stream or queue large exports as appropriate for expected volume. Use stable filenames and correct MIME types. On mobile, save/share through platform file handling and report download errors to the user.

### Done when

- Employees can complete CRUD on their own tasks on both clients, filters return the expected records, and weekly/monthly CSV/PDF downloads contain the same permitted data.

## Delivery Sequence

1. Baseline mapping and bug reproduction; agree on current policy ambiguities discovered in code.
2. Backend contracts, validation, authorization, and migrations for all features.
3. Fix Punch In/Out and implement login improvements, then update both clients.
4. Implement leave rules and pending edits, then attendance filters.
5. Implement task CRUD, filters, and report exports; connect both clients.
6. Run cross-platform regression and acceptance checks, then deploy backend before releasing clients that depend on new endpoints.

## Verification and Release Checks

- Backend feature tests: authentication responses and throttling; punch transitions and concurrency; scoped attendance filters; leave overlap/edit permissions and balance effects; task CRUD permissions and filtered exports.
- Web and mobile flow checks for success, validation, unauthorized, empty, offline/network, and repeated-submit states. Verify report downloads on supported browsers and mobile platforms.
- Check database migration rollback and existing-data compatibility. Confirm API changes do not break older mobile releases; use additive fields/endpoints or versioning where needed.
- Review accessibility of form errors, password toggle, filter controls, and action labels. Verify timestamps and weekly/monthly boundaries in the configured timezone.

## Decisions to Confirm During Baseline Review

- Attendance day boundary and overnight-shift policy.
- Whether half-day leaves may coexist on the same date, and which leave states reserve balance.
- Task fields beyond date/title/description/status, manager visibility, and retention/deletion policy.
- Week start day and required PDF layout/branding.

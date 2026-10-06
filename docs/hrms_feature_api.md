# HRMS feature API contract

All dates use `YYYY-MM-DD` in the configured `APP_TIMEZONE` (default `Asia/Kolkata`). New employee data endpoints require `Authorization: Bearer <access_token>` from `POST /api/auth/token`. Validation failures return HTTP 422 with an `errors` object; state conflicts return HTTP 409 with `detail`.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/auth/me` | Current username, employee ID, department ID, and role. |
| `POST /api/attendance/punch` | `{ "action": "in" }` or `{ "action": "out" }`; returns today's attendance row. Duplicate or invalid transitions return 409. |
| `GET /api/attendance/log/filter` | `from`, `to`, `status`, optional authorized `employee_id`, `page`, `per_page`. Returns Laravel pagination data. |
| `POST /api/leave` | Employee ID, department ID, reason, from/to dates, optional leave type and legacy day/hour fields. A new request is always pending. |
| `PUT /api/leave/{id}` | Requester may edit pending details; an authorized approver may change pending status. Overlaps and insufficient balance return 422. |
| `DELETE /api/leave/{id}` | Requester cancels a pending request; record and audit history are retained. |
| `GET /api/daily-tasks` | Optional `from`, `to`, `status`, and authorized `employee_id`. Returns scoped task array. |
| `POST /api/daily-tasks` | Task title, date, description, status, employee ID, and department ID. |
| `PUT /api/daily-tasks/{id}` / `DELETE /api/daily-tasks/{id}` | Task owner updates or deletes a task. |
| `GET /api/daily-tasks/report/download` | Required `period=weekly|monthly`, `date`, `format=csv|pdf`; optional `status` and authorized `employee_id`. Downloads a report from the same scoped task query. |

Leave type values are `Casual Leave`, `Half Day Leave`, `Full Day Leave`, `Earned Leave`, `Medical Leave`, `Other Leave`, and `Unpaid Leave`. Typed requests calculate inclusive full days; a half day must cover one date and consumes 0.5 casual day. Weekly reports start Monday. Existing task and leave response fields remain available to older screens. The new task status defaults to `Pending`; existing task dates are normalized by migration.

Formify is a single-page customizable form builder similar to Google Forms.
It allows users to create dynamic forms, share public links, collect responses, and manage submissions — all integrated into an existing React + Node.js website.

🚀 Features
🔹 Form Builder

Create forms with title & description

Add multiple field types:

Short text

Long text

Email

Number

Dropdown

Radio buttons

Checkboxes

Date

Mark fields as required / optional

Real-time live preview

🔹 Form Sharing

Auto-generated public form URL

Anyone can submit responses (no login required)

Secure form access

🔹 Responses Management

Store responses in PostgreSQL

View all submissions per form

Export responses (CSV – optional)

🔹 User Management

Forms are linked to logged-in users

Users can create, edit, and delete their own forms

🧱 Tech Stack
Frontend

React.js

React Router

Axios

Tailwind CSS / CSS Modules (optional)

Backend

Node.js

Express.js

REST APIs

Database

PostgreSQL

Authentication

Existing auth system (JWT / session-based)

📁 Project Structure
formify/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── FormBuilder.jsx
│   │   │   ├── FormPreview.jsx
│   │   │   └── FormSubmit.jsx
│   │   ├── components/
│   │   │   ├── FieldEditor.jsx
│   │   │   ├── FieldPreview.jsx
│   │   │   └── FormHeader.jsx
│   │   └── services/api.js
│
├── backend/
│   ├── routes/
│   │   ├── form.routes.js
│   │   └── response.routes.js
│   ├── controllers/
│   │   ├── form.controller.js
│   │   └── response.controller.js
│   ├── models/
│   │   ├── form.model.js
│   │   └── response.model.js
│   └── server.js
│
└── README.md

🗄️ Database Schema (PostgreSQL)
forms
Column	Type
id	UUID
user_id	UUID
title	TEXT
description	TEXT
created_at	TIMESTAMP
form_fields
Column	Type
id	UUID
form_id	UUID
label	TEXT
type	TEXT
required	BOOLEAN
options	JSONB
form_responses
Column	Type
id	UUID
form_id	UUID
submitted_at	TIMESTAMP
form_response_values
Column	Type
id	UUID
response_id	UUID
field_id	UUID
value	TEXT
🔌 API Endpoints
Forms

POST /api/forms – Create form

GET /api/forms/:id – Get form

PUT /api/forms/:id – Update form

DELETE /api/forms/:id – Delete form

Responses

POST /api/forms/:id/submit – Submit response

GET /api/forms/:id/responses – Get all responses

🔐 Security

Input validation (backend & frontend)

SQL injection protection

XSS sanitization

Rate limiting on public form submission

🎨 UI / UX

Clean and minimal UI (Google Forms inspired)

Mobile responsive

Real-time form preview

Easy drag-and-drop field management

# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vercel)                        │
│                                                                   │
│  React + TypeScript + Vite                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ src/pages/Contact.tsx                                    │   │
│  │ - Form UI (firstName, lastName, email, subject, message) │   │
│  │ - POST to VITE_BACKEND_URL/api/contact                  │   │
│  │ - Show loading/success/error states                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Environment: VITE_BACKEND_URL=https://...onrender.com          │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
                         (CORS enabled)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Render)                            │
│                                                                   │
│  Node.js + Express                                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ server.js                                                │   │
│  │ - CORS middleware (dynamic origin validation)            │   │
│  │ - Body parser (JSON)                                     │   │
│  │ - Self-ping every 14 min (prevent cold start)            │   │
│  │ - Health check: GET /api/health                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↓                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ routes/contact.js                                        │   │
│  │ - POST /api/contact                                      │   │
│  │ - Validate all fields                                    │   │
│  │ - Call sendEmail() and saveContact() in parallel         │   │
│  │ - Return 200 or 500                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│         ↓                                    ↓                    │
│    (Promise.all)                        (Promise.all)            │
│         ↓                                    ↓                    │
│  ┌──────────────────────┐      ┌──────────────────────────┐     │
│  │ email.service.js     │      │ mongo.service.js         │     │
│  │                      │      │                          │     │
│  │ sendEmail(data)      │      │ saveContact(data)        │     │
│  │ - Validate env vars  │      │ - Connect to MongoDB     │     │
│  │ - Build HTML email   │      │ - Create Contact schema  │     │
│  │ - POST to Brevo API  │      │ - Save document          │     │
│  │ - Return messageId   │      │ - Return saved doc       │     │
│  └──────────────────────┘      └──────────────────────────┘     │
│         ↓                                    ↓                    │
└─────────────────────────────────────────────────────────────────┘
         ↓                                    ↓
    (HTTPS)                              (HTTPS)
         ↓                                    ↓
┌──────────────────────┐      ┌──────────────────────────┐
│   BREVO API          │      │  MONGODB ATLAS           │
│                      │      │                          │
│ POST /v3/smtp/email  │      │ Database: portfolio      │
│ - Headers:           │      │ Collection: contacts     │
│   api-key            │      │                          │
│   Content-Type       │      │ Document:                │
│ - Body:              │      │ {                        │
│   sender             │      │   firstName: string      │
│   to                 │      │   lastName: string       │
│   replyTo            │      │   email: string          │
│   subject            │      │   subject: string        │
│   htmlContent        │      │   message: string        │
│                      │      │   createdAt: timestamp   │
│ Response:            │      │   updatedAt: timestamp   │
│ {messageId: "..."}   │      │ }                        │
└──────────────────────┘      └──────────────────────────┘
         ↓                                    ↓
    Email sent                        Submission saved
    to your inbox                     for record keeping
```

---

## Data Flow

### 1. User Submits Form
```
User fills form → Click "Send Message"
  ↓
Frontend validates (required fields)
  ↓
POST to BACKEND_URL/api/contact
  ↓
Headers: Content-Type: application/json
Body: {firstName, lastName, email, subject, message}
```

### 2. Backend Receives Request
```
Express receives POST /api/contact
  ↓
CORS middleware checks origin
  ↓
Body parser extracts JSON
  ↓
Route handler validates fields
  ↓
Email validation (regex check)
```

### 3. Parallel Processing
```
Promise.all([
  sendEmail(data),      // → Brevo HTTP API
  saveContact(data)     // → MongoDB Atlas
])
  ↓
Both complete or one fails
  ↓
Return 200 or 500
```

### 4. Email Sent
```
sendEmail(data)
  ↓
Build HTML email with form data
  ↓
POST to https://api.brevo.com/v3/smtp/email
  ↓
Headers: api-key, Content-Type
  ↓
Brevo sends email to MY_EMAIL
  ↓
Return messageId
```

### 5. Submission Saved
```
saveContact(data)
  ↓
Create Contact document
  ↓
Save to MongoDB portfolio.contacts
  ↓
MongoDB adds _id, createdAt, updatedAt
  ↓
Return saved document
```

### 6. Frontend Shows Result
```
Response 200
  ↓
Show "✓ Message sent! I'll get back to you soon."
  ↓
Clear form
  ↓
Auto-hide message after 5 seconds

OR

Response 400/500
  ↓
Show "✗ [error message]"
  ↓
Keep form data for retry
```

---

## Security Features

### CORS Protection
```javascript
// ✓ No wildcard origin
// ✓ Dynamic validation
// ✓ Regex for Vercel preview URLs
// ✓ Credentials: true (safe with specific origins)

allowedOrigins = [
  "http://localhost:5173",
  /^https:\/\/.*\.vercel\.app$/
]
```

### Environment Variables
```
// ✓ Never hardcoded
// ✓ Stored in Render (encrypted)
// ✓ .env in .gitignore
// ✓ .env.example for reference

BREVO_API_KEY=xkeysib-...
MONGO_URI=mongodb+srv://...
MY_EMAIL=verified@email.com
```

### Input Validation
```javascript
// ✓ All fields required
// ✓ Email format validation (regex)
// ✓ Trim whitespace
// ✓ MongoDB schema validation
```

### Error Handling
```javascript
// ✓ Try/catch on all async operations
// ✓ Detailed logging (server-side)
// ✓ Generic error messages (client-side)
// ✓ 400 for validation errors
// ✓ 500 for server errors
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                         │
│                                                               │
│  /                                                            │
│  ├── src/                    (Frontend)                       │
│  │   └── pages/Contact.tsx   (Updated)                       │
│  ├── backend/                (New)                            │
│  │   ├── server.js                                            │
│  │   ├── routes/contact.js                                    │
│  │   ├── services/                                            │
│  │   ├── package.json                                         │
│  │   └── .env.example                                         │
│  ├── DEPLOYMENT.md           (New)                            │
│  └── .env.local.example      (New)                            │
└─────────────────────────────────────────────────────────────┘
         ↓                                    ↓
    (Push)                              (Push)
         ↓                                    ↓
┌──────────────────────┐      ┌──────────────────────────┐
│   VERCEL             │      │   RENDER                 │
│                      │      │                          │
│ Frontend Deploy      │      │ Backend Deploy           │
│ - Build React app    │      │ - npm install            │
│ - Set env vars       │      │ - npm start              │
│ - Deploy to CDN      │      │ - Set env vars           │
│ - VITE_BACKEND_URL   │      │ - Listen on PORT         │
│                      │      │ - Self-ping every 14min  │
│ URL:                 │      │                          │
│ https://portfolio... │      │ URL:                     │
│ .vercel.app          │      │ https://portfolio-...    │
│                      │      │ .onrender.com            │
└──────────────────────┘      └──────────────────────────┘
```

---

## Cold Start Prevention

### Problem
Render free tier sleeps after 15 minutes of inactivity.

### Solution
```javascript
// In server.js
setInterval(() => {
  fetch(`${BACKEND_URL}/api/health`)
    .then(res => res.json())
    .then(data => console.log("Self-ping successful"))
    .catch(err => console.log("Self-ping failed"))
}, 14 * 60 * 1000)  // Every 14 minutes
```

### Result
- Server never sleeps
- First request after deploy is fast
- Subsequent requests are instant

---

## Error Handling Flow

```
User submits form
  ↓
Frontend validation
  ├─ Missing field? → Show "All fields required"
  └─ Invalid email? → Show "Invalid email format"
  ↓
Backend validation
  ├─ Missing field? → 400 "All fields required"
  └─ Invalid email? → 400 "Invalid email format"
  ↓
Send email
  ├─ Brevo 401? → 500 "Authentication failed"
  ├─ Brevo timeout? → 500 "Email service unavailable"
  └─ Success? → Continue
  ↓
Save to MongoDB
  ├─ Connection error? → 500 "Database error"
  ├─ Validation error? → 500 "Invalid data"
  └─ Success? → Continue
  ↓
Both succeed? → 200 "Message sent and saved"
One failed? → 500 "Failed to process message"
```

---

## Monitoring & Logs

### Backend Logs (Render Dashboard)
```
✓ Server running on port 5000
✓ MongoDB connected
✓ Self-ping successful
✓ Email sent via Brevo. Message ID: ...
✓ Contact saved to MongoDB. ID: ...
```

### MongoDB Logs (Atlas Dashboard)
```
Collections → portfolio → contacts
[
  {
    _id: ObjectId(...),
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    subject: "Project Inquiry",
    message: "...",
    createdAt: 2024-01-15T10:30:00Z,
    updatedAt: 2024-01-15T10:30:00Z
  }
]
```

### Brevo Logs (Brevo Dashboard)
```
Transactional → Logs
[
  {
    messageId: "...",
    to: "your@email.com",
    from: "your@email.com",
    subject: "New Contact: Project Inquiry",
    status: "sent",
    timestamp: 2024-01-15T10:30:00Z
  }
]
```

### Frontend Logs (Browser Console)
```
Contact form error: Failed to send message
// or
// (no error = success)
```

---

## Performance Metrics

| Operation | Time | Notes |
|-----------|------|-------|
| Form validation | <10ms | Client-side |
| CORS check | <5ms | Server-side |
| Email send | 500-2000ms | Brevo API |
| MongoDB save | 100-500ms | Atlas |
| Total | 600-2500ms | Parallel operations |
| Cold start | 10-30s | First request after sleep |
| Warm start | <100ms | Subsequent requests |

---

## Scalability

### Current Limits
- **Brevo:** 300 emails/day (free tier)
- **MongoDB:** 512MB storage (free tier)
- **Render:** 750 hours/month (free tier)

### Upgrade Path
- **Brevo:** Pay-as-you-go ($20/month for 20k emails)
- **MongoDB:** Shared cluster ($57/month for 10GB)
- **Render:** Pro plan ($7/month for always-on)

---

**Last Updated:** May 2, 2026

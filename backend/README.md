# Portfolio Contact Form Backend

Node.js + Express backend for handling contact form submissions. Sends emails via Brevo HTTP API and saves submissions to MongoDB Atlas.

## Features

✓ **CORS Protection** — Dynamic origin validation (no wildcard `*`)  
✓ **Brevo Email API** — HTTP-based (port 443), not SMTP  
✓ **MongoDB Storage** — All submissions saved to Atlas  
✓ **Cold Start Prevention** — Self-ping every 14 minutes  
✓ **Error Handling** — Comprehensive logging and validation  
✓ **Production Ready** — Deployed on Render free tier  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with:
- `MONGO_URI` — MongoDB Atlas connection string
- `BREVO_API_KEY` — Brevo API key
- `MY_EMAIL` — Your verified Brevo sender email

### 3. Run Locally
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 4. Test Health Check
```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### POST `/api/contact`
Submit a contact form.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Your message has been sent and saved"
}
```

**Response (400):**
```json
{
  "error": "All fields are required: firstName, lastName, email, subject, message"
}
```

**Response (500):**
```json
{
  "error": "Failed to process your message. Please try again later."
}
```

### GET `/api/health`
Health check endpoint (used for self-ping).

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Project Structure

```
backend/
├── server.js                 # Express app, CORS, routes
├── routes/
│   └── contact.js           # POST /api/contact handler
├── services/
│   ├── email.service.js     # Brevo HTTP API integration
│   └── mongo.service.js     # MongoDB connection & schema
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── README.md                # This file
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `BACKEND_URL` | Full backend URL (for self-ping) | `https://portfolio-backend.onrender.com` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `BREVO_API_KEY` | Brevo API key | `xkeysib-...` |
| `MY_EMAIL` | Your verified Brevo sender email | `your@email.com` |
| `NODE_ENV` | Environment | `development` or `production` |

## Bug Fixes Implemented

### Bug 1: CORS with Wildcard
✓ Dynamic origin validation using regex for Vercel URLs  
✓ No `origin: "*"` — credentials require specific origins

### Bug 2: Render Cold Start
✓ Self-ping every 14 minutes to `/api/health`  
✓ Prevents server sleep on free tier

### Bug 3: Git Merge Conflicts
✓ `.gitignore` covers `node_modules`, `.env`, `dist`

### Bug 4: Mixed Middleware & Routes
✓ CORS in `server.js`, routes in `routes/contact.js`  
✓ Services in separate files (`email.service.js`, `mongo.service.js`)

### Bug 5: Vercel Preview URLs
✓ Regex `/^https:\/\/.*\.vercel\.app$/` covers all Vercel URLs

### Bug 6 & 7: SMTP Blocked by Render
✓ Brevo HTTP API (port 443) instead of SMTP (ports 465/587)

### Bug 8: Brevo 401 Unauthorized
✓ IP whitelist disabled in Brevo (safe for dynamic IPs)  
✓ API key validation on startup

### Bug 9: Sender Email Not Verified
✓ Verified email required in Brevo dashboard  
✓ Used in `sender.email` field

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for full deployment guide.

### Quick Deploy to Render
1. Push to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

## Local Testing

### Test Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test"
  }'
```

### Check MongoDB
```bash
# In MongoDB Atlas dashboard
# Databases → Browse Collections → portfolio → contacts
```

### Check Email Logs
```bash
# In Brevo dashboard
# Transactional → Logs
```

## Troubleshooting

**MongoDB Connection Error**
- Verify `MONGO_URI` is correct
- Check Network Access in MongoDB Atlas (allow 0.0.0.0/0)

**Brevo 401 Unauthorized**
- Verify `BREVO_API_KEY` is complete (not truncated)
- Disable IP whitelist in Brevo settings

**CORS Error**
- Check frontend origin matches `allowedOrigins` in `server.js`
- For Vercel, ensure regex `/^https:\/\/.*\.vercel\.app$/` is present

**Email Not Received**
- Verify sender email is verified in Brevo
- Check Brevo logs for delivery status
- Check spam folder

## License

ISC

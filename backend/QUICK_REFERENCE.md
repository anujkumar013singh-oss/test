# Quick Reference

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run development server (with auto-reload)
npm run dev

# Run production server
npm start
```

## Testing

```bash
# Test health check
curl http://localhost:5000/api/health

# Test contact form submission
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "subject": "Test Subject",
    "message": "This is a test message"
  }'

# Expected response (200):
# {"success":true,"message":"Your message has been sent and saved"}
```

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `PORT` | No | `5000` |
| `BACKEND_URL` | Yes (production) | `https://app.onrender.com` |
| `MONGO_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `BREVO_API_KEY` | Yes | `xkeysib-...` |
| `MY_EMAIL` | Yes | `your@email.com` |
| `NODE_ENV` | No | `production` |

## Deployment Checklist

- [ ] `npm install` runs without errors
- [ ] `npm run dev` starts server on port 5000
- [ ] `/api/health` returns `{"status":"alive"}`
- [ ] `/api/contact` accepts POST with all fields
- [ ] MongoDB connection string is valid
- [ ] Brevo API key is valid
- [ ] Sender email is verified in Brevo
- [ ] All env vars set in Render dashboard
- [ ] Frontend `VITE_BACKEND_URL` points to Render app
- [ ] Contact form works end-to-end

## Logs & Debugging

```bash
# View Render logs
# Dashboard → Web Service → Logs

# Check MongoDB connection
# MongoDB Atlas → Databases → Browse Collections

# Check Brevo email logs
# Brevo Dashboard → Transactional → Logs

# Check browser console
# DevTools → Console (for CORS errors)
```

## Common Issues

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | MongoDB not running or `MONGO_URI` wrong |
| `401 Unauthorized` | Invalid `BREVO_API_KEY` or IP blocked |
| `CORS error` | `VITE_BACKEND_URL` not set or wrong |
| `Email not received` | Sender email not verified in Brevo |
| `Cold start delay` | Normal on Render free tier (10-30s first request) |

## File Structure

```
backend/
├── server.js              # Main Express app
├── routes/
│   └── contact.js         # POST /api/contact
├── services/
│   ├── email.service.js   # Brevo integration
│   └── mongo.service.js   # MongoDB integration
├── .env                   # Your credentials (don't commit!)
├── .env.example           # Template (commit this)
├── .gitignore             # Ignore node_modules, .env
├── package.json           # Dependencies
└── README.md              # Full documentation
```

## API Endpoints

### POST /api/contact
Submit contact form

**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
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
  "error": "All fields are required..."
}
```

### GET /api/health
Health check (used for self-ping)

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Useful Links

- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Brevo:** https://www.brevo.com
- **Render:** https://render.com
- **Vercel:** https://vercel.com

## Need Help?

1. Check **DEPLOYMENT.md** for step-by-step guide
2. Check **README.md** for API documentation
3. Check backend logs in Render dashboard
4. Check browser console for CORS errors
5. Verify all environment variables are set

---

**Last Updated:** May 2, 2026

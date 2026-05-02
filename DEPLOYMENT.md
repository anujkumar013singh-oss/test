# Deployment Guide: Portfolio Contact Form Backend

This guide covers deploying the Node.js + Express backend to Render and connecting it to your Vercel frontend.

---

## Prerequisites

- **Render account** (free tier): https://render.com
- **MongoDB Atlas account** (free tier): https://www.mongodb.com/cloud/atlas
- **Brevo account** (free tier): https://www.brevo.com
- **Vercel account** (already have frontend deployed)

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new project (e.g., "Portfolio")
4. Create a new cluster (free tier M0)
5. Wait for cluster to deploy (~5 minutes)

### 1.2 Create Database User
1. In MongoDB Atlas, go to **Database Access**
2. Click **Add New Database User**
3. Create username and password (save these!)
4. Set permissions to **Atlas Admin**
5. Click **Add User**

### 1.3 Allow Network Access
1. Go to **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ This is safe for free tier; for production, whitelist specific IPs
4. Click **Confirm**

### 1.4 Get Connection String
1. Go to **Databases** → Click **Connect**
2. Select **Drivers** → **Node.js**
3. Copy the connection string
4. Replace `<username>` and `<password>` with your database user credentials
5. Replace `<database>` with `portfolio` (or your preferred name)

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/portfolio?retryWrites=true&w=majority
```

---

## Step 2: Set Up Brevo (Email Service)

### 2.1 Create Brevo Account
1. Go to https://www.brevo.com
2. Sign up (free tier includes 300 emails/day)
3. Verify your email

### 2.2 Get API Key
1. Go to **Settings** → **API Keys**
2. Click **Create a new API key**
3. Name it "Portfolio Backend"
4. Copy the API key (starts with `xkeysib-`)
5. Save it securely

### 2.3 Verify Sender Email
1. Go to **Senders & IP** → **Senders**
2. Click **Add a sender**
3. Enter your email address
4. Verify the email (check your inbox for verification link)
5. Once verified, this is your `MY_EMAIL` for the backend

### 2.4 Disable IP Whitelist (Optional but Recommended)
1. Go to **Settings** → **Security**
2. Find **IP Whitelist**
3. Disable it (Render uses dynamic IPs, so whitelisting is difficult)
   - If you want to whitelist, add Render's IP range (check Render docs)

---

## Step 3: Deploy Backend to Render

### 3.1 Prepare Backend for Deployment
1. Ensure `backend/package.json` has correct scripts:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

2. Ensure `backend/.env.example` exists (for reference)

3. Create `backend/.gitignore` (already done):
   ```
   node_modules/
   .env
   .env.local
   ```

### 3.2 Push Backend to GitHub
```bash
cd backend
git add .
git commit -m "Add contact form backend"
git push origin main
```

### 3.3 Deploy to Render
1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Select the repository
5. Fill in deployment settings:
   - **Name:** `portfolio-backend` (or your choice)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend` (if backend is in a subdirectory)

### 3.4 Add Environment Variables
In Render dashboard, go to **Environment** and add:

```
PORT=5000
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/portfolio?retryWrites=true&w=majority
BREVO_API_KEY=xkeysib-your_api_key_here
MY_EMAIL=your-verified-email@example.com
BACKEND_URL=https://portfolio-backend.onrender.com
NODE_ENV=production
```

**Important:**
- Replace `MONGO_URI` with your actual MongoDB connection string
- Replace `BREVO_API_KEY` with your actual Brevo API key
- Replace `MY_EMAIL` with your verified Brevo sender email
- Replace `BACKEND_URL` with your actual Render app URL (shown after deployment)

### 3.5 Deploy
1. Click **Create Web Service**
2. Wait for deployment (~2-3 minutes)
3. Once deployed, you'll see a URL like: `https://portfolio-backend.onrender.com`
4. Copy this URL — you'll need it for the frontend

### 3.6 Test Backend Health
```bash
curl https://portfolio-backend.onrender.com/api/health
```

Expected response:
```json
{"status":"alive","timestamp":"2024-01-15T10:30:00.000Z"}
```

---

## Step 4: Update Frontend (Vercel)

### 4.1 Add Environment Variable
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `VITE_BACKEND_URL`
   - **Value:** `https://portfolio-backend.onrender.com` (your Render URL)
   - **Environments:** Production, Preview, Development

### 4.2 Redeploy Frontend
1. Push a small change to trigger redeploy, or
2. Go to **Deployments** → Click **Redeploy** on the latest deployment

### 4.3 Test Contact Form
1. Go to your portfolio website
2. Fill out the contact form
3. Submit
4. Check:
   - ✓ Success message appears
   - ✓ Email received in your inbox (from Brevo)
   - ✓ Submission saved in MongoDB Atlas

---

## Step 5: Verify Everything Works

### 5.1 Check Backend Logs
1. In Render dashboard, click your web service
2. Go to **Logs**
3. Look for:
   - `✓ Server running on port 5000`
   - `✓ MongoDB connected`
   - `✓ Self-ping successful` (every 14 minutes)

### 5.2 Check MongoDB
1. Go to MongoDB Atlas
2. Click **Databases** → **Browse Collections**
3. Look for `portfolio` database → `contacts` collection
4. Verify submissions appear here

### 5.3 Check Brevo
1. Go to Brevo dashboard
2. Click **Transactional** → **Logs**
3. Verify emails are being sent

---

## Troubleshooting

### Issue: 401 Unauthorized from Brevo
**Cause:** Invalid API key or IP whitelist blocking Render
**Fix:**
1. Verify `BREVO_API_KEY` is correct (full key, not truncated)
2. In Brevo → **Settings** → **Security** → Disable IP Whitelist
3. Verify sender email is verified in Brevo

### Issue: MongoDB Connection Timeout
**Cause:** Network access not allowed
**Fix:**
1. Go to MongoDB Atlas → **Network Access**
2. Ensure `0.0.0.0/0` is added
3. Verify `MONGO_URI` is correct

### Issue: CORS Error in Browser Console
**Cause:** Frontend origin not in allowed list
**Fix:**
1. Check `backend/server.js` → `allowedOrigins`
2. Ensure your Vercel URL matches the regex: `/^https:\/\/.*\.vercel\.app$/`
3. For local testing, ensure `http://localhost:5173` is in the list

### Issue: Render App Sleeping (Cold Start)
**Cause:** Free tier sleeps after 15 minutes of inactivity
**Fix:**
- Backend has self-ping every 14 minutes (already implemented)
- First request after sleep may take 10-30 seconds
- This is normal for free tier

### Issue: Email Not Received
**Cause:** Sender email not verified in Brevo
**Fix:**
1. Go to Brevo → **Senders & IP** → **Senders**
2. Verify the email used in `MY_EMAIL` is verified
3. Check spam folder

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and user added
- [ ] Network access allowed (0.0.0.0/0 or specific IPs)
- [ ] Brevo account created and API key generated
- [ ] Sender email verified in Brevo
- [ ] Backend deployed to Render
- [ ] All environment variables set in Render
- [ ] Frontend environment variable `VITE_BACKEND_URL` set in Vercel
- [ ] Contact form tested end-to-end
- [ ] Email received in inbox
- [ ] Submission saved in MongoDB
- [ ] Backend logs show no errors

---

## Local Development

### Run Backend Locally
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB and Brevo credentials
npm run dev
```

### Run Frontend Locally
```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with VITE_BACKEND_URL=http://localhost:5000
npm run dev
```

### Test Contact Form Locally
1. Frontend: http://localhost:5173
2. Backend: http://localhost:5000
3. Fill form and submit
4. Check backend logs and MongoDB

---

## Security Notes

- ✓ Never commit `.env` files (use `.env.example` instead)
- ✓ API keys are stored in Render environment variables (encrypted)
- ✓ MongoDB connection string includes credentials (keep secure)
- ✓ CORS is configured to only allow your Vercel domain
- ✓ Email validation prevents spam submissions
- ✓ All errors are logged server-side for debugging

---

## Support

For issues:
1. Check backend logs in Render dashboard
2. Check browser console for CORS errors
3. Verify all environment variables are set correctly
4. Test `/api/health` endpoint to confirm backend is running
5. Check MongoDB Atlas for connection issues
6. Check Brevo logs for email delivery issues

---

**Last Updated:** May 2, 2026

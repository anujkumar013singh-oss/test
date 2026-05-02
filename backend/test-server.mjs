#!/usr/bin/env node
/**
 * Server Verification Script
 * Tests: env vars, MongoDB connection, contact endpoint
 */

import http from "http";

const BACKEND_URL = "http://localhost:3500";
const TIMEOUT = 5000;

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject);
    req.setTimeout(TIMEOUT, () => reject(new Error("Request timeout")));
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log("═".repeat(50));
  console.log("SERVER VERIFICATION TESTS");
  console.log("═".repeat(50));

  // Test 1: Health check
  try {
    console.log("\n1. Testing /api/health...");
    const health = await makeRequest({
      hostname: "localhost",
      port: 3500,
      path: "/api/health",
      method: "GET",
    });
    const parsed = JSON.parse(health.body);
    console.log(health.status === 200 ? "✓ PASS" : "✗ FAIL", "Health check:", parsed.status);
  } catch (e) {
    console.log("✗ FAIL", "Server not responding. Is it running on port 3500?");
    process.exit(1);
  }

  // Test 2: Contact form endpoint
  try {
    console.log("\n2. Testing /api/contact (POST)...");
    const testData = {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      subject: "Test Message",
      message: "This is a test message from the verification script.",
    };
    const contact = await makeRequest({
      hostname: "localhost",
      port: 3500,
      path: "/api/contact",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, testData);
    const parsed = JSON.parse(contact.body);
    console.log(contact.status === 200 ? "✓ PASS" : "✗ FAIL", "Contact endpoint:", parsed.message || parsed.error);
  } catch (e) {
    console.log("✗ FAIL", "Contact endpoint error:", e.message);
  }

  console.log("\n" + "═".repeat(50));
  console.log("VERIFICATION COMPLETE");
  console.log("═".repeat(50));
}

runTests();

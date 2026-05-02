import axios from "axios";

// ═══════════════════════════════════════════════════
// BUG 6, 7, 8, 9 FIX: Use Brevo HTTP API (port 443)
// NOT SMTP (ports 465/587 blocked by Render)
// ═══════════════════════════════════════════════════

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const MY_EMAIL = process.env.MY_EMAIL;

/**
 * Send email via Brevo HTTP API
 * @param {Object} data - Contact form data
 * @param {string} data.firstName - Sender's first name
 * @param {string} data.lastName - Sender's last name
 * @param {string} data.email - Sender's email
 * @param {string} data.subject - Email subject
 * @param {string} data.message - Email message body
 * @returns {Promise<Object>} Brevo API response
 */
export async function sendEmail(data) {
  try {
    // Validate environment variables
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
    }
    if (!MY_EMAIL) {
      throw new Error("MY_EMAIL is not set in environment variables");
    }

    // Build HTML email body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p><strong>From:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <h3 style="color: #333;">Message:</h3>
        <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Submitted at: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    // Prepare Brevo API payload
    const payload = {
      sender: {
        name: "Portfolio Contact Form",
        email: MY_EMAIL, // BUG 9 FIX: Must be verified in Brevo dashboard
      },
      to: [
        {
          email: MY_EMAIL,
          name: "Portfolio Owner",
        },
      ],
      replyTo: {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
      },
      subject: `New Contact: ${data.subject}`,
      htmlContent: htmlBody,
    };

    // Call Brevo HTTP API
    const response = await axios.post(BREVO_API_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10 second timeout
    });

    console.log(`✓ Email sent via Brevo. Message ID: ${response.data.messageId}`);
    return response.data;
  } catch (error) {
    // Log detailed error for debugging
    if (error.response) {
      console.error(
        `Brevo API error (${error.response.status}):`,
        error.response.data
      );
      // BUG 8 FIX: Check for 401 Unauthorized (IP whitelist or invalid key)
      if (error.response.status === 401) {
        throw new Error(
          "Brevo authentication failed. Check API key and IP whitelist."
        );
      }
    } else if (error.request) {
      console.error("No response from Brevo API:", error.message);
    } else {
      console.error("Error setting up Brevo request:", error.message);
    }
    throw error;
  }
}

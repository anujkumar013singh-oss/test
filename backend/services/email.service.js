import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const MY_EMAIL = process.env.MY_EMAIL;

export async function sendEmail(data) {
  try {
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not set in environment variables");
    }
    if (!MY_EMAIL) {
      throw new Error("MY_EMAIL is not set in environment variables");
    }

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: #1a73e8; padding: 28px 32px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Contact Form Submission</h1>
          <p style="color: #c8e0ff; margin: 6px 0 0; font-size: 14px;">Portfolio Website</p>
        </div>

        <!-- Table -->
        <div style="padding: 24px 32px; background: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 14px 0; color: #888888; width: 30%;">Name</td>
              <td style="padding: 14px 0; color: #1a1a1a; font-weight: 500;">${data.firstName} ${data.lastName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 14px 0; color: #888888;">Email</td>
              <td style="padding: 14px 0;"><a href="mailto:${data.email}" style="color: #1a73e8; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 14px 0; color: #888888;">Subject</td>
              <td style="padding: 14px 0; color: #1a1a1a;">${data.subject}</td>
            </tr>
            <tr>
              <td style="padding: 14px 0; color: #888888; vertical-align: top;">Message</td>
              <td style="padding: 14px 0; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">${data.message}</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="background: #f5f5f5; padding: 16px 32px; text-align: center;">
          <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
            Submitted on ${new Date().toLocaleString()}
          </p>
        </div>

      </div>
    `;

    const payload = {
      sender: {
        name: "Portfolio Contact Form",
        email: MY_EMAIL,
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

    const response = await axios.post(BREVO_API_URL, payload, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log(`✓ Email sent via Brevo. Message ID: ${response.data.messageId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Brevo API error (${error.response.status}):`, error.response.data);
      if (error.response.status === 401) {
        throw new Error("Brevo authentication failed. Check API key and IP whitelist.");
      }
    } else if (error.request) {
      console.error("No response from Brevo API:", error.message);
    } else {
      console.error("Error setting up Brevo request:", error.message);
    }
    throw error;
  }
}
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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'Inter',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:48px 48px 40px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#666666;">Portfolio — Contact</p>
              <h1 style="margin:0;font-size:42px;font-weight:900;line-height:1;color:#ffffff;letter-spacing:-0.03em;">New<br/>Message.</h1>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background:#ffffff;padding:0 48px;">
              <div style="height:1px;background:#e8e8e8;"></div>
            </td>
          </tr>

          <!-- From row -->
          <tr>
            <td style="background:#ffffff;padding:32px 48px 0;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#999999;">From</p>
              <p style="margin:0;font-size:24px;font-weight:700;color:#000000;letter-spacing:-0.02em;">${data.firstName} ${data.lastName}</p>
            </td>
          </tr>

          <!-- Email row -->
          <tr>
            <td style="background:#ffffff;padding:24px 48px 0;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#999999;">Email</p>
              <a href="mailto:${data.email}" style="font-size:16px;font-weight:500;color:#000000;text-decoration:none;border-bottom:1px solid #000000;">${data.email}</a>
            </td>
          </tr>

          <!-- Subject row -->
          <tr>
            <td style="background:#ffffff;padding:24px 48px 0;">
              <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#999999;">Subject</p>
              <p style="margin:0;font-size:20px;font-weight:600;color:#000000;letter-spacing:-0.01em;">${data.subject}</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="background:#ffffff;padding:32px 48px 0;">
              <div style="height:1px;background:#e8e8e8;"></div>
            </td>
          </tr>

          <!-- Message row -->
          <tr>
            <td style="background:#ffffff;padding:32px 48px 48px;">
              <p style="margin:0 0 16px;font-size:10px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#999999;">Message</p>
              <p style="margin:0;font-size:17px;font-weight:400;line-height:1.75;color:#1a1a1a;white-space:pre-wrap;">${data.message}</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#000000;padding:24px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:500;color:#666666;letter-spacing:0.05em;">ANUJ SINGH — PORTFOLIO</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;font-weight:400;color:#444444;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `;

    const payload = {
      sender: {
        name: "Portfolio Contact Form",
        email: MY_EMAIL,
      },
      to: [{ email: MY_EMAIL, name: "Anuj Singh" }],
      replyTo: {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
      },
      subject: `New Message — ${data.subject}`,
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
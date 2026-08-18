import { Resend } from 'resend';

// Only initialize if the key exists so it doesn't crash builds
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendWelcomeEmail({ toEmail, studentName, courseTitle, courseId, amountPaid }) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Email not sent.");
    return { success: false, error: 'API key missing' };
  }

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
      
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #C8A86B;">
        <h1 style="color: #1a1a1a; margin: 0; font-size: 24px; letter-spacing: -0.5px;">PARA<span style="color: #C8A86B;">STRUCTURE</span></h1>
      </div>

      <div style="padding: 30px 0; color: #333333; line-height: 1.6; font-size: 16px;">
        <p>Hi ${studentName},</p>
        
        <p>Welcome to <strong>${courseTitle}</strong>! We are thrilled to have you join the cohort.</p>
        
        <p>Your payment of <strong>₹${amountPaid}</strong> has been successfully processed, and your dashboard is now fully unlocked.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 25px 0; text-align: center;">
          <h3 style="margin-top: 0; color: #1a1a1a;">Next Steps</h3>
          <p style="margin-bottom: 20px; font-size: 15px;">Click the button below to log in to your learning portal and view your curriculum schedule.</p>
          <a href="https://parastructure.in/dashboard/learn/${courseId}" style="background-color: #C8A86B; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Go To Dashboard</a>
        </div>

        <p>If you have any questions or need technical support, just reply directly to this email.</p>
        
        <p>See you in class,<br>
        <strong>The ParaStructure Team</strong></p>
      </div>
      
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #888888; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ParaStructure Pvt. Ltd.<br>
        New Delhi, India</p>
      </div>
    </div>
  `;

  try {
    const data = await resend.emails.send({
      from: 'ParaStructure Admissions <admissions@parastructure.in>',
      to: [toEmail],
      subject: `Welcome to ${courseTitle}! 🚀`,
      html: htmlContent,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
}

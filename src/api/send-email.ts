import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
  },
  debug: true, // Enable debug logging
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send messages');
  }
});

export async function POST(request: Request) {
  try {
    const { to, subject, text } = await request.json();
    
    console.log('Attempting to send email to:', to);
    console.log('Email subject:', subject);
    console.log('Email content:', text);

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to.join(', '),
      subject,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New F1 Visa Appointment Tracking Request</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${text.split('\n').map(line => `<p>${line}</p>`).join('')}
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully:', info.messageId);

    return new Response(JSON.stringify({ 
      success: true,
      messageId: info.messageId 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Detailed email sending error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 
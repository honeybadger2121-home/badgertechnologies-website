// Cloudflare Worker for Badger Technologies
// Handles contact form submissions and other dynamic functionality

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Handle contact form submission
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return await handleContactForm(request, env);
    }

    // Handle assessment form submission
    if (url.pathname === '/api/assessment' && request.method === 'POST') {
      return await handleAssessmentForm(request, env);
    }

    // Return 404 for unknown API routes
    if (url.pathname.startsWith('/api/')) {
      return new Response('Not Found', { status: 404 });
    }

    // Pass through all other requests
    return fetch(request);
  },
};

async function handleContactForm(request, env) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const contactInfo = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      message: formData.get('message'),
      timestamp: new Date().toISOString(),
    };

    // Validate required fields
    if (!contactInfo.name || !contactInfo.email || !contactInfo.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send email notification (using Cloudflare Email Workers or external service)
    await sendEmailNotification(contactInfo, env);

    // Store in KV if configured
    if (env.FORM_SUBMISSIONS) {
      const submissionId = crypto.randomUUID();
      await env.FORM_SUBMISSIONS.put(`contact-${submissionId}`, JSON.stringify(contactInfo));
    }

    return new Response(JSON.stringify({ success: true, message: 'Thank you for your message!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function handleAssessmentForm(request, env) {
  try {
    const formData = await request.formData();
    
    // Extract assessment form fields
    const assessmentInfo = {
      name: formData.get('name'),
      email: formData.get('email'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      employees: formData.get('employees'),
      services: formData.get('services'),
      current_issues: formData.get('current_issues'),
      budget: formData.get('budget'),
      timeline: formData.get('timeline'),
      timestamp: new Date().toISOString(),
    };

    // Send email notification
    await sendAssessmentNotification(assessmentInfo, env);

    // Store in KV if configured
    if (env.FORM_SUBMISSIONS) {
      const submissionId = crypto.randomUUID();
      await env.FORM_SUBMISSIONS.put(`assessment-${submissionId}`, JSON.stringify(assessmentInfo));
    }

    return new Response(JSON.stringify({ success: true, message: 'Assessment request submitted!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Assessment form error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function sendEmailNotification(contactInfo, env) {
  // You can integrate with services like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Cloudflare Email Workers
  
  // Example with a webhook or email service
  const emailBody = `
New Contact Form Submission

Name: ${contactInfo.name}
Email: ${contactInfo.email}
Phone: ${contactInfo.phone || 'Not provided'}
Company: ${contactInfo.company || 'Not provided'}
Message: ${contactInfo.message}

Submitted: ${contactInfo.timestamp}
  `;

  // Log for now (implement actual email sending based on your service)
  console.log('Contact form submission:', emailBody);
  
  // You would implement actual email sending here
  // For example, using fetch to call an email API
}

async function sendAssessmentNotification(assessmentInfo, env) {
  const emailBody = `
New Assessment Request

Name: ${assessmentInfo.name}
Email: ${assessmentInfo.email}
Company: ${assessmentInfo.company}
Phone: ${assessmentInfo.phone}
Employees: ${assessmentInfo.employees}
Services Interested: ${assessmentInfo.services}
Current Issues: ${assessmentInfo.current_issues}
Budget: ${assessmentInfo.budget}
Timeline: ${assessmentInfo.timeline}

Submitted: ${assessmentInfo.timestamp}
  `;

  console.log('Assessment request:', emailBody);
}
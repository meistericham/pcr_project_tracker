import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, content, from, projectId } = await req.json()

    // Validate required fields
    if (!to || !Array.isArray(to) || to.length === 0) {
      throw new Error('Recipients are required')
    }
    if (!subject) {
      throw new Error('Subject is required')
    }
    if (!content) {
      throw new Error('Content is required')
    }

    // Email configuration
    const client = new SmtpClient()

    // Configure SMTP settings
    // You can use services like Gmail, SendGrid, or your own SMTP server
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      username: Deno.env.get('SMTP_USERNAME') || '',
      password: Deno.env.get('SMTP_PASSWORD') || '',
    })

    // Send email to each recipient
    const results = []
    for (const recipient of to) {
      try {
        await client.send({
          from: Deno.env.get('SMTP_FROM') || from || 'noreply@yourcompany.com',
          to: recipient,
          subject: subject,
          content: content,
          html: content.replace(/\n/g, '<br>'), // Convert newlines to HTML
        })
        results.push({ recipient, status: 'success' })
      } catch (error) {
        console.error(`Failed to send email to ${recipient}:`, error)
        results.push({ recipient, status: 'failed', error: error.message })
      }
    }

    await client.close()

    // Log the email attempt
    console.log(`Email sent to ${to.length} recipients:`, results)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent to ${results.filter(r => r.status === 'success').length} recipients`,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Email function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { WelcomeEmail } from './_templates/welcome-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    
    console.log('Received webhook payload for email sending')
    
    // If hook secret is configured, verify the webhook
    if (hookSecret) {
      const wh = new Webhook(hookSecret)
      wh.verify(payload, headers)
    }
    
    const webhookData = JSON.parse(payload)
    
    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type },
    } = webhookData as {
      user: {
        email: string
      }
      email_data: {
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    console.log(`Sending welcome email to: ${user.email}`)

    const html = await renderAsync(
      React.createElement(WelcomeEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? '',
        token_hash,
        redirect_to,
        email_action_type,
        user_email: user.email,
      })
    )

    const { data, error } = await resend.emails.send({
      from: 'Goal Tracker <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Welcome to Goal Tracker - Verify your account',
      html,
    })
    
    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error('Error in send-welcome-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})
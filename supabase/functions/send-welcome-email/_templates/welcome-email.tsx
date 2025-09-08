import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const WelcomeEmail = ({
  token_hash,
  supabase_url,
  email_action_type,
  redirect_to,
  user_email,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Goal Tracker - Verify your account</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Text style={logo}>🎯 Goal Tracker</Text>
        </Section>
        
        <Heading style={h1}>Welcome to Goal Tracker!</Heading>
        
        <Text style={text}>
          Hi there! We're excited to have you join our community of goal achievers.
        </Text>
        
        <Text style={text}>
          Goal Tracker helps you set, track, and achieve your personal and professional goals 
          with powerful insights and streak tracking to keep you motivated.
        </Text>
        
        <Section style={buttonSection}>
          <Button
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            style={button}
          >
            Verify Account & Get Started
          </Button>
        </Section>
        
        <Text style={text}>
          Once verified, you'll be able to:
        </Text>
        
        <Section style={featureList}>
          <Text style={feature}>✨ Set up your personal goal pillars</Text>
          <Text style={feature}>📊 Track your daily progress</Text>
          <Text style={feature}>🔥 Build achievement streaks</Text>
          <Text style={feature}>📈 Get insights on your journey</Text>
        </Section>
        
        <Text style={smallText}>
          If the button doesn't work, copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>
          {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
        </Text>
        
        <Text style={footer}>
          If you didn't sign up for Goal Tracker, you can safely ignore this email.
        </Text>
        
        <Text style={footer}>
          Happy goal tracking! 🚀<br/>
          The Goal Tracker Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const logoSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#1a1a1a',
}

const logo = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  lineHeight: '1.3',
}

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
}

const buttonSection = {
  padding: '32px 40px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
}

const featureList = {
  padding: '0 40px',
  margin: '24px 0',
}

const feature = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 0',
}

const smallText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '32px 0 16px',
  padding: '0 40px',
}

const linkText = {
  color: '#007ee6',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 32px',
  padding: '0 40px',
  wordBreak: 'break-all' as const,
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0',
  padding: '0 40px',
}
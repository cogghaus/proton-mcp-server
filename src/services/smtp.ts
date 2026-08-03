/**
 * SMTP client wrapper for Proton Mail Bridge
 */

import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PORT, PROTON_USER, PROTON_PASS, isLoopbackHost } from '../constants.js';

interface MailOptions {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  inReplyTo?: string;
  references?: string;
}

/**
 * Create and return a nodemailer transporter
 */
export function getTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: PROTON_USER,
      pass: PROTON_PASS,
    },
    tls: {
      // Off only for Bridge on loopback, which uses a self-signed certificate.
      // Verify for any other host — see isLoopbackHost.
      rejectUnauthorized: !isLoopbackHost(SMTP_HOST),
    },
  });
}

/**
 * Send an email via SMTP
 */
export async function sendMail(options: MailOptions): Promise<string> {
  const transporter = getTransporter();

  const mailOptions = {
    from: options.from || PROTON_USER,
    to: options.to,
    cc: options.cc,
    bcc: options.bcc,
    subject: options.subject,
    text: options.text,
    html: options.html,
    headers: {} as Record<string, string>,
  };

  // Set threading headers if provided
  if (options.inReplyTo) {
    mailOptions.headers['In-Reply-To'] = options.inReplyTo;
  }
  if (options.references) {
    mailOptions.headers['References'] = options.references;
  }

  const result = await transporter.sendMail(mailOptions);
  return result.messageId || 'success';
}

// A sendReply() helper used to live here. It was never referenced — the reply
// tool builds its own recipient list and calls sendMail directly — and it
// addressed the reply to `PROTON_USER`, i.e. back to the sending account rather
// than to whoever sent the original message. Anything wired up to it would have
// silently mailed the user their own replies, so it is removed rather than left
// as a trap.

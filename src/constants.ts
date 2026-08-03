/**
 * Constants for Proton Mail Bridge integration
 */

export const IMAP_HOST = process.env.PROTON_IMAP_HOST || '127.0.0.1';
export const IMAP_PORT = parseInt(process.env.PROTON_IMAP_PORT || '1143', 10);
export const SMTP_HOST = process.env.PROTON_SMTP_HOST || '127.0.0.1';
export const SMTP_PORT = parseInt(process.env.PROTON_SMTP_PORT || '1025', 10);
export const PROTON_USER = process.env.PROTON_USER || '';
export const PROTON_PASS = process.env.PROTON_PASS || '';

export const CHARACTER_LIMIT = 25000;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/**
 * True when a host is a loopback address.
 *
 * Proton Bridge terminates TLS with a self-signed certificate, so certificate
 * verification has to be off to talk to it. That is safe over loopback, where
 * there is nothing to intercept. The hosts are environment-configurable
 * though, so disabling verification unconditionally meant that pointing
 * PROTON_IMAP_HOST or PROTON_SMTP_HOST at a remote machine silently accepted
 * any certificate, including an attacker's — while carrying the account
 * password in the same connection.
 */
export function isLoopbackHost(host: string): boolean {
  const h = host.trim().toLowerCase().replace(/^\[|\]$/g, '');
  return h === 'localhost' || h === '::1' || h === '0.0.0.0' || /^127\./.test(h);
}

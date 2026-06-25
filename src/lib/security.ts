import { createAdminClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

/**
 * Normalizes phone numbers to a standard Nigerian format where possible.
 * Removes non-digits. Converts leading 0 to 234 prefix.
 */
export function normalizePhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 11) {
    return '234' + digits.substring(1);
  }
  if (digits.length === 10 && (digits.startsWith('8') || digits.startsWith('7') || digits.startsWith('9'))) {
    return '234' + digits;
  }
  return digits;
}

interface LogContext {
  userId: string;
  eventType: 'signup' | 'login' | 'payment' | 'prediction' | 'withdrawal';
  deviceFingerprint?: string;
  timezone?: string;
  metadata?: Record<string, any>;
}

/**
 * Inserts a record into security_logs and updates profile context details
 */
export async function logSecurityEvent({
  userId,
  eventType,
  deviceFingerprint,
  timezone,
  metadata
}: LogContext) {
  try {
    const adminClient = await createAdminClient();
    const reqHeaders = await headers();
    const userAgent = reqHeaders.get('user-agent') || '';
    
    // Get IP address from headers
    let ipAddress = reqHeaders.get('x-forwarded-for') || reqHeaders.get('x-real-ip') || '127.0.0.1';
    if (ipAddress.includes(',')) {
      ipAddress = ipAddress.split(',')[0].trim();
    }

    // Insert security log
    const { error: logError } = await adminClient.from('security_logs').insert({
      user_id: userId,
      event_type: eventType,
      ip_address: ipAddress,
      user_agent: userAgent,
      timezone: timezone || 'UTC',
      device_fingerprint: deviceFingerprint || 'unknown',
      device_metadata: metadata || {}
    });

    if (logError) {
      console.error('Failed to write security log:', logError);
    }

    // Update profiles with last IP and fingerprint
    const updates: Record<string, any> = {};
    if (ipAddress) updates.last_ip_address = ipAddress;
    if (deviceFingerprint) updates.last_device_fingerprint = deviceFingerprint;

    if (Object.keys(updates).length > 0) {
      await adminClient.from('profiles').update(updates).eq('id', userId);
    }

    // Trigger asynchronous risk score update
    await adminClient.rpc('calculate_risk_score', { p_user_id: userId });
  } catch (err) {
    console.error('Error logging security event:', err);
  }
}

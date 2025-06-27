import crypto from 'crypto';

export function generateOtp(length = 6) {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .substring(0, length);
}

export function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function isOtpExpired(expireTime) {
  return Date.now() > expireTime;
}

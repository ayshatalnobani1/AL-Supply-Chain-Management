const jwt = require('jsonwebtoken');
require('../config/environment');

const cookieName = 'al_session';
const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' };
const legacyCookieOptions = { ...cookieOptions, path: '/auth' };
const lifetimeSeconds = 15 * 60;

function signSession(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, { algorithm: 'HS256', subject: String(userId), expiresIn: lifetimeSeconds });
}

function verifySession(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  if (!payload || typeof payload !== 'object' || typeof payload.sub !== 'string' || !/^[1-9]\d*$/.test(payload.sub) || !Number.isSafeInteger(Number(payload.sub)) || typeof payload.exp !== 'number') throw new Error('Invalid session');
  return payload.sub;
}

module.exports = { cookieName, cookieOptions, legacyCookieOptions, lifetimeSeconds, signSession, verifySession };

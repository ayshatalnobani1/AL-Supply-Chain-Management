const bcrypt = require('bcrypt');
const { timingSafeEqual } = require('crypto');

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

async function verifyPassword(candidatePassword, storedPassword) {
  if (typeof candidatePassword !== 'string' || typeof storedPassword !== 'string') {
    return false;
  }

  // Any value that presents itself as bcrypt must be a valid bcrypt hash;
  // malformed bcrypt-like values must never fall back to plain-text comparison.
  if (storedPassword.startsWith('$2')) {
    if (!BCRYPT_HASH_PATTERN.test(storedPassword)) {
      return false;
    }

    try {
      return await bcrypt.compare(candidatePassword, storedPassword);
    } catch {
      return false;
    }
  }

  const candidateBuffer = Buffer.from(candidatePassword, 'utf8');
  const storedBuffer = Buffer.from(storedPassword, 'utf8');
  return candidateBuffer.length === storedBuffer.length && timingSafeEqual(candidateBuffer, storedBuffer);
}

async function findMatchingAccounts(accounts, candidatePassword) {
  const matchingAccounts = [];
  for (const account of accounts) {
    if (await verifyPassword(candidatePassword, account.storedPassword)) {
      matchingAccounts.push(account);
    }
  }
  return matchingAccounts;
}

module.exports = { verifyPassword, findMatchingAccounts };

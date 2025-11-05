# PassVault

Client-Side Encrypted Password Manager with Zero-Knowledge Architecture

---

## Overview

PassVault is a client-side encrypted password manager where passwords are encrypted in the browser before transmission. The server never has access to plaintext credentials or the master password.

### Key Features

- **Client-Side Encryption**: AES-256-GCM encryption via Web Crypto API
- **Master Password**: PBKDF2 key derivation with 200,000 iterations
- **MongoDB Storage**: Only encrypted data (ciphertext, salt, IV) stored
- **Zero-Knowledge**: Server cannot decrypt passwords

### Technology Stack

**Frontend**: React, React Hook Form, React Toastify, Tailwind CSS  
**Backend**: Node.js, Express, MongoDB, CORS

---

## Architecture

**Client Layer**: React UI, encryption/decryption logic, state management, auto-save  
**API Layer**: Express REST API, CORS middleware, MongoDB connection  
**Data Layer**: MongoDB with documents collection (UUID-based IDs)

---

## Workflow

### Saving a Password

1. User enters website, username, password, and master password
2. Generate random 16-byte salt and 12-byte IV
3. Derive AES-256-GCM key from master password using PBKDF2 (200k iterations)
4. Encrypt password with derived key and IV
5. Convert encrypted data, salt, and IV to Base64
6. Store in state (ciphertext only, no plaintext)
7. Auto-save to server after 500ms debounce
8. Server deletes all records and inserts new array

### Decrypting Passwords

1. User enters master password and clicks "Decrypt"
2. For each record, extract salt, IV, and ciphertext
3. Derive same AES key using master password and stored salt
4. Decrypt with derived key and IV
5. Display plaintext in UI (not saved to database)

### Zero-Knowledge Principle

Master password never leaves the browser. Server only stores encrypted data. Even with database access, attackers cannot decrypt without the master password.

---

## Security Analysis

### Strengths
- AES-256-GCM authenticated encryption
- PBKDF2 with 200,000 iterations (resistant to brute-force)
- Unique salt and IV per entry (prevents rainbow tables)
- Client-side encryption (server never sees plaintext)
- No localStorage for sensitive data

### Critical Vulnerabilities
- **No HTTPS**: Vulnerable to man-in-the-middle attacks
- **No Authentication**: API endpoints publicly accessible
- **Wide-Open CORS**: Any origin can access the API
- **No Rate Limiting**: Susceptible to brute-force attacks
- **Destructive Save Pattern**: deleteMany() before insertMany() risks data loss
- **No Account System**: Single shared database, no user isolation
- **XSS Vulnerability**: No input sanitization

### Before Production
- Implement HTTPS/TLS
- Add user authentication (JWT/OAuth)
- Restrict CORS to trusted origins
- Add rate limiting
- Use upsert pattern instead of delete-then-insert
- Implement input validation and sanitization

---

## Limitations

**Functional**: No password updates, recovery, search, export/import, or sharing  
**Technical**: Single database, no backups, audit logging, or session management  
**Security**: No 2FA, biometric auth, password generator, or breach monitoring  
**UX**: Must re-enter master password after refresh, no copy button, limited mobile support

---

## Recommended Next Steps

1. **Critical**: HTTPS, authentication, CORS policy
2. **High Priority**: Rate limiting, input validation, upsert pattern
3. **Enhancement**: Update functionality, password generator, improved UX
4. **Advanced**: Multi-user support, 2FA, audit logging
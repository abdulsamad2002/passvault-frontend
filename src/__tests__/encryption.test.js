// Save as: src/__tests__/encryption.test.js
import { describe, it, expect } from 'vitest';

// Copy these functions from your Manager.js
function toBase64(value) {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  return btoa(String.fromCharCode(...bytes));
}

function base64ToArrayBuffer(b64) {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function encryptPassword(plaintext, masterPassword) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(masterPassword),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 200000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  
  return {
    ciphertext: toBase64(encrypted),
    salt: toBase64(salt),
    iv: toBase64(iv)
  };
}

async function decryptPassword(
  masterPassword,
  saltB64,
  ivB64,
  ciphertextB64
) {
  const salt = new Uint8Array(base64ToArrayBuffer(saltB64));
  const iv = new Uint8Array(base64ToArrayBuffer(ivB64));
  const ciphertext = base64ToArrayBuffer(ciphertextB64);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(masterPassword),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 200000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const plainBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plainBuffer);
}

describe('Password Encryption', () => {
  it('should encrypt and decrypt a simple password', async () => {
    const originalPassword = 'MySecretPass123';
    const masterPassword = 'MasterKey456';
    
    // Encrypt
    const encrypted = await encryptPassword(originalPassword, masterPassword);
    
    // Verify encrypted data exists
    expect(encrypted.ciphertext).toBeDefined();
    expect(encrypted.salt).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    
    // Decrypt
    const decrypted = await decryptPassword(
      masterPassword,
      encrypted.salt,
      encrypted.iv,
      encrypted.ciphertext
    );
    
    // Verify match
    expect(decrypted).toBe(originalPassword);
  });

  it('should fail with wrong master password', async () => {
    const originalPassword = 'MySecretPass123';
    const correctMaster = 'MasterKey456';
    const wrongMaster = 'WrongKey789';
    
    const encrypted = await encryptPassword(originalPassword, correctMaster);
    
    // Should throw error with wrong password
    await expect(
      decryptPassword(
        wrongMaster,
        encrypted.salt,
        encrypted.iv,
        encrypted.ciphertext
      )
    ).rejects.toThrow();
  });

  it('should handle special characters', async () => {
    const specialPassword = 'P@ss!#$%^&*()_+{}[]|:;<>?,./~`';
    const masterPassword = 'Master123';
    
    const encrypted = await encryptPassword(specialPassword, masterPassword);
    const decrypted = await decryptPassword(
      masterPassword,
      encrypted.salt,
      encrypted.iv,
      encrypted.ciphertext
    );
    
    expect(decrypted).toBe(specialPassword);
  });

  it('should handle empty password', async () => {
    const emptyPassword = '';
    const masterPassword = 'Master123';
    
    const encrypted = await encryptPassword(emptyPassword, masterPassword);
    const decrypted = await decryptPassword(
      masterPassword,
      encrypted.salt,
      encrypted.iv,
      encrypted.ciphertext
    );
    
    expect(decrypted).toBe(emptyPassword);
  });

  it('should handle very long passwords', async () => {
    const longPassword = 'a'.repeat(1000);
    const masterPassword = 'Master123';
    
    const encrypted = await encryptPassword(longPassword, masterPassword);
    const decrypted = await decryptPassword(
      masterPassword,
      encrypted.salt,
      encrypted.iv,
      encrypted.ciphertext
    );
    
    expect(decrypted).toBe(longPassword);
  });
});
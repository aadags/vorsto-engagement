import crypto from 'crypto';

export class AESCrypto {
  private algorithm: string;
  private key: Buffer;
  private iv: Buffer;

  constructor(secretKey: string) {
    this.algorithm = 'aes-256-cbc';

    // Create a key and initialization vector (IV)
    this.key = crypto.createHash('sha256').update(secretKey).digest();
    this.iv = crypto.randomBytes(16); // Initialization vector must be 16 bytes for AES-256-CBC
  }

  // Encrypt the text
  encrypt(text: string): { encryptedData: string; iv: string } {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      encryptedData: encrypted,
      iv: this.iv.toString('hex'),
    };
  }

  // Decrypt the text
  decrypt(encryptedData: string, iv: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
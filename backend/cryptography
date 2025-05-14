import crypto from 'crypto';

const key = process.env.SECRET_KEY || 'your-secret-key-32-bytes-long'; // Ensure the key is 32 bytes for AES-256
const algorithm = 'aes-256-cbc';
const ivLength = 16; 


const encrypt = (text) => {
    const iv = crypto.randomBytes(ivLength); // Generate a random IV
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`; // Combine IV and encrypted data
};


const decrypt = (text) => {
    const [iv, encryptedData] = text.split(':'); // Split IV and encrypted data
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
};

export { encrypt, decrypt };
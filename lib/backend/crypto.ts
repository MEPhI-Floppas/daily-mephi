import crypto from "crypto";
import argon2 from "argon2";


export async function encrypt(plaintext: string): Promise<string> {
    if (process.env.AES_NONCE === undefined
        || process.env.AES_KEY256 === undefined)
        throw new Error('There is no some environment variables');
    const key256: Buffer = Buffer.from(process.env.AES_KEY256, 'base64url');
    const nonce: Buffer = Buffer.from(process.env.AES_NONCE, 'base64url');
    const cipher = crypto.createCipheriv(
        "aes-256-ccm",
        key256,
        nonce,
        {
            authTagLength: 16
        });

    const ciphertext: string = cipher.update(plaintext, 'utf8').toString('base64');
    cipher.final();
    const authTag: string = cipher.getAuthTag().toString('base64');
    return ciphertext + authTag;
}

export async function decrypt(ciphertext: string): Promise<string> {
    if (process.env.AES_NONCE === undefined
        || process.env.AES_KEY256 === undefined)
        throw new Error('There is no some environment variables');
    const key256: Buffer = Buffer.from(process.env.AES_KEY256, 'base64url');
    const nonce: Buffer = Buffer.from(process.env.AES_NONCE, 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-ccm',
        key256,
        nonce,
        {
            authTagLength: 16
        });
    const authTag: Buffer = Buffer.from(ciphertext.split('=')[1] + '=', 'base64');
    decipher.setAuthTag(authTag);
    const realCiphertext: Buffer = Buffer.from(ciphertext.split('=')[0] + '=', 'base64')
    const res: string = decipher.update(realCiphertext).toString('utf8');
    try {
        decipher.final();
    } catch (err) {
        throw new Error('Decryption failed');
    }
    return res;

}

export async function hash(pass: string, secret: string | undefined = undefined): Promise<string> {
    if (process.env.HASH_SECRET === undefined
        || process.env.HASH_SALT === undefined
        || process.env.HASH_MEMORY_COST === undefined
        || process.env.HASH_TYPE === undefined
        || process.env.HASH_TIME_COST === undefined
        || process.env.HASH_PARALLELISM === undefined)
        throw new Error('There is no some environment variables');
    let hash_type: 0 | 1 | 2 | undefined;
    if (process.env.HASH_TYPE === '0')
        hash_type = argon2.argon2d;
    else if (process.env.HASH_TYPE === '1')
        hash_type = argon2.argon2i;
    else
        hash_type = argon2.argon2id;
    const pepper: string = secret ?? process.env.HASH_SECRET;
    return (await argon2.hash(pass, {
        memoryCost: +process.env.HASH_MEMORY_COST,
        parallelism: +process.env.HASH_PARALLELISM,
        type: hash_type,
        timeCost: +process.env.HASH_TIME_COST,
        secret: Buffer.from(pepper, 'utf8'),
        salt: Buffer.from(process.env.HASH_SALT, 'utf8'),
        raw: true
    })).toString('base64');
}


// Now transmit { ciphertext, nonce, tag }.
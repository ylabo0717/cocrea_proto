import crypto from 'crypto';

// パスワードハッシュ化の設定
const HASH_CONFIG = {
  iterations: 1000,    // イテレーション回数を1000に戻す
  keyLength: 64,       // キー長を64バイトに戻す
  digest: 'sha512'     // ダイジェストアルゴリズム
} as const;

export async function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      HASH_CONFIG.iterations,
      HASH_CONFIG.keyLength,
      HASH_CONFIG.digest,
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      }
    );
  });
}

// テスト用にパラメータを公開
export const getHashConfig = () => ({ ...HASH_CONFIG });
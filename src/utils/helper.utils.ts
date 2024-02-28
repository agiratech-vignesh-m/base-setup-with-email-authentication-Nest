import * as dotEnv from 'dotenv';
dotEnv.config();
import * as bcrypt from 'bcrypt';

export const crypto_algorithm = 'aes-256-cbc';

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateOtpTemplate = (otp: string) => {
  const html = `<p><span style='font-weight:bold;'>Hi,</span><br> Your one time password for <span style='font-weight:bold;'>Email verification</span> is<br><span style='font-weight:bold;font-size: 20px;'>${otp}</span><br>It will expire in 5 mins. Do not share with any one!</p>`;
  return html;
};

export const generateEmailVerificationLinkTemplate = (link: string) => {
  const html = `<p>
  <span style='font-weight:bold;'>Hi,</span><br> 
  Click the link to verify your email address <br>
  <a href='${link}' style='font-weight:bold;font-size: 20px;'>${link}</a><br>
  It will expire in 5 mins. Do not share with any one!</p>`;
  return html;
};

export const emailVerificationResponse = () => {
  const html = `
    <div style="text-align: center; padding: 20px;">
      <h2>Email verified successfully!</h2>
      <h2>You can login to access the service</h2>
    </div>
  `;
  return html;
};

export const encryptPassword = async (password: string) => {
  try {
    const hash = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUND),
    );
    console.log('Hash', hash);
    return hash;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const comparePassword = async (password: string, hash: string) => {
  try {
    const validate = await bcrypt.compare(password, hash);
    console.log("validate", validate)
    return validate;
  } catch (error) {
    throw new Error(error.message);
  }
};

// import { createCipheriv, createDecipheriv, scrypt} from "crypto";
// import { promisify } from "util";
// import { crypto_algorithm } from "./constants.utils";

// const iv = Buffer.from(process.env.CRYPTO_IV, "hex");
// const secret = process.env.CRYPTO_SECRET;

// export const encryptChiper = async (text): Promise<string> => {
//   const key = (await promisify(scrypt)(secret, "salt", 32)) as Buffer;
//   const cipher = createCipheriv(crypto_algorithm, key, iv);
//   let encryptedData = cipher.update(text, "utf-8", "hex");
//   encryptedData += cipher.final("hex");
//   return encryptedData;
// };

// export const decryptChiper = async (text) => {
//   const key = (await promisify(scrypt)(secret, "salt", 32)) as Buffer;
//   const decipher = createDecipheriv(crypto_algorithm, key, iv);
//   let decryptedData = decipher.update(text, "hex", "utf-8");
//   decryptedData += decipher.final("utf8");
//   return decryptedData;
// };

import { JSEncrypt } from 'jsencrypt';

export async function encryptWithPublicKey(data: any): Promise<string | false> {
  const response = await fetch(`${process.env.PUBLIC_URL || ''}/public.pem`);
  const publicKey = await response.text();


  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  
  return encryptor.encrypt(JSON.stringify(data));
}
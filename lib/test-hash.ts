import { hashPassword, getHashConfig } from './crypto-utils';

async function runTest() {
  const testPassword = 'CocreaTest2024!';
  const testSalt = 'cocrea_secure_salt_2024';
  const expectedHash = '8f9b5a6d4e2c1f8a7b3d9c4e6f2a1b5d8c7e9f3a2b4d6e8c0f2a4b6d8e0c2f4a6b8d0e2c4f6a8b0d2e4c6f8a0b2d4e6c8f0a2b4d6e8c0f2a4b6d8e0c2f4a6b8';

  console.log('Running password hash test...');
  console.log('Test parameters:');
  console.log('Password:', testPassword);
  console.log('Salt:', testSalt);
  console.log('Hash config:', getHashConfig());
  
  const generatedHash = await hashPassword(testPassword, testSalt);
  
  console.log('\nResults:');
  console.log('Generated hash:', generatedHash);
  console.log('Expected hash: ', expectedHash);
  console.log('Hash match?:', generatedHash === expectedHash);
}

runTest().catch(console.error);
export { default as ApiService } from './api';
export { default as blindSignatureClient } from './blindSignatureClient';

// Optional: Create combined service exports
export const services = {
  api: ApiService,
  blindSignature: blindSignatureClient
};
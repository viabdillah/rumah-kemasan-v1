import { createRemoteJWKSet, jwtVerify } from 'jose'

// Kunci publik Google untuk memeriksa token login Firebase.
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'))

// Melempar galat kalau token palsu, kedaluwarsa, atau milik proyek lain.
export async function verifikasiToken(token, projectId) {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    algorithms: ['RS256'],
  })
  if (!payload.sub) throw new Error('Token tanpa uid')
  return { uid: payload.sub, email: payload.email ?? '' }
}

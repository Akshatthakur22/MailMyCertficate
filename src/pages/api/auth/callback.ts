// This API route proxies the OAuth callback to your backend
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = `http://127.0.0.1:8000/auth/callback${req.url?.replace('/api/auth/callback', '') || ''}`;

  // Forward the request to the backend
  const method = req.method || 'GET';

  // Convert headers to a plain object of string values only
  const headers: Record<string, string> = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (key.toLowerCase() !== 'host' && typeof value === 'string') {
      headers[key] = value;
    }
  });

  const backendRes = await fetch(backendUrl, {
    method,
    headers,
    body: method === 'GET' ? undefined : req.body,
    redirect: 'manual',
  });

  // Copy backend response headers and status
  res.status(backendRes.status);
  backendRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const data = await backendRes.arrayBuffer();
  res.send(Buffer.from(data));
}

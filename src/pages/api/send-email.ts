import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendUrl = 'http://127.0.0.1:8000/send-email';

  try {
    const response = await axios({
      method: req.method,
      url: backendUrl,
      headers: {
        ...req.headers,
        host: undefined,
      },
      data: req,
      responseType: 'arraybuffer',
    });

    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value as string);
    });
    res.send(Buffer.from(response.data));
  } catch (error: any) {
    res.status(error.response?.status || 500).send(error.response?.data || 'Proxy error');
  }
}

import { API_URL } from './config';
import { add, strip } from './store';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function api(method: Method, path: string, body?: object): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(`${API_URL}/${path}`, {
      method, signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(add(body)) : undefined,   // field có tiền tố BIT247016_
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return strip(await r.json());
  } finally { clearTimeout(timer); }
}

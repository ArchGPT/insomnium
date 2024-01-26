import type { RequestHeader } from '../../models/request';

export function getBasicAuthHeader(
  username?: string | null,
  password?: string | null,
  encoding: BufferEncoding = 'utf8',
) {
  const name = 'Authorization';
  const header = `${username ?? ''}:${password ?? ''}`;
  const authString = Buffer.from(header, encoding).toString('base64');
  const value = `Basic ${authString}`;
  const requestHeader: RequestHeader = {
    name,
    value,
  };
  return requestHeader;
}

import { api } from '@/lib/utils';
import { useCookies } from 'react-cookie';
import useSWR from 'swr';

async function getAuthenticators(authKey?: string): Promise<Authenticator[]> {
  if (!authKey) return [];
  try {
    const response = await api.get<{ data: Authenticator[] }>(
      '/authenticators',
      {
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      },
    );
    const { data } = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function useAuthenticators() {
  const [cookies] = useCookies(['authKey']);
  const result = useSWR(`authenticator:${cookies.authKey}:list`, () =>
    getAuthenticators(cookies.authKey),
  );
  return {
    ...result,
    data: result.data ?? [],
  };
}

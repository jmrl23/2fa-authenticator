import { authenticatorListSchema } from '@/schemas/authenticator';
import qs from 'qs';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { z } from 'zod';

export default function useAuthenticators(
  payload: z.infer<typeof authenticatorListSchema> = {},
) {
  const [cookies] = useCookies(['authKey']);
  const swrResult = useSWR(
    `authenticator:list:${JSON.stringify(payload)}`,
    async function fetcher() {
      const query = qs.stringify(payload);
      const response = await fetch(`/api/authenticator/list?${query}`, {
        headers: {
          authorization: `Bearer ${cookies.authKey}`,
        },
      });
      const data: { authenticators: Authenticator[] } | ResponseErrorType =
        await response.json();
      if ('error' in data) {
        toast.error(data.message);
        return [];
      }
      return data.authenticators;
    },
  );
  return swrResult;
}

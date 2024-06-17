import { caching, memoryStore } from 'cache-manager';
import type { Cache, MemoryStore } from 'cache-manager';
import ms from 'ms';

const cache = new Promise<ReturnType>(async function (resolve, reject) {
  try {
    const authenticatorCache = await caching(
      memoryStore({
        ttl: ms('30s'),
      }),
    );

    resolve({
      authenticatorCache,
    });
  } catch (error) {
    reject(error);
  }
});

interface ReturnType {
  authenticatorCache: Cache<MemoryStore>;
}

export default cache;

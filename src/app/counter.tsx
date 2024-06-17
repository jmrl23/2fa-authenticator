'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <Button onClick={() => setCount((count) => count + 1)}>
      Count: {count}
    </Button>
  );
}

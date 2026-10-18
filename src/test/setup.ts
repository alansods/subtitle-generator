import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// O jsdom não implementa scrollTo, e o router o chama ao navegar.
vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);

afterEach(() => {
  cleanup();
});

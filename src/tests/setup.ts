import '@testing-library/jest-dom';
import { afterAll, beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterAll(() => {
  vi.restoreAllMocks();
});

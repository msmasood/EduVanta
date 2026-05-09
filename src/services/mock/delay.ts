/**
 * Mock delay utilities for simulating async service calls.
 * Pass ms=0 in tests to skip delay.
 */

export function mockDelay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withMockDelay<T>(data: T, ms = 250): Promise<T> {
  await mockDelay(ms);
  return data;
}

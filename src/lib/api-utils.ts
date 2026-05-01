/**
 * @fileOverview Utility functions for API calls, including retry logic and error handling.
 */

/**
 * Wraps a promise-returning function with retry logic and exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
}

/**
 * Standardized error for API failures.
 */
export class ApiError extends Error {
  constructor(public message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

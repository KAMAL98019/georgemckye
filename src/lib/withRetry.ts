// Shared hosting's MySQL connection cap is low, so a query can transiently
// fail to grab a connection under load. One quick retry rides out that blip
// instead of the caller falling straight back to an empty/default result.
export async function withRetry<T>(fn: () => Promise<T>, attempts = 2, delayMs = 300): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

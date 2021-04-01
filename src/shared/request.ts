export async function request<T>(
  url: RequestInfo,
  init?: RequestInit
): Promise<T | never> {
  try {
    const response = await fetch(url, init);
    if (!response.ok)
      throw new Error(
        `[${response.status}] ${response.statusText} (${response.url})`
      );
    return response.json();
  } catch (error) {
    throw error;
  }
}

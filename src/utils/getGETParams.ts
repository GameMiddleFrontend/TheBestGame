const getGETParams = (urlString: string, paramName: string): string | null => {
  const url = new URL(urlString);
  if (url.searchParams.has(paramName)) {
    return url.searchParams.get(paramName);
  }
  return null;
};

export default getGETParams;

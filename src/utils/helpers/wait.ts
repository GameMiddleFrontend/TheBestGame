const syncWait = (ms: number) => {
  const end = Date.now() + ms;
  while (Date.now() < end) continue;
};

export default syncWait;

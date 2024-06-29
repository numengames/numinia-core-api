export default (walletAddress: string | null): string => {
  if (walletAddress) {
    const start = walletAddress.substring(0, 2);
    const end = walletAddress.substring(walletAddress.length - 4);
    return `${start}....${end}`;
  }

  return '';
};

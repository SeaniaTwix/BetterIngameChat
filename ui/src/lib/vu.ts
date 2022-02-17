export const isVU = () => {
  try {
    return navigator.userAgent.includes('VeniceUnleashed');
  } catch {
    return false;
  }
};
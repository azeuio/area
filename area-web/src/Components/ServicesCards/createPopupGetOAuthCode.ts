const createPopupGetOAuthCode = async (
  url: string,
): Promise<{ code: string }> => {
  const height = window.innerHeight * 0.75;
  const width = height / 1.5;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;
  const popup = window.open(
    url,
    'popup',
    `width=${width},height=${height},left=${left},top=${top},resizable=no`,
  );
  if (!popup) {
    return { code: '' };
  }
  return new Promise((resolve, reject) => {
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      const code = event.data;
      popup.close();
      if (!code) {
        return reject({ reason: 'No code' });
      }
      resolve({ code });
    });
  });
};

export default createPopupGetOAuthCode;

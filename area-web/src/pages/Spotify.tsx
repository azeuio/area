import React from 'react';

function Spotify() {
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    if (error) {
      return;
    }
    if (code) {
      window.opener.postMessage(code, window.location.origin);
      return;
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <h1 className="text-5xl font-SpaceGrotesk">
          You will be redirected to your board view in a few seconds.
        </h1>
      </div>
    </>
  );
}

export default Spotify;

import React from 'react';
import Modal from './Modal';
import Spinner from './Spinner';

function Loading() {
  return (
    <Modal isOpen={true}>
      <p className="text-2xl font-SpaceGrotesk font-bold">Loading...</p>
      <Spinner />
    </Modal>
  );
}

export default Loading;

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md text-center font-SpaceGrotes text-2xl w-2/5 h-2/7 flex flex-col items-center justify-center space-y-6">
        {children}
        <button onClick={onClose} className=" p-2 bg-blue-500 text-white rounded-md">
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

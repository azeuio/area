import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose?: () => void;
  children: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onConfirm, onClose, children }) => {
    if (!isOpen) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div className="bg-white p-8 rounded-md text-center font-SpaceGrotes text-2xl w-2/5 h-2/7 flex flex-col items-center justify-center space-y-6">
            {children}
            <div className="flex space-x-5">
                <button
                    onClick={onClose}
                    className=" p-2 bg-[#EA4335] text-white rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className=" p-2 bg-[#34A853] text-white rounded-md"
                >
                    Confirm
                </button>
            </div>
        </div>
      </div>
    );
  };

export default ConfirmationModal;

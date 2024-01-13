import React from 'react';
import { AreaOption } from '../types';

interface ServiceModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  options?: Record<string, AreaOption>;
  optionRenderer?: (option: AreaOption, key: string) => React.ReactNode;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  children,
  className,
  title,
  description,
  options,
  optionRenderer,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div
        className={`bg-white py-8 rounded-md text-center font-SpaceGrotes text-2xl flex flex-col items-center justify-center space-y-6 ${className}`}
      >
        <Header title={title} description={description} />
        {options && (
          <div className="w-full flex flex-col items-center justify-center gap-3">
            <div className="separator w-[25%] h-[2px] bg-[#aaaa]" />
            <h2 className="text-3xl font-SpaceGrotesk font-bold w-[75vw]">
              options
            </h2>
          </div>
        )}
        {Object.entries(options ?? {}).map(([key, option]) => {
          return (
            <div
              key={key}
              className="flex flex-col items-center justify-center w-full"
            >
              {optionRenderer?.(option, key)}
            </div>
          );
        })}
        {children}
        <Footer onCancel={onCancel} onConfirm={onConfirm} />
      </div>
    </div>
  );
};

interface HeaderProps {
  title: string;
  description?: string;
}
const Header = (props: HeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-max overflow-x-clip overflow-y-auto">
      <h2 className="text-4xl font-SpaceGrotesk font-bold">{props.title}</h2>
      <textarea
        className={
          'font-SpaceGrotesk text-center w-full resize-none line-clamp-1 text-gray-700'
        }
      >
        {props.description}
      </textarea>
    </div>
  );
};

interface FooterProps {
  onCancel: () => void;
  onConfirm: () => void;
}
const Footer = (props: FooterProps) => {
  return (
    <div className="space-x-5">
      <button
        onClick={props.onCancel}
        className=" p-2 bg-red-500 text-white rounded-md"
      >
        Cancel
      </button>
      <button
        onClick={props.onConfirm}
        className=" p-2 bg-green-500 text-white rounded-md"
      >
        Confirm
      </button>
    </div>
  );
};

export default ServiceModal;

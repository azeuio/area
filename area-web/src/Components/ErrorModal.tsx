import React from 'react';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

type ErrorProps =
  | (
      | {
          error: Error;
        }
      | {
          error: string;
          message: string;
        }
    ) & {
      redirect?: string;
      isOpen?: boolean;
      onClose?: () => void;
    };
function ErrorModal(props: ErrorProps) {
  const navigate = useNavigate();
  React.useEffect(() => {
    console.error(props.error);
  }, [props.error]);
  return (
    <Modal
      isOpen={props.isOpen ?? true}
      onClose={() => {
        props.onClose?.();
        if (props.redirect) {
          navigate(props.redirect);
        }
      }}
    >
      <p className="text-2xl font-SpaceGrotesk font-bold text-red-500">
        {props.error instanceof Error ? 'Error' : props.error}
      </p>
      <p className="text-2xl font-SpaceGrotesk font-bold text-red-500">
        {props.error instanceof Error ? props.error.message : props.error}
      </p>
    </Modal>
  );
}

export default ErrorModal;

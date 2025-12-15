import type { ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  mostrar: boolean;
  aoFechar: () => void;
  titulo: string;
  children: ReactNode;
}

function Modal({ mostrar, aoFechar, titulo, children }: ModalProps) {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay" onClick={aoFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{titulo}</h2>
        {children}
      </div>
    </div>
  );
}

export default Modal;

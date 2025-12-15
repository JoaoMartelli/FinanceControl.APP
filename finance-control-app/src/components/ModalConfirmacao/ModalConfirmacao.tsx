import Modal from '../Modal/Modal';

interface ModalConfirmacaoProps {
  mostrar: boolean;
  aoFechar: () => void;
  aoConfirmar: () => void;
  titulo: string;
  mensagem: string;
  textoBotaoConfirmar?: string;
  tipoBotaoConfirmar?: 'primary' | 'danger' | 'success';
}

function ModalConfirmacao({ 
  mostrar, 
  aoFechar, 
  aoConfirmar, 
  titulo, 
  mensagem,
  textoBotaoConfirmar = 'Confirmar',
  tipoBotaoConfirmar = 'danger'
}: ModalConfirmacaoProps) {
  return (
    <Modal mostrar={mostrar} aoFechar={aoFechar} titulo={titulo}>
      <p>{mensagem}</p>
      <div className="modal-actions">
        <button className="btn btn-secondary" onClick={aoFechar}>
          Cancelar
        </button>
        <button className={`btn btn-${tipoBotaoConfirmar}`} onClick={aoConfirmar}>
          {textoBotaoConfirmar}
        </button>
      </div>
    </Modal>
  );
}

export default ModalConfirmacao;

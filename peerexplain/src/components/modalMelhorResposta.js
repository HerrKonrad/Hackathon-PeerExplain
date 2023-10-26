import { Button, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const ModalMelhorResposta = ({ show, onHide, objeto }) => {

  return (
<Modal show={show} onHide={onHide} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Melhor resposta para a minha pergunta</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {objeto.melhorResposta ? (
      <>
        <div>
          {objeto.melhorResposta.length === 1
            ? "Resposta:"
            : "Melhor Resposta:"}
        </div>
        {objeto.melhorResposta.map((resposta, index) => (
          <div key={index}>
            {index === 0 ? (
              `${resposta.autorResposta}: ${resposta.resposta}`
            ) : (
              `Respostas: ${resposta.autorResposta}: ${resposta.resposta}`
            )}
          </div>
        ))}
      </>
    ) : (
      <div>Ainda não tem nenhuma resposta.</div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onHide}>
      Cancelar <Icon.XLg />
    </Button>
  </Modal.Footer>
</Modal>

  );
};

export default ModalMelhorResposta;
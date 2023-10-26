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
            Autor:{objeto.autorResposta} <br />
           Melhor Resposta:{objeto.melhorResposta}
          </>
        ) : (
          <div>Ainda nao tem nenhuma resposta ainda</div>
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
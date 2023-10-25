import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const ModalPergunta = ({ show, onHide, click }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Mis preguntas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Escriba su pregunta</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={click}>
          Sim <Icon.CheckLg />
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Não <Icon.XLg />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPergunta;

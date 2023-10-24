import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const ModalLogin = ({ show, onHide, click }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="nome" className="mb-3" />
            <Form.Select aria-label="Calificación académica">
              <option>Calificación académica</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </Form.Select>
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

export default ModalLogin;

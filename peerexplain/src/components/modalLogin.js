import { useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const ModalLogin = ({ show, onHide, click }) => {
  const nome = useRef("");
  const idade = useRef("");
  const area = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nomeValue = nome.current.value;
    const idadeValue = idade.current.value;
    const areaValue = area.current.value;

    const user = {
      nome: nomeValue,
      idade: idadeValue,
      area: areaValue,
    };

    const userJSON = JSON.stringify(user);

    localStorage.setItem("Utilizador", userJSON);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header>
        <Modal.Title>Registrar</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                className="mb-3"
                ref={nome}
                required
              />
              <Form.Label>Idade</Form.Label>
              <Form.Control
                type="number"
                name="idade"
                className="mb-3"
                ref={idade}
                required
              />
              <Form.Label>Área de Estudo</Form.Label>
              <Form.Control
                type="text"
                name="areaDeEstudo"
                className="mb-3"
                ref={area}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Registrar <Icon.CheckLg />
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalLogin;

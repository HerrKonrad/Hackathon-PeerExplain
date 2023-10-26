import { useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const ModalLogin = ({ show, onHide, click }) => {
  const nome = useRef("");
  const dataNasc = useRef("");
  const area = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nomeValue = nome.current.value;
    const dataNascValue = dataNasc.current.value;
    const areaValue = area.current.value;


    const user = {
      nome: nomeValue,
      data: dataNascValue,
      area: areaValue,
    };

    const userJSON = JSON.stringify(user);

    localStorage.setItem("Utilizador", userJSON);

    onHide();
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
              <Form.Label>Data de nascimento</Form.Label>
              <Form.Control
                type="date"
                name="dataNasc"
                className="mb-3"
                ref={dataNasc}
                required
              />
              <Form.Select aria-label="Área de Estudo" ref={area} required>
                <option>Área de Estudo</option>
                <option value="Biología">Biología</option>
                <option value="Química">Química</option>
                <option value="Física">Física</option>
                <option value="Matemáticas">Matemáticas</option>
                <option value="Ciencias Sociales">Ciencias Sociales</option>
                <option value="Informática">Informática</option>
                <option value="Artes">Artes</option>
                <option value="Medicina">Medicina</option>
                <option value="Ingeniería">Ingeniería</option>
                <option value="Ciencias Ambientales">Ciencias Ambientales</option>
              </Form.Select>
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

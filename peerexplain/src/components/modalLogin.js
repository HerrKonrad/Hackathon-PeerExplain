import { useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const ModalLogin = ({ show, onHide, click }) => {
  const nome = useRef("");
  const dataNasc = useRef("");
  const area = useRef("");
  const nivelQualificacao = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const nomeValue = nome.current.value;
    const dataNascValue = dataNasc.current.value;
    const areaValue = area.current.value;
    const nivelQualificacaoValue = nivelQualificacao.current.value;


    const user = {
      nome: nomeValue,
      data: dataNascValue,
      area: areaValue,
      nivelQualificacao: nivelQualificacaoValue,
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
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                className="mb-3"
                ref={nome}
                required
              />
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="dataNasc"
                className="mb-3"
                ref={dataNasc}
                required
              />
              <Form.Select className="mb-3" aria-label="Área de Estudo" ref={area} required>
                <option>Área de Estudio</option>
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
              <Form.Select aria-label="Nivel de Calificación" ref={nivelQualificacao} required>
    <option>Nivel de Calificación</option>
    <option value="Educación Primaria">Educación Primaria</option>
    <option value="Educación Secundaria">Educación Secundaria</option>
    <option value="Licenciatura">Licenciatura</option>
    <option value="Maestría">Maestría</option>
    <option value="Doctorado">Doctorado</option>
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

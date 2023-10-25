import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useState } from 'react';  // Importe o useState para gerenciar o estado do textarea

const ModalPergunta = ({ show, onHide, click, sendQuestion }) => {
  const [pergunta, setPergunta] = useState('');  // Estado para armazenar o valor do textarea

  const handleSendQuestion = () => {
    // Verifica se a pergunta não está vazia antes de chamar a função sendQuestion
    if (pergunta.trim() !== '') {
      sendQuestion(pergunta);
      onHide();  // Fecha o modal após enviar a pergunta
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Mis preguntas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Escriba su pregunta</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}  // Atualiza o estado com o valor do textarea
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSendQuestion}>
          Enviar <Icon.CheckLg />
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancelar <Icon.XLg />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPergunta;
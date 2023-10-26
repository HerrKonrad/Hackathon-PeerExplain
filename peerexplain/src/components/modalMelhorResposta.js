import { Button, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

const nomes = ["Carlos", "Juan", "Daniel"]; // Substitua esses nomes pelos nomes que você deseja atribuir

const ModalMelhorResposta = ({ show, onHide, objeto }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Melhor resposta para a minha pergunta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {objeto.answers ? (
          <>
            <div>
              {objeto.answers.length === 1 ? (
                <div>
                  <p>
                    <span style={{ fontWeight: 'bold' }}>Respuesta:</span>
                  </p>
                </div>
              ) : (
                <div>
                  <p>
                    <span style={{ fontWeight: 'bold' }}>Respuesta mas adecuada:</span>
                  </p>
                </div>
              )}
            </div>
            {objeto.answers.map((resposta, index) => (
              <div key={index}>
                {index === 0 ? (
                  <p>
                    <span style={{ fontWeight: 'bold' }}>
                      {nomes[index]}:
                    </span> {resposta}
                    <span style={{ fontWeight: 'bold' }}>
                    <br />
                    <br />
                      Otras respuestas:
                    </span>
                  </p>
                  
                ) : (
                  <p>
                    
                   
                    <span style={{ fontWeight: 'bold' }}>
                      {nomes[index]}:
                    </span> {resposta}
                  </p>
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

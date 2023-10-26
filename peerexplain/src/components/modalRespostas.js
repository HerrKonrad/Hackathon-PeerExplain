import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useState } from 'react';  // Importe o useState para gerenciar o estado do textarea

const ModalRespostas = ({ show, onHide, objeto }) => {
  const [pergunta, setPergunta] = useState('');  // Estado para armazenar o valor do textarea
  const [novanota, setNovanota] = useState("");
  console.log(objeto);  
  const arrayResposta = objeto.answers;
  console.log(objeto.answers);
  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      handleNovaResposta();
    }
  }

  const handleInput = (event) => {
    setNovanota(event.target.value);
  };

  const handleNovaResposta = async () => {
    setNovanota("");
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <div className="card">
        <div className="p-3 bg-grey text-start">
          <h4>{objeto.question}</h4>
        </div>
        <div className="mt-2" id="mensagens">
          {arrayResposta ? (
            arrayResposta.map((answer, index) => (
              <div key={index} className={`mt-2 message-bg ${index % 2 === 0 ? "even" : "odd"}`}>
                <div className="d-flex flex-row p-3">
                  <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex flex-row align-items-center">
                        <span className="mr-2"><b>{answer.nome}</b></span>
                      </div>
                    </div>
                    <p className="text-justify comment-text mb-0 text-start">
                      {answer.conteudo}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Não tem resposta ainda!</p>
          )}
        </div>
        <div className="mt-2 d-flex flex-row align-items-center p-3 form-color">
          <div className="input-group mx-3">
            <input
              type="text"
              className="form-control"
              placeholder="Introduza uma resposta..."
              value={novanota}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
            <button id="send" className="btn" onClick={handleNovaResposta}><Icon.SendFill/></button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalRespostas;

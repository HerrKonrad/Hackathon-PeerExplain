import { Button, Form, Modal } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useState } from 'react';  // Importe o useState para gerenciar o estado do textarea

const ModalRespostas = ({ show, onHide }) => {
  const [pergunta, setPergunta] = useState('');  // Estado para armazenar o valor do textarea

  const [novanota, setNovanota] = useState("");

  const [nota, setNota] = useState([
    { Texto: "Esta é a primeira nota de teste.", NomeRH: "João" },
    { Texto: "Aqui está a segunda nota de teste.", NomeRH: "Maria" },
    { Texto: "Terceira nota de teste para experimentar.", NomeRH: "José" }
  ]);

  
  

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
              <h4>Notas da Entrevista</h4>
            </div>
            <div className="mt-2" id="mensagens">
            {nota.map((nota, index) => (
            <div key={index} className={`mt-2 message-bg ${index % 2 === 0 ? "even" : "odd"}`}>
                <div className="d-flex flex-row p-3">
                <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-row align-items-center">
                        <span className="mr-2"><b>{nota.NomeRH}</b></span>
                    </div>
                    </div>
                    <p className="text-justify comment-text mb-0 text-start">
                        {nota.Texto}
                    </p>
                </div>
                </div>
            </div>
            ))}
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
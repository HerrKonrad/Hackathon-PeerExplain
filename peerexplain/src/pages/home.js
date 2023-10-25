import React, { useState, useEffect, useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ModalLogin from "../components/modalLogin";
import ModalPergunta from "../components/modalPergunta";
import { Accordion } from "react-bootstrap";
import { Peer } from "peerjs";
import "./style.css";

function Home() {
  const [activeTab, setActiveTab] = useState(1);

  const [firstLogin, setFirstLogin] = useState(1);

  const [showModalPergunta, setShowModalPergunta] = useState(false);

  const handleCloseModalPergunta = () => setShowModalPergunta(false);
  const handleShowModalPergunta = () => {
    setShowModalPergunta(true);
  };

  const [showModalLogin, setShowModalLogin] = useState(true);

  const handleCloseModalLogin = () => {
    setShowModalLogin(false);
    setFirstLogin(0);
  };

  const [targetId, setTargetId] = useState("");
  const [myID, setMyId] = useState("");
  const [message, setMessage] = useState("");
  const [allPeers, setAllPeers] = useState([]);
  const peerRef = useRef(null);
  const minhasPerguntasLocal = localStorage.getItem("minhasPerguntas");
  var minhasPerguntas = JSON.parse(minhasPerguntasLocal);
  if (minhasPerguntas) {
    var minhasPerguntasArray = Object.values(minhasPerguntas);
  }
 
  useEffect(() => {
    console.log("P2P component mounted");
    const newPeer = new Peer({
      host: "192.168.240.223",
      port: 9000,
      path: "/myapp",
    });

    newPeer.on("open", () => {
      console.log("My peer ID is: " + newPeer.id);
      setMyId(newPeer.id); // Atualiza o estado

      newPeer.listAllPeers((peers) => {
        console.log("Peers conectados: " + peers);
        setAllPeers(peers); // Atualiza o estado
      });

      newPeer.on("connection", (conn) => {
        conn.on("data", (data) => {
          console.log("Recebi uma mensagem:", data);
          handleReceiveMessage(data);
        });
      });

      peerRef.current = newPeer;
    });

    return () => {
      // Encerrar a conexão ao desmontar o componente, se necessário
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  const sendDirectMessage = (id_destinatario, mensagem) => {
    const conn = peerRef.current.connect(id_destinatario);

    const messageToSend = {
      id_remetente: myID,
      id_destinatario: id_destinatario,
      type: "DIRECT",
      message: mensagem,
    };

    if (conn) {
      conn.on("open", () => {
        console.log("Connection established");
        conn.send(messageToSend);
      });

      conn.on("error", (err) => {
        console.log("Failed to connect: " + err);
      });
    } else {
      console.log("Connection not established. Check peer availability.");
    }
  };

  const handleReceiveMessage = (message) => {
    const id_remetente = message.id_remetente;
    const type = message.type;
    const conteudo = message.message;
    if (type === "DIRECT") {
    } else if (type === "BROADCAST") {
      const broadcastType = conteudo.type;
      const personName = conteudo.personName;

      // Remover
      //sendDirectMessage(id_remetente, "Olá " + personName + " recebi a sua mensagem");
      console.log("Resposta enviada?");

      // Se for para verificar se temos uma pergunta
      if (broadcastType === "QUESTION") {
        // Verificamos se temos em localStorage um pergunta parecida
        // Caso tenhamos enviamos de volta para quem nos fez broadcast
      } else if (broadcastType === "GETQUESTIONS") {
        // Um pedido para enviarmos todas perguntas que temos, enviamos tudo.
      }
    }
  };

  const sendQuestion = (questionText) => {
    const usuarioString = localStorage.getItem("Utilizador");
    const usuario = usuarioString ? JSON.parse(usuarioString): [];
    // Converte a string JSON para objeto JavaScript
    

    console.log("Enviando a pergunta para todoas");
    const nome = usuario.nome;
    const area = usuario.area;
    console.log(usuario);

   // Certifique-se de que o objeto guardarQuestao tenha todas as propriedades necessárias
const guardarQuestao = {
  autor: usuario.nome,
  titulo: questionText,
  area: usuario.area
};
// Resto do código para adicionar ao localStorage
var JSONperguntaExistente = localStorage.getItem("minhasPerguntas");
var perguntasExistente = JSONperguntaExistente ? JSON.parse(JSONperguntaExistente) : [];
perguntasExistente.push(guardarQuestao);
var novoJSONpergunta = JSON.stringify(perguntasExistente);
localStorage.setItem("minhasPerguntas", novoJSONpergunta);

    
    if (nome) {
      const question = {
        type: "QUESTION",
        nome: nome,
        question: questionText,
      };
      sendBroadCast(question);
      // Se sucedido armazena a pergunta em local storage
    }
  };

  const sendBroadCast = (msg) => {
    // Atualizar peers
    peerRef.current.listAllPeers((peers) => {
      console.log("Atualização dos Peers conectados: " + peers);
      setAllPeers(peers); // Atualiza o estado
    });
    allPeers.forEach((peer) => {
      if (peer != myID) {
        console.log(peer);
        const conn = peerRef.current.connect(peer);

        if (conn) {
          conn.on("open", () => {
            const messageToSend = {
              id_remetente: myID,
              id_destinatario: peer,
              type: "BROADCAST",
              message: msg,
            };

            console.log("Connection established");
            conn.send(messageToSend);
          });

          conn.on("error", (err) => {
            console.log("Failed to connect: " + err);
          });
        } else {
          console.log("Connection not established. Check peer availability.");
        }
      }
    });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-primary">
        <Container>
          <Navbar.Brand className="text-light">PeerExplain</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="text-light">
                <a className={`nav-link ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>
                  Preguntas
                </a>
              </Nav.Link>
              <Nav.Link className="text-light">
                <a className={`nav-link ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>
                  Respuestas
                </a>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="container mt-6 mb-4">
        <div className="row">
          <div className="col-md-12">
            {activeTab === 1 ? (
              <>
                <div className="accordion" id="usersAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="usersHeading">
                      <button className="accordion-button" type="button" aria-expanded="true" aria-controls="collapseOne">
                        Mis Preguntas:
                      </button>
                    </h2>
                    <div id="usersCollapse" className="accordion-collapse collapse show" aria-labelledby="usersHeading" data-bs-parent="#usersAccordion">
                      <div className="accordion-body" style={{ maxHeight: "1000px", overflowY: "auto" }}>
                        
                      <ul className="list-group">
                        { minhasPerguntasArray ? (
                          minhasPerguntasArray.map((perguntas, index) => (
                            <div className="card mt-3" key={index}>
                              <div className="card-header">{perguntas.autor}</div>
                              <div className="card-body">
                                <h5 className="card-title">{perguntas.titulo}</h5>
                                <p className="card-text">{perguntas.area}</p>
                                <div className="d-md-flex justify-content-md-end">
                                  <a href="#" className="btn btn-primary">
                                    Más información
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No hay datos disponibles.</p>
                        )}
                      </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="fab">
                  <button class="main" onClick={handleShowModalPergunta}>
                    <Icon.PlusLg />
                  </button>
                  <ModalPergunta show={showModalPergunta} onHide={handleCloseModalPergunta} click={handleCloseModalPergunta} sendQuestion={sendQuestion} />
                </div>
              </>
            ) : activeTab === 2 ? (
              <>
                <div>
                  
                </div>
              </>
            ) : activeTab === 3 ? (
              <>
                <div>teste 3</div>
              </>
            ) : activeTab === 4 ? (
              <>
                <div>teste 4</div>
              </>
            ) : null}
          </div>

          {firstLogin === 1 ? <ModalLogin show={showModalLogin} onHide={handleCloseModalLogin} click={handleCloseModalLogin} /> : null}
        </div>
      </div>
    </>
  );
}

export default Home;

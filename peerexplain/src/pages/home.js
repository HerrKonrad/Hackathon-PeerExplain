import React, { useState, useEffect, useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ModalLogin from "../components/modalLogin";
import ModalPergunta from "../components/modalPergunta";
import { Peer } from 'peerjs';
import axios from "axios";
import "./style.css";

function Home() {
  const [activeTab, setActiveTab] = useState(1);


  const [showModalPergunta, setShowModalPergunta] = useState(false);

  const handleCloseModalPergunta = () => setShowModalPergunta(false);
  const handleShowModalPergunta = () => setShowModalPergunta(true);

  const [showModalLogin, setShowModalLogin] = useState(true);

  const handleCloseModalLogin = () => {
    setShowModalLogin(false);
  };

  var cardData = {
    cardHeader: "Featured",
    cardTitle: "Special title treatment",
    cardText:
      "With supporting text below as a natural lead-in to additional content.",
    btnText: "Go somewhere",
  };
  // Converta o objeto JSON em uma string
  var cardDataString = JSON.stringify(cardData);

  // Armazene a string no localStorage
  localStorage.setItem("cardData", cardDataString);

  const [targetId, setTargetId] = useState('');
  const [myID, setMyId] = useState('');
  const [message, setMessage] = useState('');
  const [allPeers, setAllPeers] = useState([]);
  const peerRef = useRef(null);

  useEffect(() => {
    console.log('P2P component mounted');
    const newPeer = new Peer({
      host: '192.168.240.223',
      port: 9000,
      path: '/myapp',
    });

    newPeer.on('open', () => {
      console.log('My peer ID is: ' + newPeer.id);
      setMyId(newPeer.id); // Atualiza o estado

      newPeer.listAllPeers((peers) => {
        console.log('Peers conectados: ' + peers);
        setAllPeers(peers); // Atualiza o estado
      });

      newPeer.on('connection', (conn) => {
        conn.on('data', (data) => {
          console.log('Recebi uma mensagem:', data);
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

  const handleSendMessage = () => {
    const conn = peerRef.current.connect(targetId);

    const messageToSend = {
      id_remetente: myID,
      id_destinatario: targetId,
      type: "DIRECT", 
      message: message
    };
  
    if (conn) {
      conn.on('open', () => {
        console.log('Connection established');
        conn.send(messageToSend);
      });
  
      conn.on('error', (err) => {
        console.log('Failed to connect: ' + err);
      });
    } else {
      console.log('Connection not established. Check peer availability.');
    }
  };

  const sendQuestionl = () => {

    /*
    console.log("Enviando a pergunta para todoas");
    const toSendMsg = {
      personName : "XPTO",
      question : "Como fazer uma pergunta?"
    }
*/

  }

  const sendBroadCast = (msg) => { 
    allPeers.forEach((peer) => {

      if (peer != myID) {
        console.log(peer)
        const conn = peerRef.current.connect(peer);


  
        if (conn) {
          conn.on('open', () => {
            const messageToSend = {
              id_remetente: myID,
              id_destinatario: peer,
              type: "BROADCAST", 
              message: msg
            };
            
            console.log('Connection established');
            conn.send(messageToSend);
          });
    
          conn.on('error', (err) => {
            console.log('Failed to connect: ' + err);
          });
        } else {
          console.log('Connection not established. Check peer availability.');
        }
      }
    });
  }



  const api = axios.create({
    baseURL: "https://api.openai.com/v1",
  });
  api.defaults.headers.common["Authorization"] = `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`;
  
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Nome de 3 gatos",
      },
    ],
  };

  const postData = async () => {
    try {
      const response = await api.post("/chat/completions", data);
      console.log("Response data:", response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  postData();
  
  return (
    <>
      <Navbar expand="lg" className="bg-primary">
        <Container>
          <Navbar.Brand className="text-light">PeerExplain</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className="text-light">
                <span
                  className={`nav-link ${activeTab === 1 ? "active" : ""}`}
                  onClick={() => setActiveTab(1)}
                >
                  Mis preguntas
                </span>
              </Nav.Link>
              <Nav.Link className="text-light">
                <span
                  className={`nav-link ${activeTab === 2 ? "active" : ""}`}
                  onClick={() => setActiveTab(2)}
                >
                  Mis respuestas
                </span>
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
                <div className="card mt-3">
                  <div className="card-header">{cardData.cardHeader}</div>
                  <div className="card-body">
                    <h5 className="card-title">{cardData.cardTitle}</h5>
                    <p className="card-text">{cardData.cardText}</p>
                    <div className=" d-md-flex justify-content-md-end">
                      <span href="#" className="btn btn-primary">
                        Mais detalhes
                      </span>
                    </div>
                  </div>
                </div>
                <div class="fab">
                  <button class="main" onClick={handleShowModalPergunta}>
                    <Icon.PlusLg />
                  </button>
                  <ModalPergunta
                    show={showModalPergunta}
                    onHide={handleCloseModalPergunta}
                    click={handleCloseModalPergunta}
                  />
                </div>
              </>
            ) : activeTab === 2 ? (
              <>
                <div>
                  <div className="card mt-3">
                    <div className="card-header">Featured</div>
                    <div className="card-body">
                      <h5 className="card-title">Special title treatment</h5>
                      <p className="card-text">
                        With supporting text below as a natural lead-in to
                        additional content.
                      </p>
                      <span className="btn btn-primary">Go somewhere</span>
                    </div>
                  </div>
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

          {!localStorage.getItem("Utilizador") ? (
            <ModalLogin
              show={showModalLogin}
              onHide={handleCloseModalLogin}
              click={handleCloseModalLogin}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Home;

import React, { useState, useEffect, useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ModalLogin from "../components/modalLogin";
import ModalPergunta from "../components/modalPergunta";
import { Accordion } from "react-bootstrap";
import { Peer } from 'peerjs';
import axios from "axios";
import "./style.css";

const stringSimilarity = require('string-similarity');
const api = axios.create({
  baseURL: "https://api.openai.com/v1",
});
api.defaults.headers.common["Authorization"] = `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`;


function Home() {
  const [activeTab, setActiveTab] = useState(1);



  const [showModalPergunta, setShowModalPergunta] = useState(false);

  const handleCloseModalPergunta = () => setShowModalPergunta(false);
  const postData = async (data) => {
    try {
      const toSend = {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: data,
          },
        ],
      };
      const response = await api.post("/chat/completions", toSend);
      console.log("Response data:", response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };
 // Utiliza a A.I (ChatGPT) para verificar qual a melhor resposta disponível com base no perfil do utilizador
const checkBestAnswer = (question, answers, userProfile) => {
  const prompt = `Pregunta ${question}\nRespuestas:
   ${answers.join('\n')}\nUser Profile: ${JSON.stringify(userProfile)}\n 
   Dígame cuál fue la mejor respuesta dada basándose en el perfil del usuario, respuesta SOLO en JSO: {"answer" : "mejor respuesta"}`;

   console.log(prompt);
   postData(prompt)
   
  // Call the GPT API with the prompt string
  // ...
}
/*
const question = "¿Cuál es la capital de Francia?";
const answerChoices = ["Paris", "Berlin", "London", "Madrid"];
const user = { name: "John", age: 30 };

checkBestAnswer(question, answerChoices, user);
*/
  const handleShowModalPergunta = () => 
  {
    setShowModalPergunta(true);
    
  }

  const [showModalLogin, setShowModalLogin] = useState(true);

  const handleCloseModalLogin = () => {
    setShowModalLogin(false);
  };
  var cardData = [
    {
      cardHeader: "Featured 1",
      cardTitle: "Special title treatment 1",
      cardText: "With supporting text below as a natural lead-in to additional content 1.",
    },
    {
      cardHeader: "Featured 2",
      cardTitle: "Special title treatment 2",
      cardText: "With supporting text below as a natural lead-in to additional content 2.",
    },
    // Adicione mais objetos conforme necessário
  ];
  var respostas = [
    {
      cardHeader: "Respostas 1",
      cardTitle: "Special title treatment 1",
      cardText: "With supporting text below as a natural lead-in to additional content 1.",
    },
    {
      cardHeader: "Respostas 2",
      cardTitle: "Special title treatment 2",
      cardText: "With supporting text below as a natural lead-in to additional content 2.",
    },
    // Adicione mais objetos conforme necessário
  ];

  // Converter a matriz em uma string JSON
  var cardDataString = JSON.stringify(cardData);
  var respostasArray = JSON.stringify(respostas);
  // Armazenar a string no localStorage
  localStorage.setItem("cardData", cardDataString);
  localStorage.setItem("respostas", respostasArray);
  // Recuperar a string JSON do localStorage
  var cardDataString = localStorage.getItem("cardData");
  var respostaString = localStorage.getItem("respostas");
  // Converter a string de volta para um objeto JavaScript
  var cardData = JSON.parse(cardDataString);
  var respostas = JSON.parse(respostaString);
  // Verificar se os dados foram recuperados com sucesso
  if (cardData) {
    var cardDataArray = Object.values(cardData);
  }
  if (respostas) {
    var respostasArray = Object.values(respostas);
  }

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
          handleReceiveMessage(data)
          
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

  // Função para comparar duas frases
function compararFrases(frase1, frase2) {
  // Calcula a similaridade entre as frases
  const resultado = stringSimilarity.compareTwoStrings(frase1, frase2);

  // Define um limite de similaridade (ajuste conforme necessário)
  const limiteSimilaridade = 0.7;

  // Verifica se a similaridade está acima do limite
  const saoSemelhantes = resultado >= limiteSimilaridade;

  return {
    similaridade: resultado,
    saoSemelhantes,
  };
}
/*
// Exemplo de uso
const frase1 = "Qual a maior cidade de Portugal?";
const frase2 = "Qual a maior cidade do Brasil?";

const resultado = compararFrases(frase1, frase2);

console.log(`Similaridade: ${resultado.similaridade}`);
console.log(`As frases são semelhantes? ${resultado.saoSemelhantes}`);
*/
  const sendDirectMessage = (id_destinatario, mensagem) => {
    const conn = peerRef.current.connect(id_destinatario);

    const messageToSend = {
      id_remetente: myID,
      id_destinatario: id_destinatario,
      type: "DIRECT", 
      message: mensagem
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

  const handleReceiveMessage = (message) => {

    const id_remetente = message.id_remetente;
    const type = message.type;
    const conteudo = message.message
    if(type === "DIRECT")
    {


    }else if(type === "BROADCAST")
    {
      const broadcastType = conteudo.type;
      const personName = conteudo.personName;

      // Remover
      //sendDirectMessage(id_remetente, "Olá " + personName + " recebi a sua mensagem");
      console.log("Resposta enviada?")
      
      
      if(broadcastType === "QUESTION")
       {
        // Se for para verificar se temos uma pergunta
      // Comparar o título de cada uma e verificar com "compararFrases()" se são semelhantes
      // Se forem semelhantes enviamos a resposta para quem fez o broadcast

      // Se não forem semelhantes não fazemos nada
       }
       else if(broadcastType === "GETQUESTIONS")
       {
        // Um pedido para enviarmos todas perguntas que temos, enviamos tudo.

       }
    }
  

  }

  const sendQuestion = (questionText) => {

    const usuarioString = localStorage.getItem("Utilizador");
    // Converte a string JSON para objeto JavaScript
    let personName;
    if (usuarioString) {
      const usuarioObjeto = JSON.parse(usuarioString);

      // Obtém o valor do elemento 'nome' do objeto
     personName = usuarioObjeto.nome;
    }
    
    console.log("Enviando a pergunta para todoas");
    if(personName)
    {
      const question = {
        type: "QUESTION",
        personName : personName,
        question :  questionText
      
    }
    sendBroadCast(question);
    // Se sucedido armazena a pergunta em local storage

    }
  }
  

  const sendBroadCast = (msg) => { 
    // Atualizar peers
    peerRef.current.listAllPeers((peers) => {
      console.log('Atualização dos Peers conectados: ' + peers);
      setAllPeers(peers); // Atualiza o estado
    });
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




  
  /*
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Nome de 3 gatos",
      },
    ],
  };
*/


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
          {cardDataArray.map((card, index) => (
            <div className="card mt-3" key={index}>
              <div className="card-header">{card.cardHeader}</div>
              <div className="card-body">
                <h5 className="card-title">{card.cardTitle}</h5>
                <p className="card-text">{card.cardText}</p>
                <div className="d-md-flex justify-content-md-end">
                  <a href="#" className="btn btn-primary">
                    Mas información
                  </a>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
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
                    sendQuestion={sendQuestion}
                  />
                </div>
              </>
            ) : activeTab === 2 ? (
              <>
                <div>
                  {respostasArray.map((respostas, index) => (
                    <div className="card mt-3" key={index}>
                      <div className="card-header">{respostas.cardHeader}</div>
                      <div className="card-body">
                        <h5 className="card-title">{respostas.cardTitle}</h5>
                        <p className="card-text">{respostas.cardText}</p>
                        <div className="d-md-flex justify-content-md-end">
                          <a href="#" className="btn btn-primary">
                            Mas información
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
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

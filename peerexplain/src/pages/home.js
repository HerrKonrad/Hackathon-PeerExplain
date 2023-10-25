import React, { useState, useEffect, useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ModalLogin from "../components/modalLogin";
import { Accordion } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';
import ModalPergunta from "../components/modalPergunta";
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

  const [isAccordionOpen, setIsAccordionOpen] = useState(true);


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
const question = "¿Cómo funciona una transmisión manual?";
const answerChoices = ["Una transmisión manual es un componente del vehículo que permite al conductor seleccionar manualmente las marchas del motor. Consiste en un conjunto de engranajes que conectan el motor a las ruedas. El conductor utiliza un pedal de embrague para desconectar temporalmente el motor de la transmisión, permitiendo así cambiar de marcha. Las marchas más bajas proporcionan más potencia para arrancar y subir colinas, mientras que las marchas más altas permiten una mayor velocidad en terrenos planos.", "Una transmisión manual, también conocida como caja de cambios manual, opera mediante el uso de engranajes y un embrague. El motor está conectado a un conjunto de piñones, y el conductor puede seleccionar manualmente diferentes combinaciones de piñones para variar la relación de transmisión entre el motor y las ruedas. La relación de transmisión influye en el torque y la velocidad del vehículo.

El embrague es crucial en este proceso. Cuando el conductor presiona el pedal del embrague, se desconecta temporalmente el motor de la transmisión, permitiendo cambiar de marcha sin detener el vehículo. Al liberar gradualmente el pedal del embrague, se vuelve a conectar el motor y la transmisión de manera suave."];
const user = { name: "John", age: 30, levelOfEducation: "master degree", field : "History"  };

checkBestAnswer(question, answerChoices, user);
*/
  const handleShowModalPergunta = () => 
  {
    setShowModalPergunta(true);
  };

  const [showModalLogin, setShowModalLogin] = useState(true);

  const handleCloseModalLogin = () => {
    setShowModalLogin(false);
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
      host: '192.168.240.223',
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
        console.log("Recebi uma pergunta");
        const question = conteudo.question;
        // Se for para verificar se temos uma pergunta
      // Comparar o título de cada uma e verificar com "compararFrases()" se são semelhantes
      // Define a function to compare a question with a list of answers

        // Create an empty array to store the matching answers
       const matchingAnswers = [];
        const answers = minhasPerguntas;

        

        // Loop through each answer in the list
        answers.forEach((answer) => {
          // Compare the question with the answer's title using the compararFrases function
          const similarity = compararFrases(question, answer.titulo);
          console.log("Titulo", answer.titulo)

          // If the similarity is above a certain threshold, add the answer to the matchingAnswers array
          if (similarity.saoSemelhantes) {
            matchingAnswers.push(answer);
          }
        });

    
      console.log("Respostas semelhantes", matchingAnswers); 

      // Se forem semelhantes enviamos a resposta para quem fez o broadcast
      /*
      const resposta = {
        "respostas" : {
        "1" : { "conteudo" : "xpto", "autor" : "o pai"},
        "2" : {"conteudo" : "xptooooo", "autor" : "o pai"}
      }
    }
   matchingAnswers.push(resposta)
   */
        
      if(matchingAnswers.length > 0)
      sendDirectMessage(id_remetente, matchingAnswers);


      // Se não forem semelhantes não fazemos nada
       }
       else if(broadcastType === "GETQUESTIONS")
       {
        // Um pedido para enviarmos todas perguntas que temos, enviamos tudo.
      }
    }
  };

  const sendQuestion = (questionText) => {
    const usuarioString = localStorage.getItem("Utilizador");
    const usuario = usuarioString ? JSON.parse(usuarioString): [];
    // Converte a string JSON para objeto JavaScript
    
    const uuid = uuidv4();
    console.log("Enviando a pergunta para todoas");
    const nome = usuario.nome;
    const area = usuario.area;
    console.log(usuario);

   // Certifique-se de que o objeto guardarQuestao tenha todas as propriedades necessárias
const guardarQuestao = {
  id: uuid,
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
        id: uuid,
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
                  <button
                    className={`accordion-button ${!isAccordionOpen ? 'bg-white' : ''}`} // Adicione a classe condicional aqui
                    type="button"
                    aria-expanded={isAccordionOpen}
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                    aria-controls="collapseOne"
                  >
                    Mis Preguntas:
                  </button>
                </h2>
                <div
                  id="usersCollapse"
                  className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`}
                  aria-labelledby="usersHeading"
                  data-bs-parent="#usersAccordion"
                >
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
              <div class="fab">
                <button class="main" onClick={handleShowModalPergunta}>
                  <Icon.PlusLg />
                </button>
                <ModalPergunta show={showModalPergunta} onHide={handleCloseModalPergunta} click={handleCloseModalPergunta} sendQuestion={sendQuestion} />
              </div>
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

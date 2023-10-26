import React, { useState, useEffect, useRef } from "react";
import * as Icon from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ModalLogin from "../components/modalLogin";
import { Accordion } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import ModalPergunta from "../components/modalPergunta";
import { Peer } from "peerjs";
import axios from "axios";
import ModalRespostas from "../components/modalRespostas";

import "./style.css";
import ModalMelhorResposta from "../components/modalMelhorResposta";

const stringSimilarity = require("string-similarity");
const api = axios.create({
  baseURL: "https://api.openai.com/v1",
});
api.defaults.headers.common["Authorization"] = `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`;

function Home() {
  const [activeTab, setActiveTab] = useState(1);


  const [showModalPergunta, setShowModalPergunta] = useState(false);
  const handleCloseModalPergunta = () => setShowModalPergunta(false);  
  const [showModalRespostas, setShowModalRespostas] = useState(false);
  const handleCloseModalRespostas = () => setShowModalRespostas(false);
  const [showModalMelhorResposta, setShowModalMelhorResposta] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);

  const handleShowModal = (objeto) => {
    setSelectedObject(objeto);
    setShowModalMelhorResposta(true);
  };

  const [selectedObjectRespostas, setSelectedObjectRespostas] = useState(null);
  
  const handleShowModalRespostas = (objeto) => 
  {
    setSelectedObjectRespostas(objeto);
    setShowModalRespostas(true);
  };

  const handleCloseModalMelhorResposta = () => {
    setSelectedObject(null);
    setShowModalMelhorResposta(false);
  };

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
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
      return ""
    }
  };

  
 // Utiliza a A.I (ChatGPT) para verificar qual a melhor resposta disponível com base no perfil do utilizador
const checkBestAnswer = async (question, answers, userProfile) => {
  const prompt = `Pregunta ${question}\nRespuestas:\n${answers.map((answer, index) => `${index + 1}. ${answer}`).join('\n')}\nUser Profile: ${JSON.stringify(userProfile)}\n Comprobar las respuestas enumeradas dadas y, basándose en los datos del perfil del usuario y prediciendo cuáles serían sus preferencias para una mejor respuesta, hacer una clasificación diciendo numéricamente de la mejor a la peor respuesta basándose en lo que parece más apropiado para el usuario. La respuesta SOLO debe ser un JSON, 
  y nada más:. La clasificación sólo debe contener el número de respuestas Ejemplo:{"ranking" : []}`;
   const resposta = await postData(prompt);
    
    return resposta
}






  const handleShowModalPergunta = () => {
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

      host: "192.168.243.173",

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
    const personName = conteudo.personName;
    const id_question = message.message.id
    if(type === "DIRECT")
    {
      const directType = conteudo.type;

      if(directType === "ANSWER")
      {
        console.log("Recebi uma resposta");

        const question = message.message.questions;

        const answers = question.answers;
        const questionId = message.message.id_original_question;
        
        // reordenar as respostas por ordem de melhor resposta
        const usuarioString = localStorage.getItem("Utilizador");
        const utilizador = usuarioString ? JSON.parse(usuarioString) : [];
        console.log(questionId);
        
        if (utilizador && question && answers.length > 0) {
          console.log("Entrou");
        
          async function obterRanking() {
            const rankingAnswer = await checkBestAnswer(question, answers, utilizador);
            console.log("Ranking", rankingAnswer);
        
            if (rankingAnswer) {
              const minhasPerguntasString = localStorage.getItem("minhasPerguntas");
              const minhasPerguntas = minhasPerguntasString ? JSON.parse(minhasPerguntasString) : [];
        
              minhasPerguntas.forEach(async (p) => {
                const p_id = p.id;
                console.log("Pergunta", p_id);
              
                if (compararFrases(p.question, question.question)) {
                  console.log("...");
              
                  const jsonConv = JSON.parse(rankingAnswer);
                  const orderedAnswers = jsonConv.ranking.map((rank) => {
                    return answers[rank - 1];
                  });
              
                  console.log("Resposta", p.answers);
                  console.log("Ordered answers:", orderedAnswers);
              
                  if (!p.answers) {
                    p.answers = [];
                  }
              
                  // Adiciona orderedAnswers ao array p.answers
                  p.answers.push(...orderedAnswers);
              
                  console.log("Objeto editar", p);
                  
                  // Atualiza o localStorage ou o que for necessário
                  const respostaString = localStorage.getItem("minhasPerguntas");
                  const outrasRespostas = respostaString ? JSON.parse(respostaString) : [];
                  const index = outrasRespostas.findIndex((item) => item.id === p_id);
              
                  if (index !== -1) {
                    outrasRespostas[index] = p;
                    localStorage.setItem("minhasPerguntas", JSON.stringify(outrasRespostas));
                  }
                }
              });
            }
          }
        
          obterRanking();
        }
        
  
      }

    }else if(type === "BROADCAST")
    {
      const broadcastType = conteudo.type;

      // Remover
      //sendDirectMessage(id_remetente, "Olá " + personName + " recebi a sua mensagem");
      console.log("Resposta enviada?");

      if (broadcastType === "QUESTION") {
        console.log("Recebi uma pergunta");
        const question = conteudo.question; 
        // Se for para verificar se temos uma pergunta

        // Comparar o título de cada uma e verificar com "compararFrases()" se são semelhantes
        // Define a function to compare a question with a list of answers

        // Create an empty array to store the matching answers

        const matchingAnswers = {"id_remetente" : id_remetente, "id_destinatario" : myID,  "type" : "DIRECT", "message" : {"type" : "ANSWER", "answers" : [] }};
      
       const questions = minhasPerguntas;
       // console.log(questions)
        
        if(questions)
        {
// Loop through each answer in the list
questions.forEach((q) => {
  // Compare the question with the answer's title using the compararFrases function
  const similarity = compararFrases(question, q.question);
  //console.log("question", answer.question)


  // If the similarity is above a certain threshold, add the answer to the matchingAnswers array
  if (similarity.saoSemelhantes) {

    matchingAnswers.message.answers.push(q);

    //enviar as respostas para o utilizador se tiver

  }
});



const existingDataJSON = localStorage.getItem("outrasPerguntas");
const existingData = existingDataJSON ? JSON.parse(existingDataJSON) : [];

existingData.push(conteudo);

const updatedDataJSON = JSON.stringify(existingData);

localStorage.setItem("outrasPerguntas", updatedDataJSON);
//matchingAnswers.push(matchingAnswers)


//console.log("Respostas semelhantes", matchingAnswers); 

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

console.log(matchingAnswers.message.answers );
const conteudo_resposta =
{
  "type" : "ANSWER",


  questions : matchingAnswers.message.answers[0]
}
if(matchingAnswers.message.answers.length > 0)
sendDirectMessage(id_remetente, conteudo_resposta);

//const questionsReceived = matchingAnswers.message.answer;

/*
questionsReceived.forEach((question) => { 


});
*/
        }
        
      }
       else if(broadcastType === "GETQUESTIONS")
       {
        // Um pedido para enviarmos todas perguntas que temos, enviamos tudo.
      }
    }
  };

  const sendQuestion = (questionText) => {
    const usuarioString = localStorage.getItem("Utilizador");
    const usuario = usuarioString ? JSON.parse(usuarioString) : [];
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
      question: questionText,
      area: usuario.area,

      answers: []

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

  const outasPerguntasLocal = localStorage.getItem("outrasPerguntas");
  var outrasPerguntas = JSON.parse(outasPerguntasLocal);
  if (outrasPerguntas) {
    var outrasPerguntasArray = Object.values(outrasPerguntas);
  }
  var conteudo = "";
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
                 Mis Preguntas
                </a>
              </Nav.Link>
              <Nav.Link className="text-light">
                <a className={`nav-link ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>
                 Otras Preguntas
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
                {minhasPerguntasArray && minhasPerguntasArray.length > 0 ? (
                    minhasPerguntasArray.map((perguntas, index) => (
                      <div className="card mt-3" key={index} onClick={() => handleShowModal(perguntas)}>
                        <div className="card-header">
                          {perguntas.autor} | {perguntas.area}
                        </div>
                        <div className="card-body">
                        <p className="card-text" style={{ fontWeight: 'bold' }}>{perguntas.question}</p>
                          <div className="d-md-flex justify-content-center">
                          {perguntas.answers && perguntas.answers.length > 0 ? (
                              <p>{perguntas.answers[0]}</p>
                            ) : (
                              <p>Sem respostas ainda.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No hay preguntas hechas por usted.</p>
                  )}

                {selectedObject ? (
                  <ModalMelhorResposta show={showModalMelhorResposta} onHide={handleCloseModalMelhorResposta} objeto={selectedObject} />
                ) : null}
                <div className="fab">
                  <button className="main" onClick={handleShowModalPergunta}>
                    <Icon.PlusLg />
                  </button>
                  <ModalPergunta show={showModalPergunta} onHide={handleCloseModalPergunta} click={handleCloseModalPergunta} sendQuestion={sendQuestion} />
                </div>
              </>
            ) : activeTab === 2 ? (
              <>
                {outrasPerguntasArray ? (
                  outrasPerguntasArray.map((perguntas, index) => (
                    
                    <div className="card mt-3" key={index}>
                      <div className="card-header">{perguntas.nome}</div>
                      <div className="card-body">
                        <p className="card-text">{perguntas.question}</p>
                        <div className="d-md-flex justify-content-md-end">
                          <a className="btn btn-primary" onClick={() => handleShowModalRespostas(perguntas)}>
                            Responder
                          </a>
                        </div>
                      </div>
                    </div>
                  
                  ))
                ) : (
                  <p>No hay datos de otras preguntas disponibles.</p>
                )}
                <div className="fab">
                  <button className="main" onClick={handleShowModalPergunta}>
                    <Icon.PlusLg />
                  </button>
                  <ModalPergunta show={showModalPergunta} onHide={handleCloseModalPergunta} click={handleCloseModalPergunta} sendQuestion={sendQuestion} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {selectedObjectRespostas ? (
        <ModalRespostas show={showModalRespostas} onHide={handleCloseModalRespostas} click={handleCloseModalRespostas} objeto={selectedObjectRespostas} />
      ) : null}
      {!localStorage.getItem("Utilizador") ? <ModalLogin show={showModalLogin} onHide={handleCloseModalLogin} click={handleCloseModalLogin} /> : null}
    </>
  );
  
}

export default Home;

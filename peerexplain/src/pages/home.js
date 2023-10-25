import React, { useState } from "react";
import * as Icon from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ModalLogin from "../components/modalLogin";
import ModalPergunta from "../components/modalPergunta";
import { Accordion } from "react-bootstrap";
import "./style.css";

function Home() {
  const [activeTab, setActiveTab] = useState(1);

  const [firstLogin, setFirstLogin] = useState(1);

  const [showModalPergunta, setShowModalPergunta] = useState(false);

  const handleCloseModalPergunta = () => setShowModalPergunta(false);
  const handleShowModalPergunta = () => setShowModalPergunta(true);

  const [showModalLogin, setShowModalLogin] = useState(true);

  const handleCloseModalLogin = () => {
    setShowModalLogin(false);
    setFirstLogin(0);
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
                  <ModalPergunta show={showModalPergunta} onHide={handleCloseModalPergunta} click={handleCloseModalPergunta} />
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

          {firstLogin === 1 ? <ModalLogin show={showModalLogin} onHide={handleCloseModalLogin} click={handleCloseModalLogin} /> : null}
        </div>
      </div>
    </>
  );
}

export default Home;

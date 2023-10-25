import React, { useState } from "react";
import * as Icon from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ModalLogin from "../components/modalLogin";
import ModalPergunta from "../components/modalPergunta";
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

          {firstLogin === 1 ? (
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

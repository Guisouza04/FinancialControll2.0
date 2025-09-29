import { Link } from "react-router-dom";
import { useState } from "react";
import MenuNavecacao from "../../components/Nav";
import Cards from "../../components/Card";
import TituloPage from "../../components/Title";
import { ContainerCards } from "./styles";
import { Container } from "./styles";
import { ModalOverlay } from "./styles";
import { ModalContent } from "./styles";
import { ModalTitle } from "./styles";
import { ModalText } from "./styles";
import { ModalButtons } from "./styles";
import { CancelButton } from "./styles";
import { ConfirmButton } from "./styles";
import { Input } from "./styles";
import { Select } from "./styles";

function Dados() {
  const [showDadosModal, setShowDadosModal] = useState(false);
  const [salary, setSalary] = useState("");
  const [paymentDate, setPaymentDate] = useState("Todo 5º dia útil");
  const [customPeriod, setCustomPeriod] = useState("");

  const handleDadosClick = (e) => {
    e.preventDefault();
    setShowDadosModal(true);
  };

  const confirmDados = () => {
    if (!salary) {
      alert("Por favor, preencha o campo de salário!");
      return;
    }
    if (paymentDate === "Personalizado" && !customPeriod) {
      alert("Por favor, preencha o período de pagamento personalizado!");
      return;
    }
    // Aqui você pode adicionar lógica para enviar os dados
    setShowDadosModal(false);
    setSalary("");
    setPaymentDate("Todo 5º dia útil");
    setCustomPeriod("");
    alert("Dados salvos com sucesso!");
  };

  const cancelDados = () => {
    setShowDadosModal(false);
    setSalary("");
    setPaymentDate("Todo 5º dia útil");
    setCustomPeriod("");
  };

  return (
    <div className="frame">
      <MenuNavecacao />
      <Container>
        <TituloPage titulo="Dados" />
        <ContainerCards>
          <Link to="/perfil">
            <Cards
              variant="preencherFill"
              name="Perfil"
              svgContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  height="60px"
                  width="60px"
                >
                  <path
                    fill="#E5CCFF"
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              }
            />
          </Link>
          <Link to="/settings">
            <Cards
              variant="preencherFill"
              name="Configurações"
              svgContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  height="60px"
                  width="60px"
                >
                  <path
                    fill="#E5CCFF"
                    d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.65l-2-3.46a.5.5 0 0 0-.61-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-4a.5.5 0 0 0-.5.42l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.65l2.03 1.58c-.04.3-.06.61-.06.94s.02.64.06.94l-2.03 1.58a.5.5 0 0 0-.12.65l2 3.46a.5.5 0 0 0 .61.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h4a.5.5 0 0 0 .5-.42l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.65l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
                  />
                </svg>
              }
            />
          </Link>
          <div onClick={handleDadosClick} style={{ cursor: "pointer" }}>
            <Cards
              variant="preencherFill"
              name="Dados"
              svgContent={
                <svg
                  viewBox="0 0 24 24"
                  width="80px"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#e5ccff"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M19 7.24997H18.75V4.99997C18.7474 4.53665 18.5622 4.09305 18.2345 3.76543C17.9069 3.43781 17.4633 3.25259 17 3.24997C16.9207 3.23552 16.8393 3.23552 16.76 3.24997L4.86 7.24997H4.75H4.59L4.42 7.30997H4.28L4.12 7.39997L4 7.56997L3.86 7.68997L3.75 7.78997L3.63 7.93997C3.598 7.96867 3.57097 8.00246 3.55 8.03997C3.51288 8.09779 3.47948 8.15791 3.45 8.21997L3.39 8.32997C3.36216 8.40179 3.33878 8.47526 3.32 8.54997C3.3245 8.5865 3.3245 8.62344 3.32 8.65997C3.30967 8.77307 3.30967 8.88687 3.32 8.99997V19C3.3221 19.4515 3.49765 19.8849 3.81034 20.2106C4.12303 20.5364 4.54895 20.7295 5 20.75H19C19.4633 20.7473 19.9069 20.5621 20.2345 20.2345C20.5622 19.9069 20.7474 19.4633 20.75 19V8.99997C20.7474 8.53665 20.5622 8.09305 20.2345 7.76543C19.9069 7.43781 19.4633 7.25259 19 7.24997ZM17.08 4.75997C17.1293 4.77814 17.1719 4.81078 17.2022 4.85362C17.2325 4.89646 17.2492 4.94748 17.25 4.99997V7.24997H9.62L17.08 4.75997ZM19.25 19C19.25 19.0663 19.2237 19.1299 19.1768 19.1767C19.1299 19.2236 19.0663 19.25 19 19.25H5C4.9337 19.25 4.87011 19.2236 4.82322 19.1767C4.77634 19.1299 4.75 19.0663 4.75 19V8.99997C4.75 8.93367 4.77634 8.87008 4.82322 8.82319C4.87011 8.77631 4.9337 8.74997 5 8.74997H19C19.0663 8.74997 19.1299 8.77631 19.1768 8.82319C19.2237 8.87008 19.25 8.93367 19.25 8.99997V19Z"
                      fill="#e5ccff"
                    ></path>{" "}
                    <path
                      d="M16.5 15.25C17.1904 15.25 17.75 14.6904 17.75 14C17.75 13.3096 17.1904 12.75 16.5 12.75C15.8096 12.75 15.25 13.3096 15.25 14C15.25 14.6904 15.8096 15.25 16.5 15.25Z"
                      fill="#e5ccff"
                    ></path>{" "}
                  </g>
                </svg>
              }
            />
          </div>
        </ContainerCards>
      </Container>

      {/* Modal de Dados */}
      {showDadosModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Informações de Salário</ModalTitle>
            <ModalText>
              Preencha os campos abaixo para configurar seus dados.
            </ModalText>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <Input
                type="number"
                placeholder="Salário"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
              <Select
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              >
                <option value="Todo 5º dia útil">Todo 5º dia útil</option>
                <option value="Quinzenal">Quinzenal</option>
                <option value="Todo dia 5">Todo dia 5</option>
                <option value="Personalizado">Personalizado</option>
              </Select>
              {paymentDate === "Personalizado" && (
                <Input
                  type="text"
                  placeholder="Qual a sua data de Pagamento?"
                  value={customPeriod}
                  onChange={(e) => setCustomPeriod(e.target.value)}
                />
              )}
            </div>
            <ModalButtons>
              <CancelButton onClick={cancelDados}>Cancelar</CancelButton>
              <ConfirmButton onClick={confirmDados}>Confirmar</ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}

export default Dados;

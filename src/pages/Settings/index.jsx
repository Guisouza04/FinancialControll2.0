import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MenuNavecacao from "../../components/Nav";
import Cards from "../../components/Card";
import TituloPage from "../../components/Title";
import Select from "../../components/Select";
import { ContainerCards } from "./styles";
import { Container } from "./styles";
import { ModalContent } from "./styles";
import { ModalTitle } from "./styles";
import { ModalText } from "./styles";
import { ModalButtons } from "./styles";
import RequiredField from "../../components/RequiredField";
import { useToast } from "../../context/toast";
import {
  formatDigitsAsBRL,
  digitsToApiValue,
  hasPositiveValue,
} from "../../utils/currency";

function Config() {
  const toast = useToast();
  const navigate = useNavigate();

  // Modal de Perfil
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [perfilData, setPerfilData] = useState({
    nome: "",
    apelido: "",
    email: "",
  });

  // Modal de Dados (salário)
  const [showDadosModal, setShowDadosModal] = useState(false);
  // String de dígitos (centavos) — mesma máscara BRL do ExpenseBox.
  const [salaryDigits, setSalaryDigits] = useState("");
  const [paymentDate, setPaymentDate] = useState("Todo 5º dia útil");
  const [customPeriod, setCustomPeriod] = useState("");

  // Modal de Alterar Senha
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Modal de Sair
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // ------- Perfil -------
  const handlePerfilClick = () => setShowPerfilModal(true);

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfilData((prev) => ({ ...prev, [name]: value }));
  };

  const confirmPerfil = async () => {
    if (!perfilData.nome || !perfilData.email) {
      toast.warning("Por favor, preencha nome e e-mail!");
      return;
    }
    try {
      await api.put("/security/profile", perfilData);
      setShowPerfilModal(false);
      setPerfilData({ nome: "", apelido: "", email: "" });
      toast.success("Dados salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      toast.error(
        err.response?.data?.error || "Erro ao salvar os dados. Tente novamente."
      );
    }
  };

  const cancelPerfil = () => {
    setShowPerfilModal(false);
    setPerfilData({ nome: "", apelido: "", email: "" });
  };

  // ------- Dados (salário) -------
  const handleDadosClick = (e) => {
    e.preventDefault();
    setShowDadosModal(true);
  };

  const confirmDados = async () => {
    if (!hasPositiveValue(salaryDigits)) {
      toast.warning("Por favor, preencha o campo de salário!");
      return;
    }
    if (paymentDate === "Personalizado" && !customPeriod) {
      toast.warning("Por favor, preencha o período de pagamento personalizado!");
      return;
    }
    try {
      await api.post("/financas/salary", {
        // Backend espera string com ponto decimal ("3500.00").
        salario: digitsToApiValue(salaryDigits),
        periodo_pagamento:
          paymentDate === "Personalizado" ? customPeriod : paymentDate,
      });
      setShowDadosModal(false);
      setSalaryDigits("");
      setPaymentDate("Todo 5º dia útil");
      setCustomPeriod("");
      toast.success("Dados salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
      toast.error(
        err.response?.data?.error || "Erro ao salvar os dados. Tente novamente."
      );
    }
  };

  const cancelDados = () => {
    setShowDadosModal(false);
    setSalaryDigits("");
    setPaymentDate("Todo 5º dia útil");
    setCustomPeriod("");
  };

  // ------- Alterar senha -------
  const handleChangePasswordClick = (e) => {
    e.preventDefault();
    setShowPasswordModal(true);
  };

  const confirmChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.warning("Por favor, preencha todos os campos!");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.warning("As novas senhas não coincidem!");
      return;
    }
    try {
      await api.put("/security/change-password", {
        oldPassword,
        newPassword,
      });
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      toast.success("Senha alterada com sucesso!");
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      toast.error(
        err.response?.data?.error ||
          "Erro ao alterar a senha. Tente novamente."
      );
    }
  };

  const cancelChangePassword = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // ------- Sair -------
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmLogout = () => {
    setShowConfirmModal(false);
    localStorage.removeItem('authToken');
    navigate("/Login");
  };

  const cancelLogout = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="frame">
      <MenuNavecacao />
      <Container>
        <TituloPage titulo="Configurações" />
        <ContainerCards>
          <div onClick={handlePerfilClick} style={{ cursor: "pointer" }}>
            <Cards
              name="Perfil"
              subtitle="Nome, apelido e e-mail"
              hint="Editar"
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
          </div>

          <div onClick={handleDadosClick} style={{ cursor: "pointer" }}>
            <Cards
              name="Dados"
              subtitle="Salário e período de pagamento"
              hint="Configurar"
              svgContent={
                <svg
                  viewBox="0 0 24 24"
                  width="80px"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#e5ccff"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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

          <div
            onClick={handleChangePasswordClick}
            style={{ cursor: "pointer" }}
          >
            <Cards
              name="Alterar Senha"
              subtitle="Senha de acesso à conta"
              hint="Atualizar"
              svgContent={
                <svg
                  viewBox="0 0 24 24"
                  height="80px"
                  width="80px"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.149 17.5467L6.778 18.9217L5 17.1387L11.388 10.7387C10.5317 8.96445 11.0948 6.83093 12.715 5.71029C14.3353 4.58965 16.5303 4.8156 17.8882 6.24281C19.2462 7.67002 19.3628 9.8735 18.1631 11.4361C16.9633 12.9987 14.8045 13.455 13.075 12.5117L9.563 16.0337L11.03 17.5057L9.569 18.9707L8.149 17.5467Z"
                      fill="none"
                      stroke="#E5CCFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.128 7.85071C16.7515 8.47602 16.7506 9.48824 16.1258 10.1124C15.5011 10.7365 14.4889 10.7365 13.8642 10.1124C13.2395 9.48824 13.2385 8.47602 13.862 7.85071C14.4893 7.22864 15.5008 7.22864 16.128 7.85071Z"
                      fill="none"
                      stroke="#E5CCFF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              }
            />
          </div>

          <div onClick={handleLogoutClick} style={{ cursor: "pointer" }}>
            <Cards
              name="Sair"
              subtitle="Encerrar a sessão"
              hint="Pede confirmação"
              svgContent={
                <svg
                  viewBox="0 0 24 24"
                  height="65px"
                  width="65px"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M15 16.5V19C15 20.1046 14.1046 21 13 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3H13C14.1046 3 15 3.89543 15 5V8.0625M11 12H21M21 12L18.5 9.5M21 12L18.5 14.5"
                      fill="none"
                      stroke="#E5CCFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              }
            />
          </div>
        </ContainerCards>
      </Container>

      {/* Modal de Perfil */}
      {showPerfilModal && (
        <div className="modalOverlay">
          <ModalContent className="defaultModal">
            <ModalTitle>Seus Dados</ModalTitle>
            <ModalText>Atualize suas informações de perfil.</ModalText>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <RequiredField>
                <input
                  type="text"
                  name="nome"
                  placeholder="Seu nome completo"
                  value={perfilData.nome}
                  onChange={handlePerfilChange}
                />
              </RequiredField>
              <input
                type="text"
                name="apelido"
                placeholder="Como você gostaria de ser chamado?"
                value={perfilData.apelido}
                onChange={handlePerfilChange}
              />
              <RequiredField>
                <input
                  type="email"
                  name="email"
                  placeholder="Seu melhor E-mail"
                  value={perfilData.email}
                  onChange={handlePerfilChange}
                />
              </RequiredField>
            </div>
            <ModalButtons>
              <button className="button3" onClick={cancelPerfil}>
                Cancelar
              </button>
              <button className="button2" onClick={confirmPerfil}>
                Salvar
              </button>
            </ModalButtons>
          </ModalContent>
        </div>
      )}

      {/* Modal de Dados (salário) */}
      {showDadosModal && (
        <div className="modalOverlay">
          <ModalContent className="defaultModal">
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
              <RequiredField>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="R$ 0,00"
                  value={formatDigitsAsBRL(salaryDigits)}
                  onChange={(e) =>
                    setSalaryDigits(e.target.value.replace(/\D/g, ""))
                  }
                />
              </RequiredField>
              <Select
                value={paymentDate}
                onChange={setPaymentDate}
                options={[
                  { value: "Todo 5º dia útil", label: "Todo 5º dia útil" },
                  { value: "Quinzenal", label: "Quinzenal" },
                  { value: "Todo dia 5", label: "Todo dia 5" },
                  { value: "Personalizado", label: "Personalizado" },
                ]}
              />

              {paymentDate === "Personalizado" && (
                <RequiredField>
                  <input
                    type="text"
                    placeholder="Qual a sua data de Pagamento?"
                    value={customPeriod}
                    onChange={(e) => setCustomPeriod(e.target.value)}
                  />
                </RequiredField>
              )}
            </div>
            <ModalButtons>
              <button className="button3" onClick={cancelDados}>
                Cancelar
              </button>
              <button className="button2" onClick={confirmDados}>
                Confirmar
              </button>
            </ModalButtons>
          </ModalContent>
        </div>
      )}

      {/* Modal de Alteração de Senha */}
      {showPasswordModal && (
        <div className="modalOverlay">
          <ModalContent className="defaultModal">
            <ModalTitle>Alterar Senha</ModalTitle>
            <ModalText>
              Preencha os campos abaixo para alterar sua senha.
            </ModalText>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <RequiredField>
                <input
                  type="password"
                  placeholder="Senha Antiga"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </RequiredField>
              <RequiredField>
                <input
                  type="password"
                  placeholder="Nova Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </RequiredField>
              <RequiredField>
                <input
                  type="password"
                  placeholder="Confirmar Nova Senha"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </RequiredField>
            </div>
            <ModalButtons>
              <button className="button3" onClick={cancelChangePassword}>
                Cancelar
              </button>
              <button className="button2" onClick={confirmChangePassword}>
                Confirmar
              </button>
            </ModalButtons>
          </ModalContent>
        </div>
      )}

      {/* Modal de Confirmação de Logout */}
      {showConfirmModal && (
        <div className="modalOverlay">
          <ModalContent className="defaultModal">
            <ModalTitle>Deseja realmente sair?</ModalTitle>
            <ModalText>Tem certeza de que deseja sair do sistema?</ModalText>
            <ModalButtons>
              <button className="button3" onClick={cancelLogout}>
                Cancelar
              </button>
              <button className="button2" onClick={confirmLogout}>
                Sair
              </button>
            </ModalButtons>
          </ModalContent>
        </div>
      )}
    </div>
  );
}

export default Config;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuNavecacao from "../../components/Nav";
import BotaoPadrao from "../../components/Button";
import Cards from "../../components/Card";
import TituloPage from "../../components/Title";
import { ContainerCards } from "./styles";
import { Container } from "./styles";
import { ModalContent } from "./styles";
import { ModalTitle } from "./styles";
import { ModalText } from "./styles";
import { ModalButtons } from "./styles";

function Config() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

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

  const handleChangePasswordClick = (e) => {
    e.preventDefault();
    setShowPasswordModal(true);
  };

  const confirmChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      alert("As novas senhas não coincidem!");
      return;
    }
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    // Aqui você pode adicionar lógica para enviar a solicitação de alteração de senha
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    alert("Senha alterada com sucesso!");
  };

  const cancelChangePassword = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div className="frame">
      <MenuNavecacao />
      <Container>
        <TituloPage titulo="Dados > Configurações" />
        <ContainerCards>
          <div
            onClick={handleChangePasswordClick}
            style={{ cursor: "pointer" }}
          >
            <Cards
              name="Alterar Senha"
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

        <Link to="/Dados">
          <BotaoPadrao nomeBotao={"Voltar"} variant={"centered"} />
        </Link>
      </Container>

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
              <input
                type="password"
                placeholder="Senha Antiga"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Nova Senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmar Nova Senha"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
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
    </div>
  );
}

export default Config;

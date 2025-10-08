import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dados from "./pages/Dados";
import Perfil from "./pages/Perfil";
import TelaLogin from "./pages/Login";
import Config from "./pages/Settings";
import Despesas from "./pages/Despesas";
import Contas from "./pages/Contas";
import Investments from "./pages/Investments";
import Optional from "./pages/Optional";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tela de Dashboards */}
        <Route path="/" element={<Home />} />
        {/* Tela de Dados */}
        <Route path="/dados" element={<Dados />} />
        {/* Tela de Configurações */}
        <Route path="/Settings" element={<Config />} />
        {/* Tela de Perfil */}
        <Route path="/Perfil" element={<Perfil />} />
        {/* Tela de Login */}
        <Route path="/Login" element={<TelaLogin />} />
        {/* Tela de Despesas */}
        <Route path="/Despesas" element={<Despesas />} />
        {/* Tela de Contas */}
        <Route path="/Contas" element={<Contas />} />
        {/* Tela de Investimentos */}
        <Route path="/Investments" element={<Investments />} />
        {/* Tela de Opcionais */}
        <Route path="/Optional" element={<Optional />} />
        {/* Tela "Not Foud" - Não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

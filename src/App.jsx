import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import TelaLogin from "./pages/Login";
import Config from "./pages/Settings";
import Despesas from "./pages/Despesas";
import Contas from "./pages/Contas";
import Investments from "./pages/Investments";
import Optional from "./pages/Optional";
import Metas from "./pages/Metas";
import ImportarExtrato from "./pages/ImportarExtrato";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/Private/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tela de Dashboards */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        {/* "/dados" foi absorvida por Configurações — o card de Dados (salário)
            virou um dos cards de lá. Redireciona em vez de 404 porque links
            antigos (ex.: o aviso de salário no Dashboard) ainda apontam pra cá. */}
        <Route
          path="/dados"
          element={
            <PrivateRoute>
              <Navigate to="/Settings" replace />
            </PrivateRoute>
          }
        />
        {/* Tela de Configurações (Perfil, Dados, Alterar Senha, Sair) */}
        <Route
          path="/Settings"
          element={
            <PrivateRoute>
              <Config />
            </PrivateRoute>
          }
        />
        {/* Tela de Login */}
        <Route path="/Login" element={<TelaLogin />} />
        {/* Tela de Finanças (hub: Contas, Investimentos, Opcionais) */}
        <Route
          path="/Financas"
          element={
            <PrivateRoute>
              <Despesas />
            </PrivateRoute>
          }
        />
        {/* Tela de Contas */}
        <Route
          path="/Contas"
          element={
            <PrivateRoute>
              <Contas />
            </PrivateRoute>
          }
        />
        {/* Tela de Investimentos */}
        <Route
          path="/Investments"
          element={
            <PrivateRoute>
              <Investments />
            </PrivateRoute>
          }
        />
        {/* Tela de Opcionais */}
        <Route
          path="/Optional"
          element={
            <PrivateRoute>
              <Optional />
            </PrivateRoute>
          }
        />
        {/* Tela de Metas — path minúsculo: o Nav aponta para "/metas" e o
            React Router diferencia maiúsculas de minúsculas. */}
        <Route
          path="/metas"
          element={
            <PrivateRoute>
              <Metas />
            </PrivateRoute>
          }
        />
        {/* Importação de extrato (OFX) */}
        <Route
          path="/importar"
          element={
            <PrivateRoute>
              <ImportarExtrato />
            </PrivateRoute>
          }
        />
        {/* Tela "Not Foud" - Não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

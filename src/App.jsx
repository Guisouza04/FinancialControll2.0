import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dados from "./pages/Dados";
import TelaLogin from "./pages/Login";
import Config from "./pages/Settings";
import Despesas from "./pages/Despesas";
import Contas from "./pages/Contas";
import Investments from "./pages/Investments";
import Optional from "./pages/Optional";
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
        {/* Tela de Dados */}
        <Route
          path="/dados"
          element={
            <PrivateRoute>
              <Dados />
            </PrivateRoute>
          }
        />
        {/* Tela de Configurações */}
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
        {/* Tela "Not Foud" - Não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

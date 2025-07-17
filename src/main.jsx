import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext.jsx";

import App from "./App.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import VagasPage from "./pages/Vagas/VagasPage.jsx";
import DetalheVagaPage from "./pages/DetalheVaga/DetalheVagaPage.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import OpcaoCadastroPage from "./pages/Cadastro/OpcaoCadastroPage.jsx";
import CadastroCandidatoPage from "./pages/Cadastro/CadastroCandidatoPage.jsx";
import CadastroEmpresaPage from "./pages/Cadastro/CadastroEmpresaPage.jsx";
import CriarVagaPage from "./pages/CriarVaga/CriarVagaPage.jsx";
import EmpresaDashboardPage from "./pages/EmpresaDashboard/EmpresaDashboardPage.jsx";
import PerfilPage from "./pages/Perfil/PerfilPage.jsx";
import CandidatosVagaPage from "./pages/CandidatosVaga/CandidatosVagaPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import DetalheCandidatoPage from "./pages/DetalheCandidato/DetalheCandidatoPage.jsx";
import PerfilEmpresaPage from "./pages/PerfilEmpresa/PerfilEmpresaPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPassword/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPassword/ResetPasswordPage.jsx";
import MinhasCandidaturasPage from "./pages/MinhasCandidaturas/MinhasCandidaturasPage.jsx";
import ParaEmpresasPage from "./pages/ParaEmpresas/ParaEmpresasPage.jsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "vagas",
        element: <VagasPage />,
      },
      {
        path: "vagas/:vagaId",
        element: <DetalheVagaPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "cadastro",
        element: <OpcaoCadastroPage />,
      },
      {
        path: "cadastro/candidato",
        element: <CadastroCandidatoPage />,
      },
      {
        path: "cadastro/empresa",
        element: <CadastroEmpresaPage />,
      },
      {
        path: "empresas",
        element: <ParaEmpresasPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPasswordPage />,
      },
      {
        path: "vagas/nova",
        element: (
          <ProtectedRoute allowedRoles={["EMPRESA"]}>
            <CriarVagaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "empresa/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["EMPRESA"]}>
            <EmpresaDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil",
        element: (
          <ProtectedRoute allowedRoles={["CANDIDATO"]}>
            <PerfilPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vaga/:vagaId/candidatos",
        element: (
          <ProtectedRoute allowedRoles={["EMPRESA"]}>
            <CandidatosVagaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "candidato/:candidatoId",
        element: (
          <ProtectedRoute allowedRoles={["EMPRESA"]}>
            <DetalheCandidatoPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vagas/editar/:vagaId",
        element: (
          <ProtectedRoute allowedRoles={["EMPRESA"]}>
            <CriarVagaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "empresa/perfil",
        element: (
          <ProtectedRoute allowedRoles={["EMPRESA"]}>
            <PerfilEmpresaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "minhas-candidaturas",
        element: (
          <ProtectedRoute allowedRoles={["CANDIDATO"]}>
            <MinhasCandidaturasPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-brand-orange"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const ZapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-brand-orange"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-brand-orange"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

function ParaEmpresasPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleAnunciarVagaClick = () => {
    if (isAuthenticated && user?.tipoUsuario === "EMPRESA") {
      navigate("/vagas/nova"); // Rota para empresas logadas
    } else {
      navigate("/login"); // Rota para visitantes ou candidatos
    }
  };

  return (
    <div className="bg-white">
      <section className="bg-brand-blue text-white">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Encontre os Talentos Certos em Camaçari.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Publique suas vagas e conecte-se com profissionais qualificados da
            nossa região de forma simples, rápida e direta.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleAnunciarVagaClick}
              className="inline-block bg-brand-orange text-white font-bold rounded-lg px-8 py-4 text-lg hover:opacity-90 transition-opacity"
            >
              Anunciar Vaga Agora
            </button>
            <Link
              to="/planos"
              className="inline-block bg-transparent border-2 border-white text-white font-bold rounded-lg px-8 py-4 text-lg hover:bg-white hover:text-brand-blue transition-colors"
            >
              Ver Nossos Planos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">
              Por que Anunciar no Quero Vagas?
            </h2>
            <p className="text-slate-600 mt-2">
              Nossa plataforma foi feita para a realidade local.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <TargetIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">Foco Local</h3>
              <p className="text-slate-600">
                Alcance candidatos que realmente vivem e querem trabalhar em
                Camaçari e região, otimizando seu processo seletivo.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <ZapIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">Publicação Rápida</h3>
              <p className="text-slate-600">
                Crie e publique sua vaga em menos de 5 minutos com nosso
                formulário simples e intuitivo.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <DashboardIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">
                Gerenciamento Centralizado
              </h3>
              <p className="text-slate-600">
                Receba e gerencie todas as candidaturas em um painel de controle
                único, alterando o status de cada candidato com facilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-blue">
            Pronto para encontrar seu próximo colaborador?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Junte-se às empresas que estão construindo o futuro de Camaçari.
          </p>
          <Link
            to="/planos"
            className="mt-8 inline-block bg-brand-purple text-white font-bold rounded-lg px-10 py-4 text-lg hover:opacity-90 transition-opacity"
          >
            Conheça Nossos Planos
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ParaEmpresasPage;

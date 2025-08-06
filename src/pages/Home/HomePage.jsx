import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import JobCard from "../../components/JobCard/JobCard";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-brand-purple"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const UserPlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-brand-purple"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
);
const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-12 w-12 text-brand-purple"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

function HomePage() {
  const [recentesVagas, setRecentesVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentesVagas = async () => {
      try {
        const response = await api.get("/vagas?limit=6");
        setRecentesVagas(response.data.vagas);
      } catch (error) {
        toast.error("Não foi possível carregar as vagas recentes.");
        console.error("Erro ao buscar vagas recentes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentesVagas();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (termoBusca.trim()) {
      navigate(`/vagas?termoBusca=${encodeURIComponent(termoBusca)}`);
    } else {
      navigate("/vagas");
    }
  };

  return (
    <div className="space-y-16 md:space-y-24">
      <section className="bg-slate-100">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-brand-blue leading-tight">
            O seu sucesso profissional começa em Camaçari.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Conectamos os melhores talentos locais com as oportunidades de
            carreira mais promissoras da nossa cidade.
          </p>
          <form
            onSubmit={handleSearch}
            className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Digite o cargo ou palavra-chave"
              className="w-full px-5 py-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent transition"
            />
            <button
              type="submit"
              className="bg-brand-purple text-white font-bold rounded-lg px-8 py-4 text-lg hover:opacity-90 transition-opacity"
            >
              Buscar Vagas
            </button>
          </form>
        </div>
      </section>

      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-brand-blue mb-12">
          Vagas Recentes
        </h2>
        {loading ? (
          <p className="text-center">Carregando vagas...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentesVagas.map((vaga) => (
              <JobCard key={vaga.id} vaga={vaga} />
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link
            to="/vagas"
            className="bg-brand-orange text-white font-bold rounded-lg px-8 py-3 text-lg hover:opacity-90 transition-opacity"
          >
            Ver Todas as Vagas
          </Link>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-brand-blue mb-12">
            Simples e Direto ao Ponto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <SearchIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">1. Encontre</h3>
              <p className="text-slate-600">
                Busque e filtre entre dezenas de vagas para encontrar a
                oportunidade perfeita para você.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <UserPlusIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">2. Cadastre-se</h3>
              <p className="text-slate-600">
                Crie seu perfil profissional em minutos e mostre seu potencial
                para as melhores empresas.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircleIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">3. Candidate-se</h3>
              <p className="text-slate-600">
                Envie sua candidatura com apenas um clique e acompanhe o status
                do processo seletivo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

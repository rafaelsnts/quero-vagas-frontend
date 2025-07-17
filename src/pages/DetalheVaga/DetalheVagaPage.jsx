import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { toast } from "react-toastify";
import api from "../../services/api.js";

function DetalheVagaPage() {
  const { vagaId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchVaga = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/vagas/${vagaId}`);
        setVaga(response.data);
      } catch (error) {
        toast.error("Vaga não encontrada ou erro ao carregar.");
        console.error("Erro ao buscar detalhes da vaga:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVaga();
  }, [vagaId]);

  const handleCandidatura = async () => {
    try {
      await api.post(`/vagas/${vaga.id}/candidatar`);
      toast.success("Candidatura enviada com sucesso! Boa sorte!");
      setHasApplied(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Não foi possível se candidatar."
      );
      if (error.response?.status === 409) {
        setHasApplied(true);
      }
      console.error(error);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-lg text-slate-500">
        Carregando detalhes da vaga...
      </p>
    );
  }

  if (!vaga) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Vaga não encontrada!
        </h1>
        <Link
          to="/vagas"
          className="text-brand-purple hover:underline mt-4 inline-block"
        >
          Voltar para a lista de vagas
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl bg-white p-8 rounded-lg shadow-lg">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-4xl font-extrabold text-brand-blue">
          {vaga.titulo}
        </h1>
        <p className="text-xl text-slate-700 mt-2">{vaga.empresa.nome}</p>
        <p className="text-md text-slate-500 mt-1">{vaga.localizacao}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-brand-blue mb-4">
            Descrição da Vaga
          </h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {vaga.descricao}
          </p>

          <h2 className="text-2xl font-bold text-brand-blue mt-8 mb-4">
            Requisitos
          </h2>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {vaga.requisitos}
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-brand-blue mb-4">Resumo</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-600">Salário</p>
              <p className="text-md font-bold text-brand-purple">
                {vaga.salario || "A combinar"}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Modalidade</p>
              <p className="text-md font-bold text-slate-800">
                {vaga.modalidade}
              </p>
            </div>

            <div className="mt-4">
              {isAuthenticated ? (
                user.tipoUsuario === "CANDIDATO" ? (
                  <button
                    onClick={handleCandidatura}
                    disabled={hasApplied}
                    className="w-full bg-brand-orange text-white font-bold rounded-lg py-3 hover:opacity-90 disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                    {hasApplied ? "Candidatura Enviada" : "Quero me Candidatar"}
                  </button>
                ) : (
                  <p className="text-sm text-center text-slate-500">
                    Apenas candidatos podem se aplicar a vagas.
                  </p>
                )
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-brand-orange text-white font-bold rounded-lg py-3 hover:opacity-90"
                >
                  Faça Login para se Candidatar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalheVagaPage;

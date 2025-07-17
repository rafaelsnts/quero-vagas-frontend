import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

function CandidatosVagaPage() {
  const { vagaId } = useParams();
  const [candidaturas, setCandidaturas] = useState([]);
  const [vagaInfo, setVagaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vagaResponse, candidaturasResponse] = await Promise.all([
          api.get(`/vagas/${vagaId}`),
          api.get(`/vagas/${vagaId}/candidatos`),
        ]);
        setVagaInfo(vagaResponse.data);
        setCandidaturas(candidaturasResponse.data);
      } catch (error) {
        toast.error("Erro ao carregar dados da vaga.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [vagaId]);

  const handleStatusChange = async (candidaturaId, novoStatus) => {
    try {
      const response = await api.put(`/candidaturas/${candidaturaId}/status`, {
        status: novoStatus,
      });

      setCandidaturas(
        candidaturas.map((c) =>
          c.id === candidaturaId ? { ...c, status: response.data.status } : c
        )
      );

      toast.success("Status do candidato atualizado!");
    } catch (error) {
      toast.error("Não foi possível atualizar o status.");
      console.error("Erro ao atualizar status:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "APROVADO_ENTREVISTA":
        return "bg-green-100 text-green-800";
      case "EM_ANALISE":
        return "bg-yellow-100 text-yellow-800";
      case "REPROVADO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) return <p className="text-center">Carregando candidatos...</p>;

  return (
    <div className="container mx-auto">
      <Link
        to="/empresa/dashboard"
        className="text-brand-purple hover:underline mb-4 inline-block"
      >
        &larr; Voltar para o painel
      </Link>
      <h1 className="text-3xl font-bold text-brand-blue">
        Candidatos para a Vaga:
      </h1>
      <h2 className="text-2xl font-semibold text-slate-700 mb-8">
        {vagaInfo?.titulo}
      </h2>

      {candidaturas.length === 0 ? (
        <p className="text-center bg-white p-8 rounded-lg shadow text-slate-500">
          Ainda não há candidatos para esta vaga.
        </p>
      ) : (
        <div className="bg-white p-2 rounded-lg shadow space-y-2">
          {candidaturas.map((candidatura) => (
            <div
              key={candidatura.id}
              className="p-4 border-b last:border-b-0 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {candidatura.candidato.nome}
                </h3>
                <p className="text-md text-slate-600">
                  {candidatura.candidato.email}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClass(
                      candidatura.status
                    )}`}
                  >
                    {candidatura.status.replace("_", " ")}
                  </span>
                  <select
                    value={candidatura.status}
                    onChange={(e) =>
                      handleStatusChange(candidatura.id, e.target.value)
                    }
                    className="p-1 border border-slate-300 rounded-md bg-white text-sm focus:ring-2 focus:ring-brand-purple"
                  >
                    <option value="RECEBIDA">Recebida</option>
                    <option value="EM_ANALISE">Em Análise</option>
                    <option value="APROVADO_ENTREVISTA">
                      Aprovado para Entrevista
                    </option>
                    <option value="REPROVADO">Reprovado</option>
                    <option value="CONTRATADO">Contratado</option>
                  </select>
                </div>
                <Link
                  to={`/candidato/${candidatura.candidato.id}`}
                  className="text-sm font-bold text-brand-purple hover:underline"
                >
                  Ver Perfil &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CandidatosVagaPage;

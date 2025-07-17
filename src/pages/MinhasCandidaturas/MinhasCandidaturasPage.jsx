import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function MinhasCandidaturasPage() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidaturas = async () => {
      try {
        const response = await api.get("/candidaturas/minhas-candidaturas");
        setCandidaturas(response.data);
      } catch (error) {
        toast.error("Não foi possível carregar suas candidaturas.");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidaturas();
  }, []);

  const stats = useMemo(() => {
    if (!candidaturas || candidaturas.length === 0) {
      return { total: 0, emAnalise: 0, aprovado: 0 };
    }
    return {
      total: candidaturas.length,
      emAnalise: candidaturas.filter((c) => c.status === "EM_ANALISE").length,
      aprovado: candidaturas.filter((c) => c.status === "APROVADO_ENTREVISTA")
        .length,
    };
  }, [candidaturas]);

  const chartData = useMemo(
    () =>
      [
        {
          name: "Recebidas",
          value: candidaturas.filter((c) => c.status === "RECEBIDA").length,
        },
        { name: "Em Análise", value: stats.emAnalise },
        { name: "Aprovado p/ Entrevista", value: stats.aprovado },
        {
          name: "Reprovado",
          value: candidaturas.filter((c) => c.status === "REPROVADO").length,
        },
        {
          name: "Contratado",
          value: candidaturas.filter((c) => c.status === "CONTRATADO").length,
        },
      ].filter((item) => item.value > 0),
    [candidaturas, stats]
  );

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#5D3FD3"];

  const getStatusClass = (status) => {
    switch (status) {
      case "APROVADO_ENTREVISTA":
        return "bg-green-100 text-green-800";
      case "EM_ANALISE":
        return "bg-yellow-100 text-yellow-800";
      case "REPROVADO":
        return "bg-red-100 text-red-800";
      case "CONTRATADO":
        return "bg-blue-600 text-white";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading)
    return <p className="text-center">Carregando seu dashboard...</p>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-brand-blue mb-8">
        Meu Dashboard de Candidaturas
      </h1>

      {candidaturas.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-slate-600">
            Você ainda não se aplicou a nenhuma vaga.
          </p>
          <Link
            to="/vagas"
            className="text-brand-purple font-semibold hover:underline mt-2 inline-block"
          >
            Ver vagas abertas
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-sm text-slate-500">Total de Candidaturas</p>
              <p className="text-4xl font-bold text-brand-purple">
                {stats.total}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-sm text-slate-500">Em Análise</p>
              <p className="text-4xl font-bold text-yellow-500">
                {stats.emAnalise}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-sm text-slate-500">Aprovado para Entrevista</p>
              <p className="text-4xl font-bold text-green-500">
                {stats.aprovado}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-brand-blue mb-4 text-center">
                Resumo por Status
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-brand-blue mb-4">
                Minhas Candidaturas Recentes
              </h3>
              <div className="space-y-4">
                {candidaturas.map((candidatura) => (
                  <div
                    key={candidatura.id}
                    className="p-4 border-b last:border-b-0 flex justify-between items-center"
                  >
                    <div>
                      <Link
                        to={`/vagas/${candidatura.vaga.id}`}
                        className="hover:underline"
                      >
                        <h2 className="text-lg font-bold text-brand-blue">
                          {candidatura.vaga.titulo}
                        </h2>
                      </Link>
                      <p className="text-md text-slate-600">
                        {candidatura.vaga.empresa.nome}
                      </p>
                      <p className="text-sm text-slate-500">
                        Enviada em:{" "}
                        {new Date(candidatura.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold px-4 py-1.5 rounded-full ${getStatusClass(
                        candidatura.status
                      )}`}
                    >
                      {candidatura.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MinhasCandidaturasPage;

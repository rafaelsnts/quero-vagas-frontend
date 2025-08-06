import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Importado
import JobCard from "../../components/JobCard/JobCard";
import api from "../../services/api";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination/Pagination.jsx";

function VagasPage() {
  const [searchParams, setSearchParams] = useSearchParams(); // Adicionado

  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [termoBusca, setTermoBusca] = useState(
    () => searchParams.get("termoBusca") || ""
  );
  const [filtroModalidade, setFiltroModalidade] = useState(
    () => searchParams.get("modalidade") || ""
  );
  const [paginaAtual, setPaginaAtual] = useState(() =>
    parseInt(searchParams.get("page") || "1")
  );

  const [totalPaginas, setTotalPaginas] = useState(0);
  const [debouncedTermoBusca, setDebouncedTermoBusca] = useState(termoBusca);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTermoBusca(termoBusca);
      if (termoBusca !== debouncedTermoBusca) {
        setPaginaAtual(1);
      }
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [termoBusca, debouncedTermoBusca]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedTermoBusca) {
      params.set("termoBusca", debouncedTermoBusca);
    }
    if (filtroModalidade) {
      params.set("modalidade", filtroModalidade);
    }
    if (paginaAtual > 1) {
      params.set("page", paginaAtual.toString());
    }
    setSearchParams(params, { replace: true });
  }, [debouncedTermoBusca, filtroModalidade, paginaAtual, setSearchParams]);

  useEffect(() => {
    const fetchVagas = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: paginaAtual,
          limit: 9,
        });
        if (debouncedTermoBusca) {
          params.append("termoBusca", debouncedTermoBusca);
        }
        if (filtroModalidade) {
          params.append("modalidade", filtroModalidade);
        }

        const response = await api.get(`/vagas?${params.toString()}`);
        console.log("DADOS RECEBIDOS PELA API:", response.data.vagas);

        setVagas(response.data.vagas);
        setTotalPaginas(response.data.totalPaginas);
      } catch (error) {
        console.error("Erro detalhado ao buscar vagas:", error);
        toast.error("Erro ao carregar vagas.");
      } finally {
        setLoading(false);
      }
    };
    fetchVagas();
  }, [paginaAtual, debouncedTermoBusca, filtroModalidade]);

  const limparFiltros = () => {
    setTermoBusca("");
    setFiltroModalidade("");
    setPaginaAtual(1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-blue text-center mb-6">
        Encontre sua Próxima Oportunidade
      </h1>

      <div className="p-4 bg-white rounded-lg shadow mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Buscar por cargo
            </label>
            <input
              type="text"
              placeholder="Ex: Desenvolvedor, Analista, Técnico..."
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Modalidade
            </label>
            <select
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              value={filtroModalidade}
              onChange={(e) => {
                setFiltroModalidade(e.target.value);
                setPaginaAtual(1);
              }}
            >
              <option value="">Todas</option>
              <option value="PRESENCIAL">Presencial</option>
              <option value="HIBRIDO">Híbrido</option>
              <option value="REMOTO">Remoto</option>
            </select>
          </div>
        </div>
        <button
          onClick={limparFiltros}
          className="text-sm text-slate-500 hover:underline mt-4"
        >
          Limpar filtros
        </button>
      </div>

      {loading ? (
        <p className="text-center text-slate-500 py-10">Carregando vagas...</p>
      ) : vagas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vagas.map((vaga) => (
            <JobCard key={vaga.id} vaga={vaga} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 py-10">
          Nenhuma vaga encontrada com os filtros selecionados.
        </p>
      )}

      {totalPaginas > 1 && (
        <Pagination
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onPageChange={setPaginaAtual}
        />
      )}
    </div>
  );
}

export default VagasPage;

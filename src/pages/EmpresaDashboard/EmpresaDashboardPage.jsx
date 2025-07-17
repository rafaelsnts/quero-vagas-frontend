import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api.js";
import ConfirmationModal from "../../components/Modal/ConfirmationModal.jsx";

function EmpresaDashboardPage() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vagaToDelete, setVagaToDelete] = useState(null);
  useEffect(() => {
    const fetchMinhasVagas = async () => {
      try {
        const response = await api.get("/vagas/minhas-vagas");
        setVagas(response.data);
      } catch (error) {
        toast.error("Não foi possível carregar suas vagas.");
      } finally {
        setLoading(false);
      }
    };
    fetchMinhasVagas();
  }, []);

  const openDeleteModal = (id) => {
    setVagaToDelete(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setVagaToDelete(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!vagaToDelete) return;
    try {
      await api.delete(`/vagas/${vagaToDelete}`);
      setVagas(vagas.filter((vaga) => vaga.id !== vagaToDelete));
      toast.success("Vaga excluída com sucesso!");
    } catch (error) {
      toast.error("Não foi possível excluir a vaga.");
    } finally {
      closeDeleteModal();
    }
  };

  if (loading)
    return (
      <p className="text-center text-slate-500">Carregando suas vagas...</p>
    );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-blue">
          Minhas Vagas Publicadas
        </h1>
        <Link
          to="/vagas/nova"
          className="bg-brand-orange text-white font-bold rounded-lg px-5 py-2 hover:opacity-90"
        >
          + Publicar Nova Vaga
        </Link>
      </div>

      {vagas.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-slate-600">
            Você ainda não publicou nenhuma vaga.
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          {vagas.map((vaga) => (
            <div
              key={vaga.id}
              className="flex justify-between items-center p-4 border-b last:border-b-0"
            >
              <div>
                <h2 className="text-xl font-bold text-brand-blue">
                  {vaga.titulo}
                </h2>
                <p className="text-sm text-slate-500">
                  {vaga.localizacao} - {vaga.modalidade}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to={`/vagas/editar/${vaga.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Editar
                </Link>
                <button
                  onClick={() => openDeleteModal(vaga.id)}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
                <Link
                  to={`/vaga/${vaga.id}/candidatos`}
                  className="text-sm font-bold text-brand-purple hover:underline"
                >
                  Ver Candidatos &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão de Vaga"
        message="Você tem certeza que deseja excluir esta vaga? Todas as candidaturas associadas a ela também serão removidas. Esta ação não pode ser desfeita."
      />
    </div>
  );
}

export default EmpresaDashboardPage;

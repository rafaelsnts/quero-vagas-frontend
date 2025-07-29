import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api.js";

function CriarVagaPage() {
  const { vagaId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    requisitos: "",
    salario: "",
    modalidade: "PRESENCIAL",
    localizacao: "",
  });

  const isEditing = Boolean(vagaId);

  useEffect(() => {
    if (isEditing) {
      const fetchVagaData = async () => {
        try {
          const response = await api.get(`/vagas/${vagaId}`);
          setFormData(response.data);
        } catch (error) {
          toast.error(
            "Não foi possível carregar os dados da vaga para edição."
          );
          navigate("/empresa/dashboard");
        }
      };
      fetchVagaData();
    }
  }, [vagaId, isEditing, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/vagas/${vagaId}`, formData);
        toast.success("Vaga atualizada com sucesso!");
      } else {
        await api.post("/vagas", formData);
        toast.success("Vaga publicada com sucesso!");
      }
      navigate("/empresa/dashboard");
    } catch (error) {
      console.error("Erro ao salvar vaga:", error);
      toast.error(
        error.response?.data?.message || "Não foi possível salvar a vaga."
      );
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">
            {isEditing ? "Editar Vaga" : "Publicar Nova Vaga"}
          </h1>
          <p className="text-slate-500 mt-2">
            {isEditing
              ? "Altere os detalhes da sua oportunidade abaixo."
              : "Preencha os detalhes da oportunidade."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Título da Vaga
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Descrição Completa
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows="5"
              className="w-full p-3 border border-slate-300 rounded-lg"
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="requisitos"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Requisitos
            </label>
            <textarea
              id="requisitos"
              name="requisitos"
              value={formData.requisitos}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-3 border border-slate-300 rounded-lg"
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="salario"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Salário (ou "A combinar")
              </label>
              <input
                type="text"
                id="salario"
                name="salario"
                value={formData.salario || ""}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="modalidade"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Modalidade
              </label>
              <select
                id="modalidade"
                name="modalidade"
                value={formData.modalidade}
                onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-lg bg-white"
              >
                <option value="PRESENCIAL">Presencial</option>
                <option value="HIBRIDO">Híbrido</option>
                <option value="REMOTO">Remoto</option>
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="localizacao"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Localização
            </label>
            <input
              type="text"
              id="localizacao"
              name="localizacao"
              value={formData.localizacao}
              onChange={handleChange}
              required
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-brand-orange text-white font-bold rounded-lg py-3 mt-4 hover:opacity-90"
            >
              {isEditing ? "Salvar Alterações" : "Publicar Vaga"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CriarVagaPage;

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/Modal/ConfirmationModal.jsx";

const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

function PerfilPage() {
  const { user } = useAuth();
  const [perfilCompleto, setPerfilCompleto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ resumo: "", habilidades: "" });

  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [newExperience, setNewExperience] = useState({
    cargo: "",
    empresa: "",
    dataInicio: "",
    dataFim: "",
    descricao: "",
  });

  const [showEducationForm, setShowEducationForm] = useState(false);
  const [newEducation, setNewEducation] = useState({
    instituicao: "",
    grau: "",
    curso: "",
    dataInicio: "",
    dataFim: "",
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    id: null,
    type: null,
  });

  const [editingExperienceId, setEditingExperienceId] = useState(null);
  const [editingExperienceData, setEditingExperienceData] = useState(null);

  const [editingEducationId, setEditingEducationId] = useState(null);
  const [editingEducationData, setEditingEducationData] = useState(null);

  const [curriculoFile, setCurriculoFile] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchPerfil = async () => {
        setLoading(true);
        try {
          const response = await api.get("/perfil/meu-perfil");
          setPerfilCompleto(response.data);
          setFormData({
            resumo: response.data.perfil?.resumo || "",
            habilidades: response.data.perfil?.habilidades || "",
          });
        } catch (error) {
          toast.error("Não foi possível carregar os dados do perfil.");
          console.error("Erro ao carregar perfil:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPerfil();
    }
  }, [user]);

  const handleFormChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/perfil/meu-perfil", formData);
      setPerfilCompleto((prev) => ({ ...prev, perfil: response.data }));
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Falha ao atualizar o perfil.");
    }
  };

  const handleExperienceChange = (e) =>
    setNewExperience((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...newExperience };
    if (!dataToSend.dataFim) delete dataToSend.dataFim;
    try {
      const response = await api.post("/perfil/experiencia", dataToSend);
      setPerfilCompleto((prev) => ({
        ...prev,
        experiencias: [response.data, ...prev.experiencias].sort(
          (a, b) => new Date(b.dataInicio) - new Date(a.dataInicio)
        ),
      }));
      toast.success("Experiência adicionada com sucesso!");
      setShowExperienceForm(false);
      setNewExperience({
        cargo: "",
        empresa: "",
        dataInicio: "",
        dataFim: "",
        descricao: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao adicionar experiência."
      );
    }
  };

  const handleEditExperienceClick = (experiencia) => {
    setEditingExperienceId(experiencia.id);
    setEditingExperienceData({
      ...experiencia,
      dataInicio: new Date(experiencia.dataInicio).toISOString().split("T")[0],
      dataFim: experiencia.dataFim
        ? new Date(experiencia.dataFim).toISOString().split("T")[0]
        : "",
    });
  };
  const handleCancelEditExperience = () => {
    setEditingExperienceId(null);
    setEditingExperienceData(null);
  };
  const handleEditingExperienceChange = (e) =>
    setEditingExperienceData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  const handleUpdateExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = { ...editingExperienceData };
      if (!dataToUpdate.dataFim) dataToUpdate.dataFim = null;
      const response = await api.put(
        `/perfil/experiencia/${editingExperienceId}`,
        dataToUpdate
      );
      setPerfilCompleto((prev) => ({
        ...prev,
        experiencias: prev.experiencias
          .map((exp) => (exp.id === editingExperienceId ? response.data : exp))
          .sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio)),
      }));
      toast.success("Experiência atualizada com sucesso!");
      handleCancelEditExperience();
    } catch (error) {
      toast.error("Não foi possível atualizar a experiência.");
    }
  };

  const handleEducationChange = (e) =>
    setNewEducation((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...newEducation };
    if (!dataToSend.dataFim) delete dataToSend.dataFim;
    try {
      const response = await api.post("/perfil/formacao", dataToSend);
      setPerfilCompleto((prev) => ({
        ...prev,
        formacoesAcademicas: [response.data, ...prev.formacoesAcademicas].sort(
          (a, b) => new Date(b.dataInicio) - new Date(a.dataInicio)
        ),
      }));
      toast.success("Formação adicionada com sucesso!");
      setShowEducationForm(false);
      setNewEducation({
        instituicao: "",
        grau: "",
        curso: "",
        dataInicio: "",
        dataFim: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao adicionar formação."
      );
    }
  };

  const handleEditEducationClick = (formacao) => {
    setEditingEducationId(formacao.id);
    setEditingEducationData({
      ...formacao,
      dataInicio: new Date(formacao.dataInicio).toISOString().split("T")[0],
      dataFim: formacao.dataFim
        ? new Date(formacao.dataFim).toISOString().split("T")[0]
        : "",
    });
  };
  const handleCancelEditEducation = () => {
    setEditingEducationId(null);
    setEditingEducationData(null);
  };
  const handleEditingEducationChange = (e) =>
    setEditingEducationData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  const handleUpdateEducationSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = { ...editingEducationData };
      if (!dataToUpdate.dataFim) dataToUpdate.dataFim = null;
      const response = await api.put(
        `/perfil/formacao/${editingEducationId}`,
        dataToUpdate
      );
      setPerfilCompleto((prev) => ({
        ...prev,
        formacoesAcademicas: prev.formacoesAcademicas
          .map((form) =>
            form.id === editingEducationId ? response.data : form
          )
          .sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio)),
      }));
      toast.success("Formação atualizada com sucesso!");
      handleCancelEditEducation();
    } catch (error) {
      toast.error("Não foi possível atualizar a formação.");
    }
  };

  const openDeleteModal = (id, type) =>
    setModalState({ isOpen: true, id, type });
  const closeDeleteModal = () =>
    setModalState({ isOpen: false, id: null, type: null });
  const handleConfirmDelete = async () => {
    const { id, type } = modalState;
    if (!id || !type) return;
    try {
      if (type === "experiencia") {
        await api.delete(`/perfil/experiencia/${id}`);
        setPerfilCompleto((prev) => ({
          ...prev,
          experiencias: prev.experiencias.filter((exp) => exp.id !== id),
        }));
        toast.success("Experiência excluída com sucesso!");
      } else if (type === "formacao") {
        await api.delete(`/perfil/formacao/${id}`);
        setPerfilCompleto((prev) => ({
          ...prev,
          formacoesAcademicas: prev.formacoesAcademicas.filter(
            (form) => form.id !== id
          ),
        }));
        toast.success("Formação excluída com sucesso!");
      }
    } catch (error) {
      toast.error(`Não foi possível excluir o item.`);
    } finally {
      closeDeleteModal();
    }
  };

  const handleFileChange = (e) => {
    setCurriculoFile(e.target.files[0]);
  };
  const handleCurriculoSubmit = async (e) => {
    e.preventDefault();
    if (!curriculoFile) {
      toast.warn("Por favor, selecione um arquivo primeiro.");
      return;
    }
    const formData = new FormData();
    formData.append("curriculo", curriculoFile);
    try {
      const response = await api.post("/perfil/curriculo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPerfilCompleto((prev) => ({ ...prev, perfil: response.data.perfil }));
      toast.success("Currículo enviado com sucesso!");
      setCurriculoFile(null);
      document.getElementById("curriculo-upload").value = null;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao enviar o currículo."
      );
    }
  };

  if (loading) return <p className="text-center">Carregando perfil...</p>;
  if (!perfilCompleto)
    return (
      <p className="text-center text-red-500">
        Não foi possível carregar o perfil.
      </p>
    );

  const { perfil, experiencias, formacoesAcademicas } = perfilCompleto;

  return (
    <div className="bg-slate-50">
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-brand-blue">{user.nome}</h1>
            <p className="text-slate-500">{user.email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full flex items-center justify-center bg-brand-purple text-white font-bold rounded-lg px-5 py-2 hover:opacity-90 transition-opacity"
            >
              <PencilIcon /> Editar Perfil
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-brand-blue border-b pb-2 mb-4">
              Contato & Mídia
            </h3>
            <div className="space-y-3 text-sm">
              {perfil?.linkedin && (
                <p className="flex items-center gap-2 text-slate-600">
                  <strong className="font-medium text-slate-800">
                    LinkedIn:
                  </strong>{" "}
                  <a
                    href={perfil.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver Perfil
                  </a>
                </p>
              )}
              {perfil?.curriculoUrl && (
                <p className="flex items-center gap-2 text-slate-600">
                  <strong className="font-medium text-slate-800">
                    Currículo:
                  </strong>{" "}
                  <a
                    href={`http://localhost:3001/files${perfil.curriculoUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-purple hover:underline"
                  >
                    Baixar Arquivo
                  </a>
                </p>
              )}
            </div>
          </div>
        </aside>

        <main className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-brand-blue mb-4">
              Resumo Profissional
            </h2>
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="resumo"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Resumo Profissional
                  </label>
                  <textarea
                    name="resumo"
                    id="resumo"
                    value={formData.resumo}
                    onChange={handleFormChange}
                    rows="5"
                    className="w-full p-3 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="habilidades"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Habilidades (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    name="habilidades"
                    id="habilidades"
                    value={formData.habilidades}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-slate-200 text-slate-800 font-bold rounded-lg px-5 py-2 hover:bg-slate-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-orange text-white font-bold rounded-lg px-5 py-2 hover:opacity-90"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-slate-600 break-words">
                {perfil?.resumo ||
                  "Clique em 'Editar Perfil' para adicionar um resumo."}
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-brand-blue mb-4">
              Habilidades
            </h2>
            <p className="text-slate-600 break-words">
              {perfil?.habilidades ||
                "Clique em 'Editar Perfil' para adicionar suas habilidades."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-brand-blue">
                Experiência Profissional
              </h2>
              <button
                onClick={() => setShowExperienceForm(true)}
                className="flex items-center gap-1 bg-brand-orange text-white text-sm font-bold rounded-lg px-3 py-1 hover:opacity-90"
              >
                <PlusIcon /> Adicionar
              </button>
            </div>
            {showExperienceForm && (
              <form
                onSubmit={handleExperienceSubmit}
                className="space-y-4 p-4 mb-6 border rounded-lg bg-slate-50"
              ></form>
            )}
            <div className="space-y-4">
              {experiencias?.length > 0 ? (
                experiencias.map((exp) => <div key={exp.id}></div>)
              ) : (
                <p className="text-slate-500">
                  Nenhuma experiência profissional adicionada.
                </p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-brand-blue">
                Formação Acadêmica
              </h2>
              <button
                onClick={() => setShowEducationForm(true)}
                className="flex items-center gap-1 bg-brand-orange text-white text-sm font-bold rounded-lg px-3 py-1 hover:opacity-90"
              >
                <PlusIcon /> Adicionar
              </button>
            </div>
            {showEducationForm && (
              <form
                onSubmit={handleEducationSubmit}
                className="space-y-4 p-4 mb-6 border rounded-lg bg-slate-50"
              ></form>
            )}
            <div className="space-y-4">
              {formacoesAcademicas?.length > 0 ? (
                formacoesAcademicas.map((form) => <div key={form.id}></div>)
              ) : (
                <p className="text-slate-500">Nenhuma formação adicionada.</p>
              )}
            </div>
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
      />
    </div>
  );
}

export default PerfilPage;

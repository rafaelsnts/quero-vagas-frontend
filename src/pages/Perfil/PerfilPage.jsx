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
const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
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
        } finally {
          setLoading(false);
        }
      };
      fetchPerfil();
    }
  }, [user]);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/perfil/meu-perfil", formData);
      setPerfilCompleto((prev) => ({ ...prev, perfil: response.data }));
      toast.success("Perfil atualizado!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Falha ao atualizar o perfil.");
    }
  };

  const handleExperienceChange = (e) =>
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/perfil/experiencia", newExperience);
      setPerfilCompleto((prev) => ({
        ...prev,
        experiencias: [response.data, ...prev.experiencias],
      }));
      toast.success("Experiência adicionada!");
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

  const handleEducationChange = (e) =>
    setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/perfil/formacao", newEducation);
      setPerfilCompleto((prev) => ({
        ...prev,
        formacoesAcademicas: [response.data, ...prev.formacoesAcademicas],
      }));
      toast.success("Formação adicionada!");
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

  const handleFileChange = (e) => setCurriculoFile(e.target.files[0]);
  const handleCurriculoSubmit = async (e) => {
    e.preventDefault();
    if (!curriculoFile) return toast.warn("Selecione um arquivo.");
    const formData = new FormData();
    formData.append("curriculo", curriculoFile);
    try {
      const response = await api.post("/perfil/curriculo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPerfilCompleto((prev) => ({ ...prev, perfil: response.data.perfil }));
      toast.success("Currículo enviado!");
      setCurriculoFile(null);
      document.getElementById("curriculo-upload").value = null;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erro ao enviar o currículo."
      );
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

  if (loading) return <p className="text-center p-10">A carregar perfil...</p>;
  if (!perfilCompleto)
    return (
      <p className="text-center text-red-500 p-10">
        Não foi possível carregar o perfil.
      </p>
    );

  const { perfil, experiencias, formacoesAcademicas } = perfilCompleto;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">Meu Perfil</h1>
          <p className="text-slate-500 mt-1">
            Mantenha as suas informações profissionais sempre atualizadas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h1 className="text-2xl font-bold text-brand-blue">
                {user.nome}
              </h1>
              <p className="text-slate-500">{user.email}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 w-full flex items-center justify-center bg-brand-purple text-white font-bold rounded-lg px-5 py-2 hover:opacity-90 transition-opacity"
              >
                <PencilIcon /> {isEditing ? "Cancelar Edição" : "Editar Perfil"}
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-brand-blue border-b pb-2 mb-4">
                Contato & Mídia
              </h3>
              {perfil?.curriculoUrl && (
                <p className="flex items-center gap-2 text-slate-600 text-sm mb-4">
                  <strong className="font-medium text-slate-800">
                    Currículo:
                  </strong>
                  <a
                    href={`http://localhost:3000${perfil.curriculoUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-purple hover:underline"
                  >
                    Baixar Arquivo
                  </a>
                </p>
              )}
              <form onSubmit={handleCurriculoSubmit} className="border-t pt-4">
                <label
                  htmlFor="curriculo-upload"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  {perfil?.curriculoUrl
                    ? "Substituir currículo"
                    : "Carregar currículo"}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="curriculo-upload"
                    name="curriculo"
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-brand-purple hover:file:bg-violet-100"
                  />
                  <button
                    type="submit"
                    disabled={!curriculoFile}
                    className="px-4 py-2 text-sm font-bold text-white bg-brand-orange rounded-lg hover:opacity-90 disabled:bg-slate-400"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </aside>

          <main className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-brand-blue mb-4">
                Resumo Profissional
              </h2>
              {isEditing ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <textarea
                    name="resumo"
                    value={formData.resumo}
                    onChange={handleFormChange}
                    rows="5"
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    placeholder="Fale um pouco sobre você..."
                  ></textarea>
                  <input
                    type="text"
                    name="habilidades"
                    value={formData.habilidades}
                    onChange={handleFormChange}
                    className="w-full p-3 border border-slate-300 rounded-lg"
                    placeholder="Suas habilidades (separadas por vírgula)"
                  />
                  <div className="flex justify-end gap-4">
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
                      Salvar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-slate-600 mb-6 whitespace-pre-wrap">
                    {perfil?.resumo || "Nenhum resumo adicionado."}
                  </p>
                  <h3 className="text-xl font-bold text-brand-blue mb-2">
                    Habilidades
                  </h3>
                  <p className="text-slate-600">
                    {perfil?.habilidades || "Nenhuma habilidade adicionada."}
                  </p>
                </>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-brand-blue">
                  Experiência Profissional
                </h2>
                <button
                  onClick={() => setShowExperienceForm(!showExperienceForm)}
                  className="flex items-center gap-1 bg-brand-orange text-white text-sm font-bold rounded-lg px-3 py-1 hover:opacity-90"
                >
                  <PlusIcon /> {showExperienceForm ? "Fechar" : "Adicionar"}
                </button>
              </div>
              {showExperienceForm && (
                <form
                  onSubmit={handleExperienceSubmit}
                  className="space-y-4 p-4 mb-6 border rounded-lg bg-slate-50"
                >
                  <input
                    type="text"
                    name="cargo"
                    value={newExperience.cargo}
                    onChange={handleExperienceChange}
                    placeholder="Cargo"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="empresa"
                    value={newExperience.empresa}
                    onChange={handleExperienceChange}
                    placeholder="Empresa"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-4">
                    <input
                      type="date"
                      name="dataInicio"
                      value={newExperience.dataInicio}
                      onChange={handleExperienceChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="date"
                      name="dataFim"
                      value={newExperience.dataFim}
                      onChange={handleExperienceChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <textarea
                    name="descricao"
                    value={newExperience.descricao}
                    onChange={handleExperienceChange}
                    placeholder="Descrição das atividades"
                    className="w-full p-2 border rounded"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-brand-purple text-white font-bold rounded-lg py-2"
                  >
                    Adicionar Experiência
                  </button>
                </form>
              )}
              <div className="space-y-4">
                {experiencias?.length > 0 ? (
                  experiencias.map((exp) => (
                    <div
                      key={exp.id}
                      className="border-b pb-2 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="font-bold">{exp.cargo}</h4>
                        <p className="text-sm text-slate-600">{exp.empresa}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(exp.dataInicio).toLocaleDateString()} -{" "}
                          {exp.dataFim
                            ? new Date(exp.dataFim).toLocaleDateString()
                            : "Atual"}
                        </p>
                      </div>
                      <button
                        onClick={() => openDeleteModal(exp.id, "experiencia")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">
                    Nenhuma experiência adicionada.
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
                  onClick={() => setShowEducationForm(!showEducationForm)}
                  className="flex items-center gap-1 bg-brand-orange text-white text-sm font-bold rounded-lg px-3 py-1 hover:opacity-90"
                >
                  <PlusIcon /> {showEducationForm ? "Fechar" : "Adicionar"}
                </button>
              </div>
              {showEducationForm && (
                <form
                  onSubmit={handleEducationSubmit}
                  className="space-y-4 p-4 mb-6 border rounded-lg bg-slate-50"
                >
                  <input
                    type="text"
                    name="instituicao"
                    value={newEducation.instituicao}
                    onChange={handleEducationChange}
                    placeholder="Instituição"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="grau"
                    value={newEducation.grau}
                    onChange={handleEducationChange}
                    placeholder="Grau (Ex: Bacharelado)"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="curso"
                    value={newEducation.curso}
                    onChange={handleEducationChange}
                    placeholder="Curso"
                    required
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-4">
                    <input
                      type="date"
                      name="dataInicio"
                      value={newEducation.dataInicio}
                      onChange={handleEducationChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="date"
                      name="dataFim"
                      value={newEducation.dataFim}
                      onChange={handleEducationChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-brand-purple text-white font-bold rounded-lg py-2"
                  >
                    Adicionar Formação
                  </button>
                </form>
              )}
              <div className="space-y-4">
                {formacoesAcademicas?.length > 0 ? (
                  formacoesAcademicas.map((form) => (
                    <div
                      key={form.id}
                      className="border-b pb-2 flex justify-between items-start"
                    >
                      <div>
                        <h4 className="font-bold">{form.curso}</h4>
                        <p className="text-sm text-slate-600">
                          {form.instituicao} - {form.grau}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(form.dataInicio).toLocaleDateString()} -{" "}
                          {form.dataFim
                            ? new Date(form.dataFim).toLocaleDateString()
                            : "Atual"}
                        </p>
                      </div>
                      <button
                        onClick={() => openDeleteModal(form.id, "formacao")}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">Nenhuma formação adicionada.</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Você tem certeza que deseja excluir este item?"
      />
    </div>
  );
}

export default PerfilPage;

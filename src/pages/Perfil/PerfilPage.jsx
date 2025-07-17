import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/Modal/ConfirmationModal.jsx";

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
      document.getElementById("curriculo-upload").value = null; // Limpa o input de arquivo
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
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-blue">{user.nome}</h1>
            <p className="text-slate-500">{user.email}</p>
          </div>
          {!isEditing && !showExperienceForm && !showEducationForm && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-brand-purple text-white font-bold rounded-lg px-5 py-2 hover:opacity-90"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue mb-4">
          Currículo Anexado
        </h2>
        {perfil?.curriculoUrl ? (
          <div>
            <p className="text-slate-600">
              Você já tem um currículo anexado. Para substituí-lo, envie um novo
              arquivo.
            </p>
            <a
              href={`http://localhost:3001/files${perfil.curriculoUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-purple font-semibold hover:underline"
            >
              Visualizar currículo atual
            </a>
          </div>
        ) : (
          <p className="text-slate-500">
            Você ainda não anexou um currículo. Use o formulário abaixo.
          </p>
        )}
        <form
          onSubmit={handleCurriculoSubmit}
          className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 border-t pt-4"
        >
          <input
            id="curriculo-upload"
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-brand-purple hover:file:bg-violet-100"
            accept=".pdf,.doc,.docx"
          />
          <button
            type="submit"
            disabled={!curriculoFile}
            className="bg-green-600 text-white font-bold rounded-lg px-5 py-2 hover:opacity-90 disabled:bg-slate-400 disabled:cursor-not-allowed w-full sm:w-auto shrink-0"
          >
            Enviar Arquivo
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue mb-4">Sobre Mim</h2>
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
          <div>
            <p className="text-slate-600 break-words">
              {perfil?.resumo ||
                "Clique em 'Editar Perfil' para adicionar um resumo."}
            </p>
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold text-slate-800">Habilidades</h3>
              <p className="text-slate-600 break-words">
                {perfil?.habilidades ||
                  "Clique em 'Editar Perfil' para adicionar suas habilidades."}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-blue">
            Experiência Profissional
          </h2>
          {!isEditing && !showExperienceForm && !showEducationForm && (
            <button
              onClick={() => setShowExperienceForm(true)}
              className="bg-brand-orange text-white text-sm font-bold rounded-lg px-4 py-1 hover:opacity-90"
            >
              + Adicionar
            </button>
          )}
        </div>
        {showExperienceForm && (
          <form
            onSubmit={handleExperienceSubmit}
            className="space-y-4 p-4 mb-6 border rounded-lg bg-slate-50"
          >
            <h3 className="text-lg font-semibold text-slate-700">
              Adicionar Nova Experiência
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="cargo"
                placeholder="Cargo"
                value={newExperience.cargo}
                onChange={handleExperienceChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="empresa"
                placeholder="Empresa"
                value={newExperience.empresa}
                onChange={handleExperienceChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Data de Início</label>
                <input
                  type="date"
                  name="dataInicio"
                  value={newExperience.dataInicio}
                  onChange={handleExperienceChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">
                  Data de Fim (deixe em branco se for o atual)
                </label>
                <input
                  type="date"
                  name="dataFim"
                  value={newExperience.dataFim}
                  onChange={handleExperienceChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <textarea
              name="descricao"
              placeholder="Descrição das suas atividades..."
              value={newExperience.descricao}
              onChange={handleExperienceChange}
              rows="3"
              className="w-full p-2 border rounded"
            ></textarea>
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setShowExperienceForm(false)}
                className="bg-slate-200 text-slate-800 font-bold rounded-lg px-5 py-2 hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white font-bold rounded-lg px-5 py-2 hover:opacity-90"
              >
                Salvar Experiência
              </button>
            </div>
          </form>
        )}
        <div className="space-y-4">
          {experiencias?.length > 0
            ? experiencias.map((exp) => (
                <div key={exp.id}>
                  {editingExperienceId === exp.id ? (
                    <form
                      onSubmit={handleUpdateExperienceSubmit}
                      className="space-y-4 p-4 my-4 border rounded-lg bg-slate-50"
                    >
                      <h3 className="text-lg font-semibold text-slate-700">
                        Editando Experiência
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="cargo"
                          placeholder="Cargo"
                          value={editingExperienceData.cargo}
                          onChange={handleEditingExperienceChange}
                          required
                          className="w-full p-2 border rounded"
                        />
                        <input
                          type="text"
                          name="empresa"
                          placeholder="Empresa"
                          value={editingExperienceData.empresa}
                          onChange={handleEditingExperienceChange}
                          required
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm">Data de Início</label>
                          <input
                            type="date"
                            name="dataInicio"
                            value={editingExperienceData.dataInicio}
                            onChange={handleEditingExperienceChange}
                            required
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-sm">Data de Fim</label>
                          <input
                            type="date"
                            name="dataFim"
                            value={editingExperienceData.dataFim}
                            onChange={handleEditingExperienceChange}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                      <textarea
                        name="descricao"
                        placeholder="Descrição..."
                        value={editingExperienceData.descricao}
                        onChange={handleEditingExperienceChange}
                        rows="3"
                        className="w-full p-2 border rounded"
                      ></textarea>
                      <div className="flex gap-4 justify-end">
                        <button
                          type="button"
                          onClick={handleCancelEditExperience}
                          className="bg-slate-200 text-slate-800 font-bold rounded-lg px-5 py-2 hover:bg-slate-300"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-green-600 text-white font-bold rounded-lg px-5 py-2 hover:opacity-90"
                        >
                          Salvar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="border-b last:border-b-0 py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {exp.cargo}
                          </h3>
                          <p className="text-md font-semibold text-slate-600">
                            {exp.empresa}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(exp.dataInicio).toLocaleDateString()} -{" "}
                            {exp.dataFim
                              ? new Date(exp.dataFim).toLocaleDateString()
                              : "Atual"}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEditExperienceClick(exp)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() =>
                              openDeleteModal(exp.id, "experiencia")
                            }
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 mt-2 break-words">
                        {exp.descricao}
                      </p>
                    </div>
                  )}
                </div>
              ))
            : !showExperienceForm && (
                <p className="text-slate-500">
                  Nenhuma experiência profissional adicionada ainda.
                </p>
              )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-blue">
            Formação Acadêmica
          </h2>
          {!isEditing && !showExperienceForm && !showEducationForm && (
            <button
              onClick={() => setShowEducationForm(true)}
              className="bg-brand-orange text-white text-sm font-bold rounded-lg px-4 py-1 hover:opacity-90"
            >
              + Adicionar
            </button>
          )}
        </div>
        {showEducationForm && (
          <form
            onSubmit={handleEducationSubmit}
            className="space-y-4 p-4 mb-6 border rounded-lg bg-slate-50"
          >
            <h3 className="text-lg font-semibold text-slate-700">
              Adicionar Nova Formação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="instituicao"
                placeholder="Instituição de Ensino"
                value={newEducation.instituicao}
                onChange={handleEducationChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="grau"
                placeholder="Grau (Ex: Bacharelado)"
                value={newEducation.grau}
                onChange={handleEducationChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <input
              type="text"
              name="curso"
              placeholder="Curso"
              value={newEducation.curso}
              onChange={handleEducationChange}
              required
              className="w-full p-2 border rounded"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-500">Data de Início</label>
                <input
                  type="date"
                  name="dataInicio"
                  value={newEducation.dataInicio}
                  onChange={handleEducationChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm text-slate-500">
                  Data de Fim (deixe em branco se não aplicável)
                </label>
                <input
                  type="date"
                  name="dataFim"
                  value={newEducation.dataFim}
                  onChange={handleEducationChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={() => setShowEducationForm(false)}
                className="bg-slate-200 text-slate-800 font-bold rounded-lg px-5 py-2 hover:bg-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-600 text-white font-bold rounded-lg px-5 py-2 hover:opacity-90"
              >
                Salvar Formação
              </button>
            </div>
          </form>
        )}
        <div className="space-y-4">
          {formacoesAcademicas?.length > 0
            ? formacoesAcademicas.map((form) => (
                <div key={form.id}>
                  {editingEducationId === form.id ? (
                    <form
                      onSubmit={handleUpdateEducationSubmit}
                      className="space-y-4 p-4 my-4 border rounded-lg bg-slate-50"
                    >
                      <h3 className="text-lg font-semibold text-slate-700">
                        Editando Formação
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="instituicao"
                          placeholder="Instituição"
                          value={editingEducationData.instituicao}
                          onChange={handleEditingEducationChange}
                          required
                          className="w-full p-2 border rounded"
                        />
                        <input
                          type="text"
                          name="grau"
                          placeholder="Grau"
                          value={editingEducationData.grau}
                          onChange={handleEditingEducationChange}
                          required
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <input
                        type="text"
                        name="curso"
                        placeholder="Curso"
                        value={editingEducationData.curso}
                        onChange={handleEditingEducationChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm">Data de Início</label>
                          <input
                            type="date"
                            name="dataInicio"
                            value={editingEducationData.dataInicio}
                            onChange={handleEditingEducationChange}
                            required
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-sm">Data de Fim</label>
                          <input
                            type="date"
                            name="dataFim"
                            value={editingEducationData.dataFim}
                            onChange={handleEditingEducationChange}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 justify-end">
                        <button
                          type="button"
                          onClick={handleCancelEditEducation}
                          className="bg-slate-200 text-slate-800 font-bold rounded-lg px-5 py-2 hover:bg-slate-300"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-green-600 text-white font-bold rounded-lg px-5 py-2 hover:opacity-90"
                        >
                          Salvar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="border-b last:border-b-0 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {form.curso}
                          </h3>
                          <p className="text-md font-semibold text-slate-600">
                            {form.instituicao} - {form.grau}
                          </p>
                          <p className="text-sm text-slate-500">
                            {new Date(form.dataInicio).toLocaleDateString()} -{" "}
                            {form.dataFim
                              ? new Date(form.dataFim).toLocaleDateString()
                              : "Atual"}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEditEducationClick(form)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => openDeleteModal(form.id, "formacao")}
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            : !showEducationForm && (
                <p className="text-slate-500">
                  Nenhuma formação acadêmica adicionada ainda.
                </p>
              )}
        </div>
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

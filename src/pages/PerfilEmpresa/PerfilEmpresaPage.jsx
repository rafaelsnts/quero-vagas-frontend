import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { IMaskInput } from "react-imask";
import { useAuth } from "../../contexts/AuthContext";

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

function PerfilEmpresaPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    descricao: "",
    website: "",
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (user) {
      api
        .get("/empresas/meu-perfil")
        .then((response) => {
          const { nome, perfilEmpresa } = response.data;
          const fullProfileData = {
            nome: nome || "",
            cnpj: perfilEmpresa?.cnpj || "",
            descricao: perfilEmpresa?.descricao || "",
            website: perfilEmpresa?.website || "",
            logoUrl: perfilEmpresa?.logoUrl || "",
          };
          setFormData(fullProfileData);
        })
        .catch(() =>
          toast.error("Não foi possível carregar os dados do seu perfil.")
        )
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put("/empresas/meu-perfil", formData);
      toast.success("Informações atualizadas com sucesso!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Não foi possível atualizar o perfil."
      );
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setFormData((prev) => ({ ...prev, logoUrl: URL.createObjectURL(file) }));
    }
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    if (!logoFile)
      return toast.warn("Por favor, selecione um arquivo de logo.");

    const uploadData = new FormData();
    uploadData.append("logo", logoFile);

    try {
      const response = await api.post("/empresas/logo", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newLogoUrl = response.data.perfil.logoUrl;

      setFormData((prev) => ({ ...prev, logoUrl: newLogoUrl }));

      toast.success("Logo atualizada com sucesso!");
      setLogoFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro ao enviar a logo.");
    }
  };

  if (loading) return <p className="text-center">Carregando...</p>;

  const getDisplayLogo = () => {
    if (formData.logoUrl?.startsWith("blob:")) {
      return formData.logoUrl;
    }
    if (formData.logoUrl) {
      return `http://localhost:3001/files${formData.logoUrl}`;
    }
    return "https://placehold.co/150x150/e2e8f0/e2e8f0";
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <img
            src={getDisplayLogo()}
            alt="Logo da Empresa"
            className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
          />
          <label
            htmlFor="logo-upload"
            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full cursor-pointer transition-opacity"
          >
            <CameraIcon />
          </label>
          <input
            id="logo-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold text-brand-blue">
            {formData.nome}
          </h1>
          <p className="text-slate-500">{formData.cnpj}</p>
          {formData.website && (
            <a
              href={formData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Visitar Website
            </a>
          )}
        </div>
        {logoFile && (
          <button
            onClick={handleLogoSubmit}
            className="bg-green-600 text-white font-bold rounded-lg px-5 py-2 hover:opacity-90 self-center"
          >
            Salvar Nova Logo
          </button>
        )}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-brand-blue mb-6">
          Editar Informações
        </h2>
        <form onSubmit={handleInfoSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Nome da Empresa
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full p-3 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label
                htmlFor="cnpj"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                CNPJ
              </label>
              <IMaskInput
                mask="00.000.000/0000-00"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onAccept={(value) =>
                  handleChange({ target: { name: "cnpj", value } })
                }
                placeholder="00.000.000/0000-00"
                className="w-full p-3 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              placeholder="https://suaempresa.com.br"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Descrição da Empresa
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows="5"
              placeholder="Fale um pouco sobre a sua empresa..."
              className="w-full p-3 border border-slate-300 rounded-lg"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-brand-orange text-white font-bold rounded-lg py-3 mt-4 hover:opacity-90"
            >
              Salvar Informações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PerfilEmpresaPage;

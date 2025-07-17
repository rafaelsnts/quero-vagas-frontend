import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api.js";

function CadastroEmpresaPage() {
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (senha !== confirmarSenha) {
      toast.warn("As senhas não coincidem!");
      return;
    }
    try {
      const data = { nomeEmpresa, cnpj, email, senha };
      await api.post("/auth/register/company", data);
      toast.success(
        "Cadastro de empresa realizado com sucesso! Redirecionando..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro da empresa:", error);
      toast.error(
        error.response?.data?.message || "Ocorreu um erro ao tentar cadastrar."
      );
    }
  };

  return (
    <div className="container mx-auto max-w-lg">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">
            Cadastro de Empresa
          </h1>
          <p className="text-slate-500 mt-2">
            Divulgue suas vagas e encontre os melhores talentos.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logo da Empresa
            </label>
            <div className="mt-1 flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Preview da Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-slate-400 text-xs text-center">
                    Preview
                  </span>
                )}
              </div>
              <label
                htmlFor="logo-upload"
                className="cursor-pointer bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Selecionar Logo
              </label>
              <input
                id="logo-upload"
                name="logo-upload"
                type="file"
                className="hidden"
                onChange={handleLogoChange}
                accept="image/png, image/jpeg, image/webp"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="nomeEmpresa"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nome da Empresa
            </label>
            <input
              type="text"
              id="nomeEmpresa"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
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
            <input
              type="text"
              id="cnpj"
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email de Contato
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="confirmarSenha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-brand-orange text-white font-bold rounded-lg py-3 mt-4 hover:opacity-90"
            >
              Criar conta de Empresa
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Já tem uma conta?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-purple hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CadastroEmpresaPage;

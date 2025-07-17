import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { toast } from "react-toastify";

function CadastroCandidatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (senha !== confirmarSenha) {
      toast.warn("As senhas não coincidem!");
      return;
    }
    try {
      const data = { nome, email, senha };
      await api.post("/auth/register/candidate", data);
      toast.success(
        "Cadastro realizado com sucesso! Redirecionando para o login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
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
            Cadastro de Candidato
          </h1>
          <p className="text-slate-500 mt-2">
            Crie sua conta para encontrar as melhores vagas.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
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
              className="w-full bg-brand-purple text-white font-bold rounded-lg py-3 mt-4 hover:opacity-90"
            >
              Criar minha conta
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

export default CadastroCandidatoPage;

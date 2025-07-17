import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      return toast.warn("As senhas não coincidem.");
    }
    if (senha.length < 6) {
      return toast.warn("A senha precisa ter no mínimo 6 caracteres.");
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { senha });
      toast.success(
        "Senha redefinida com sucesso! Você já pode fazer login com a nova senha."
      );
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Não foi possível redefinir a senha. O link pode ter expirado."
      );
      console.error("Erro ao redefinir senha:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">
            Crie uma Nova Senha
          </h1>
          <p className="text-slate-500 mt-2">
            Escolha uma nova senha segura para sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nova Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label
              htmlFor="confirmarSenha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-purple text-white font-bold rounded-lg py-3 mt-4 hover:opacity-90 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Redefinir Senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

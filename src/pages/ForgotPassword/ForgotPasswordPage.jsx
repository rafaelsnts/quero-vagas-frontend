import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      toast.info(response.data.message);
    } catch (error) {
      toast.error("Ocorreu um erro. Tente novamente mais tarde.");
      console.error("Erro ao solicitar redefinição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">
            Recuperar Senha
          </h1>
          <p className="text-slate-500 mt-2">
            Digite seu email e, se ele estiver cadastrado, enviaremos um link
            para você criar uma nova senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Seu email de cadastro
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              required
              placeholder="seu.email@exemplo.com"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white font-bold rounded-lg py-3 mt-4 hover:opacity-90 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm font-semibold text-brand-purple hover:underline"
          >
            Lembrou a senha? Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;

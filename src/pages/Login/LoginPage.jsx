import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, senha);
      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Ocorreu um erro ao tentar fazer login."
      );
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">Acessar Conta</h1>
          <p className="text-slate-500 mt-2">Bem-vindo(a) de volta!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <button
              type="submit"
              className="w-full bg-brand-purple text-white font-bold rounded-lg py-3 mt-4 hover:opacity-90"
            >
              Entrar
            </button>
          </div>
        </form>

        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-slate-500">
            Não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="font-semibold text-brand-purple hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
          <p className="text-sm">
            <Link
              to="/forgot-password"
              className="text-slate-500 hover:text-brand-purple hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

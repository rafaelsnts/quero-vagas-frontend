import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api.js";
import { toast } from "react-toastify";

const EyeIcon = () => (
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
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);
const EyeSlashIcon = () => (
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
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    className="h-4 w-4 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);
const XIcon = () => (
  <svg
    className="h-4 w-4 text-red-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

function CadastroCandidatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const validation = {
      minLength: password.length >= 8,
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const getPasswordStrength = () => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length;
    if (validCount <= 1)
      return { width: "20%", color: "bg-red-500", text: "Muito fraca" };
    if (validCount <= 2)
      return { width: "40%", color: "bg-orange-500", text: "Fraca" };
    if (validCount <= 3)
      return { width: "60%", color: "bg-yellow-500", text: "Média" };
    if (validCount <= 4)
      return { width: "80%", color: "bg-blue-500", text: "Boa" };
    return { width: "100%", color: "bg-green-500", text: "Muito forte" };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setSenha(newPassword);
    validatePassword(newPassword);
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const isFormValid = () => {
    return (
      nome.trim() !== "" &&
      email.trim() !== "" &&
      isPasswordValid() &&
      senha === confirmarSenha
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPasswordValid()) {
      toast.error("Por favor, atenda a todos os requisitos de senha.");
      return;
    }

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

  const strength = getPasswordStrength();

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
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
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
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="senha"
                value={senha}
                onChange={handlePasswordChange}
                required
                className={`w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-brand-purple focus:border-transparent ${
                  senha && !isPasswordValid()
                    ? "border-red-300"
                    : "border-slate-300"
                }`}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>

            {senha && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-600">
                    Força da senha:
                  </span>
                  <span
                    className={`text-xs font-medium ${strength.color.replace(
                      "bg-",
                      "text-"
                    )}`}
                  >
                    {strength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
              </div>
            )}

            {senha && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-slate-700 mb-2">
                  Requisitos da senha:
                </p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    {passwordValidation.minLength ? <CheckIcon /> : <XIcon />}
                    <span
                      className={
                        passwordValidation.minLength
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      Pelo menos 8 caracteres
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasLowerCase ? (
                      <CheckIcon />
                    ) : (
                      <XIcon />
                    )}
                    <span
                      className={
                        passwordValidation.hasLowerCase
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      Uma letra minúscula (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasUpperCase ? (
                      <CheckIcon />
                    ) : (
                      <XIcon />
                    )}
                    <span
                      className={
                        passwordValidation.hasUpperCase
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      Uma letra maiúscula (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasNumber ? <CheckIcon /> : <XIcon />}
                    <span
                      className={
                        passwordValidation.hasNumber
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      Um número (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordValidation.hasSpecialChar ? (
                      <CheckIcon />
                    ) : (
                      <XIcon />
                    )}
                    <span
                      className={
                        passwordValidation.hasSpecialChar
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      Um caractere especial (@$!%*?&)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmarSenha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmarSenha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className={`w-full p-3 border rounded-lg pr-10 focus:ring-2 focus:ring-brand-purple focus:border-transparent ${
                  confirmarSenha && senha !== confirmarSenha
                    ? "border-red-300"
                    : "border-slate-300"
                }`}
                placeholder="Confirme sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            {confirmarSenha && (
              <div className="mt-1 flex items-center gap-2">
                {senha === confirmarSenha ? <CheckIcon /> : <XIcon />}
                <span
                  className={`text-xs ${
                    senha === confirmarSenha ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {senha === confirmarSenha
                    ? "As senhas coincidem"
                    : "As senhas não coincidem"}
                </span>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full font-bold rounded-lg py-3 mt-4 transition-all duration-200 ${
                isFormValid()
                  ? "bg-brand-purple text-white hover:opacity-90 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api.js";
import { IMaskInput } from "react-imask";

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

function CadastroEmpresaPage() {
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione apenas arquivos de imagem");
        return;
      }

      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const validatePassword = (password) => {
    const senhaRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return senhaRegex.test(password);
  };

  const cleanCNPJ = (cnpj) => {
    return cnpj.replace(/[^\d]/g, "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!nomeEmpresa.trim()) {
        toast.error("Nome da empresa é obrigatório");
        return;
      }

      if (!cnpj) {
        toast.error("CNPJ é obrigatório");
        return;
      }

      if (!email.trim()) {
        toast.error("Email é obrigatório");
        return;
      }

      if (!senha) {
        toast.error("Senha é obrigatória");
        return;
      }

      if (!validatePassword(senha)) {
        toast.error(
          "A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial (@$!%*?&)"
        );
        return;
      }

      if (senha !== confirmarSenha) {
        toast.error("As senhas não coincidem!");
        return;
      }

      const registrationData = {
        nomeEmpresa: nomeEmpresa.trim(),
        cnpj: cleanCNPJ(cnpj),
        email: email.trim().toLowerCase(),
        senha,
      };

      const response = await api.post(
        "/auth/register/company",
        registrationData
      );

      if (logo && response.data) {
        try {
          const loginResponse = await api.post("/auth/login", {
            email: registrationData.email,
            senha: registrationData.senha,
          });

          const { token } = loginResponse.data;

          const uploadData = new FormData();
          uploadData.append("logo", logo);

          await api.post("/empresas/logo", uploadData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          toast.success("Cadastro realizado com sucesso! Logo enviada.");
        } catch (logoError) {
          console.error("Erro no upload da logo:", logoError);
          toast.warn(
            "Cadastro realizado, mas houve erro no upload da logo. Você pode fazer o upload posteriormente."
          );
        }
      } else {
        toast.success("Cadastro realizado com sucesso!");
      }

      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro da empresa:", error);

      if (error.response?.status === 400) {
        toast.error(
          error.response.data.message || "Dados inválidos. Verifique os campos."
        );
      } else if (error.response?.status === 409) {
        toast.error(
          error.response.data.message || "Email ou CNPJ já cadastrado."
        );
      } else if (error.response?.status === 500) {
        toast.error("Erro interno do servidor. Tente novamente mais tarde.");
      } else {
        toast.error(
          "Ocorreu um erro ao tentar cadastrar. Verifique sua conexão."
        );
      }
    } finally {
      setLoading(false);
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
              Logo da Empresa (Opcional)
            </label>
            <div className="flex items-center gap-4">
              <img
                src={
                  logoPreview || "https://placehold.co/100x100/e2e8f0/e2e8f0"
                }
                alt="Preview da Logo"
                className="w-16 h-16 rounded-full object-cover bg-slate-100"
              />
              <input
                type="file"
                onChange={handleLogoChange}
                accept="image/*"
                disabled={loading}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-brand-purple hover:file:bg-violet-100 disabled:opacity-50"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Máximo 5MB. Formatos: JPG, PNG, GIF
            </p>
          </div>

          <div>
            <label
              htmlFor="nomeEmpresa"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nome da Empresa *
            </label>
            <input
              type="text"
              id="nomeEmpresa"
              value={nomeEmpresa}
              onChange={(e) => setNomeEmpresa(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 border border-slate-300 rounded-lg disabled:opacity-50"
              placeholder="Digite o nome da sua empresa"
            />
          </div>

          <div>
            <label
              htmlFor="cnpj"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              CNPJ *
            </label>
            <IMaskInput
              mask="00.000.000/0000-00"
              id="cnpj"
              name="cnpj"
              value={cnpj}
              onAccept={(value) => setCnpj(value)}
              placeholder="00.000.000/0000-00"
              className="w-full p-3 border border-slate-300 rounded-lg disabled:opacity-50"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email de Contato *
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 border border-slate-300 rounded-lg disabled:opacity-50"
              placeholder="empresa@exemplo.com"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Senha *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 border border-slate-300 rounded-lg pr-10 disabled:opacity-50"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500 disabled:opacity-50"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
            <p className="text-xs text-slate-500 mt-1">
              Deve conter: letra maiúscula, minúscula, número e símbolo
              (@$!%*?&)
            </p>
          </div>

          <div className="relative">
            <label
              htmlFor="confirmarSenha"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Confirmar Senha *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 border border-slate-300 rounded-lg pr-10 disabled:opacity-50"
              placeholder="Digite a senha novamente"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-500 disabled:opacity-50"
            >
              {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-orange text-white font-bold rounded-lg py-3 mt-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Criando conta...
                </>
              ) : (
                "Criar conta de Empresa"
              )}
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

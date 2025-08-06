import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 inline-block" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const PLANOS = [
  {
    id: "basico",
    nome: "Plano Básico",
    preco: "Grátis",
    descricao: "Ideal para começar e publicar a sua primeira vaga.",
    beneficios: [
      "1 publicação de vaga por mês",
      "Acesso ao painel de candidatos",
      "Suporte por email",
    ],
    stripePriceId: null,
    cta: "Começar Agora",
  },
  {
    id: "profissional",
    nome: "Plano Profissional",
    preco: "R$ 99,00",
    precoSufixo: "/mês",
    descricao: "Para empresas que contratam com frequência.",
    beneficios: [
      "Até 5 publicações de vagas por mês",
      "Suporte prioritário",
      "Vagas em destaque na busca",
      "Relatórios de desempenho",
      "Filtros avançados de candidatos",
    ],
    stripePriceId: "price_1RqNhLE1auyzaMj9UJIKt0i5",
    cta: "Assinar Agora",
    popular: true,
  },
];

function PlanosPage() {
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const [assinaturaAtual, setAssinaturaAtual] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssinaturaAtual = async () => {
      if (isAuthenticated && user?.tipoUsuario === "EMPRESA") {
        try {
          const response = await api.get("/pagamentos/assinatura-atual");
          setAssinaturaAtual(response.data);
        } catch (error) {
          console.error("Erro ao buscar assinatura:", error);
        }
      }
    };
    fetchAssinaturaAtual();
  }, [isAuthenticated, user]);

  const handleSubscribe = async (plano) => {
    if (!isAuthenticated) {
      toast.info("Você precisa estar logado para assinar um plano.");
      navigate("/login");
      return;
    }
    if (plano.stripePriceId) {
      await processarPagamento(plano);
    }
  };

  const processarPagamento = async (plano) => {
    setLoadingPriceId(plano.stripePriceId);
    try {
      const response = await api.post("/pagamentos/create-checkout-session", {
        priceId: plano.stripePriceId,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message ||
          "Não foi possível iniciar o pagamento."
      );
    } finally {
      setLoadingPriceId(null);
    }
  };

  const obterTextoBotao = (plano) => {
    if (loadingPriceId === plano.stripePriceId) {
      return (
        <>
          <LoadingSpinner /> <span className="ml-2">Processando...</span>
        </>
      );
    }
    if (assinaturaAtual?.plano?.id === plano.id) {
      return "Plano Atual";
    }
    if (plano.id === "basico" && assinaturaAtual?.plano?.id === "basico") {
      return "Plano Atual";
    }
    return plano.cta;
  };

  const obterEstiloBotao = (plano) => {
    const base =
      "mt-auto w-full font-bold rounded-lg py-3 px-4 transition-all duration-200 flex items-center justify-center";
    if (assinaturaAtual?.plano?.id === plano.id) {
      return `${base} bg-green-100 text-green-700 border-2 border-green-300 cursor-default`;
    }
    if (loadingPriceId === plano.stripePriceId) {
      return `${base} bg-slate-400 text-white cursor-not-allowed`;
    }
    if (plano.popular) {
      return `${base} bg-brand-purple text-white hover:bg-purple-700`;
    }
    return `${base} bg-slate-200 text-slate-800 hover:bg-slate-300`;
  };

  return (
    <div className="bg-slate-50 py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-brand-blue mb-4">
            Nossos Planos
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta às suas necessidades de
            recrutamento.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {PLANOS.map((plano) => (
            <div
              key={plano.id}
              className={`bg-white border rounded-xl p-8 flex flex-col relative ${
                plano.popular
                  ? "border-brand-purple shadow-xl scale-105"
                  : "border-slate-300"
              }`}
            >
              {plano.popular && (
                <div className="absolute top-0 right-0 bg-brand-purple text-white px-3 py-1 text-sm font-semibold rounded-bl-lg">
                  Mais Popular
                </div>
              )}
              <h2 className="text-2xl font-bold text-brand-blue mb-2">
                {plano.nome}
              </h2>
              <p className="text-slate-500 h-12">{plano.descricao}</p>
              <div className="text-5xl font-extrabold text-slate-800 my-8">
                {plano.preco}
                {plano.precoSufixo && (
                  <span className="text-base font-normal text-slate-500 ml-1">
                    {plano.precoSufixo}
                  </span>
                )}
              </div>
              <ul className="space-y-4 text-slate-600 text-left mb-8 flex-grow">
                {plano.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon />
                    <span className="ml-3">{beneficio}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plano)}
                disabled={
                  loadingPriceId === plano.stripePriceId ||
                  assinaturaAtual?.plano?.id === plano.id
                }
                className={obterEstiloBotao(plano)}
              >
                {obterTextoBotao(plano)}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlanosPage;

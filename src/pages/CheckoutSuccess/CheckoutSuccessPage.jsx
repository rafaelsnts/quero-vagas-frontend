import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple mx-auto"></div>
);
const SuccessIcon = () => (
  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
    <svg
      className="h-8 w-8 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </div>
);
const ErrorIcon = () => (
  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
    <svg
      className="h-8 w-8 text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </div>
);

function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [assinaturaDetalhes, setAssinaturaDetalhes] = useState(null);
  const [error, setError] = useState(null);
  const {
    loading: authLoading,
    isAuthenticated,
    user,
    refreshUser,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verificarPagamento = async () => {
      if (!isAuthenticated) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        navigate("/login");
        return;
      }

      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        setError("ID da sessão de pagamento não encontrado.");
        setStatus("failed");
        return;
      }

      try {
        const response = await api.post("/pagamentos/verificar-pagamento", {
          sessionId,
        });
        const { status: paymentStatus, assinatura, plano } = response.data;

        setAssinaturaDetalhes({ assinatura, plano });

        if (paymentStatus === "success") {
          toast.success("Pagamento concluído com sucesso!");
          setStatus("success");
          if (refreshUser) await refreshUser();
        } else {
          throw new Error("O pagamento não foi confirmado pelo servidor.");
        }
      } catch (err) {
        console.error("Erro ao verificar pagamento:", err);
        setError(
          err.response?.data?.error?.message ||
            "Não foi possível verificar o pagamento."
        );
        setStatus("failed");
      }
    };

    if (!authLoading) {
      verificarPagamento();
    }
  }, [authLoading, isAuthenticated, searchParams, navigate, refreshUser]);

  const renderContent = () => {
    if (status === "loading" || authLoading) {
      return (
        <div className="text-center">
          <LoadingSpinner />
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            A verificar o seu pagamento...
          </h2>
          <p className="text-slate-600 mt-2">Por favor, aguarde um momento.</p>
        </div>
      );
    }

    if (status === "success") {
      return (
        <div className="text-center">
          <SuccessIcon />
          <h1 className="text-3xl font-bold text-brand-blue mb-4">
            Pagamento Confirmado!
          </h1>
          <p className="text-slate-600 mb-6">
            A sua assinatura do{" "}
            <strong>{assinaturaDetalhes?.plano?.nome}</strong> foi ativada com
            sucesso.
          </p>
          <div className="space-y-3">
            <Link
              to="/empresa/dashboard"
              className="block w-full bg-brand-purple text-white font-bold rounded-lg px-6 py-3 text-center hover:bg-purple-700"
            >
              Ir para o Painel
            </Link>
            <Link
              to="/empresa/vagas/nova"
              className="block w-full bg-white border-2 border-brand-purple text-brand-purple font-bold rounded-lg px-6 py-3 text-center hover:bg-purple-50"
            >
              Publicar Nova Vaga
            </Link>
          </div>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="text-center">
          <ErrorIcon />
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Problema no Pagamento
          </h1>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link
            to="/planos"
            className="block w-full bg-brand-purple text-white font-bold rounded-lg px-6 py-3 text-center hover:bg-purple-700"
          >
            Tentar Novamente
          </Link>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-lg mx-auto w-full">
        <h2 className="text-2xl font-semibold text-slate-700 text-center mb-8">
          Status do Pagamento
        </h2>
        {renderContent()}
      </div>
    </div>
  );
}

export default CheckoutSuccessPage;

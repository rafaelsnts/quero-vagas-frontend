import React from "react";
import { Link } from "react-router-dom";

function OpcaoCadastroPage() {
  return (
    <div className="container mx-auto text-center">
      <h1 className="text-3xl font-bold text-brand-blue mb-4">Criar Conta</h1>
      <p className="text-lg text-slate-600 mb-10">
        Escolha o tipo de conta que deseja criar na plataforma Quero Vagas.
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-8">
        <Link
          to="/cadastro/candidato"
          className="md:w-1/3 block p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4 border-brand-purple"
        >
          <h2 className="text-2xl font-bold text-brand-blue">Sou Candidato</h2>
          <p className="mt-4 text-slate-500">
            Quero encontrar vagas, cadastrar meu currículo e me candidatar a
            oportunidades.
          </p>
        </Link>

        <Link
          to="/cadastro/empresa"
          className="md:w-1/3 block p-8 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4 border-brand-orange"
        >
          <h2 className="text-2xl font-bold text-brand-blue">Sou Empresa</h2>
          <p className="mt-4 text-slate-500">
            Quero divulgar vagas, buscar talentos e gerenciar o processo
            seletivo.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default OpcaoCadastroPage;

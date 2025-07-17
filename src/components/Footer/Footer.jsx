import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/QV_Logo.jpg";

function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-16">
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <img
                src={logo}
                alt="Quero Vagas Logo"
                className="h-12 mr-3 bg-white p-1 rounded-md"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap">
                Quero Vagas
              </span>
            </Link>
            <p className="text-slate-400 text-sm">
              Conectando talentos e empresas em Camaçari e região. Sua próxima
              oportunidade de carreira começa aqui.
            </p>
          </div>

          <div>
            <h2 className="mb-6 text-sm font-semibold text-slate-300 uppercase">
              Navegação
            </h2>
            <ul className="text-slate-400 font-medium space-y-4">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vagas" className="hover:underline">
                  Ver Vagas
                </Link>
              </li>
              <li>
                <Link to="/empresas" className="hover:underline">
                  Para Empresas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-6 text-sm font-semibold text-slate-300 uppercase">
              Legal
            </h2>
            <ul className="text-slate-400 font-medium space-y-4">
              <li>
                <a href="#" className="hover:underline">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Termos & Condições
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-6 text-sm font-semibold text-slate-300 uppercase">
              Contato
            </h2>
            <ul className="text-slate-400 font-medium space-y-4">
              <li>
                <a
                  href="mailto:contato@querovagas.com.br"
                  className="hover:underline"
                >
                  contato@querovagas.com.br
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-slate-900 py-6 px-8">
        <p className="text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Quero Vagas™. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/QV_Logo.jpg";

const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

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

      <div className="bg-slate-900 py-6 px-8 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Quero Vagas™. Todos os direitos
          reservados.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Desenvolvido com ❤️ por{" "}
          <a
            href="https://github.com/rafaelsnts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-white hover:underline"
          >
            <GithubIcon />
            <span>Rafael Santos</span>
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/img/QV_Logo.jpg";

const MenuIcon = () => (
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
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Você foi desconectado. Até mais!");
    setIsMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-md h-20 flex items-center justify-between px-4 sm:px-8 relative z-50">
      <Link to="/" onClick={closeMenu}>
        <img src={logo} alt="Quero Vagas Logo" className="h-14" />
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <nav className="flex items-center gap-6">
          <Link
            to="/vagas"
            className="text-brand-blue font-semibold hover:text-brand-purple"
          >
            Vagas
          </Link>
          <Link
            to="/empresas"
            className="text-brand-blue font-semibold hover:text-brand-purple"
          >
            Para Empresas
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="font-semibold text-slate-700">
                Olá, {user?.nome}!
              </span>
              {user?.tipoUsuario === "EMPRESA" ? (
                <>
                  <Link
                    to="/empresa/dashboard"
                    className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-4 py-2 text-sm hover:bg-brand-purple hover:text-white"
                  >
                    Painel
                  </Link>
                  <Link
                    to="/empresa/perfil"
                    className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-4 py-2 text-sm hover:bg-brand-purple hover:text-white"
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/vagas/nova"
                    className="bg-brand-orange text-white font-bold rounded-lg px-4 py-2 text-sm hover:opacity-90"
                  >
                    Publicar Vaga
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/minhas-candidaturas"
                    className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-4 py-2 text-sm hover:bg-brand-purple hover:text-white"
                  >
                    Minhas Candidaturas
                  </Link>
                  <Link
                    to="/perfil"
                    className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-4 py-2 text-sm hover:bg-brand-purple hover:text-white"
                  >
                    Meu Perfil
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="bg-brand-purple text-white font-bold rounded-lg px-4 py-2 text-sm hover:opacity-90"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-6 py-2 hover:bg-brand-purple hover:text-white"
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="bg-brand-purple text-white font-bold rounded-lg px-6 py-2 hover:opacity-90"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 gap-4">
            <Link
              to="/vagas"
              onClick={closeMenu}
              className="px-4 py-2 rounded-md hover:bg-slate-100"
            >
              Vagas
            </Link>
            <Link
              to="/empresas"
              onClick={closeMenu}
              className="px-4 py-2 rounded-md hover:bg-slate-100"
            >
              Para Empresas
            </Link>
            <hr />
            {isAuthenticated ? (
              <>
                {user?.tipoUsuario === "EMPRESA" ? (
                  <>
                    <Link
                      to="/empresa/dashboard"
                      onClick={closeMenu}
                      className="px-4 py-2 rounded-md hover:bg-slate-100"
                    >
                      Painel
                    </Link>
                    <Link
                      to="/empresa/perfil"
                      onClick={closeMenu}
                      className="px-4 py-2 rounded-md hover:bg-slate-100"
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      to="/vagas/nova"
                      onClick={closeMenu}
                      className="px-4 py-2 rounded-md hover:bg-slate-100"
                    >
                      Publicar Vaga
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/minhas-candidaturas"
                      onClick={closeMenu}
                      className="px-4 py-2 rounded-md hover:bg-slate-100"
                    >
                      Minhas Candidaturas
                    </Link>
                    <Link
                      to="/perfil"
                      onClick={closeMenu}
                      className="px-4 py-2 rounded-md hover:bg-slate-100"
                    >
                      Meu Perfil
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="px-4 py-2 rounded-md hover:bg-slate-100"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  onClick={closeMenu}
                  className="px-4 py-2 rounded-md bg-brand-purple text-white text-center hover:opacity-90"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

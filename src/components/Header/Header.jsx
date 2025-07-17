import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/img/QV_Logo.jpg";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info("Você foi desconectado. Até mais!");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md h-20 flex items-center justify-between px-8">
      <Link to="/">
        <img src={logo} alt="Quero Vagas Logo" className="h-14" />
      </Link>

      <nav className="hidden md:flex space-x-6">
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

      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="font-semibold text-slate-700">
              Olá, {user?.nome}!
            </span>

            {user?.tipoUsuario === "EMPRESA" ? (
              <>
                <Link
                  to="/empresa/dashboard"
                  className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-6 py-2 hover:bg-brand-purple hover:text-white"
                >
                  Painel
                </Link>
                <Link
                  to="/empresa/perfil"
                  className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-6 py-2 hover:bg-brand-purple hover:text-white"
                >
                  Meu Perfil
                </Link>
                <Link
                  to="/vagas/nova"
                  className="bg-brand-orange text-white font-bold rounded-lg px-6 py-2 hover:opacity-90 transition-opacity"
                >
                  Publicar Vaga
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/minhas-candidaturas"
                  className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-6 py-2 hover:bg-brand-purple hover:text-white"
                >
                  Minhas Candidaturas
                </Link>
                <Link
                  to="/perfil"
                  className="text-brand-purple font-bold border-2 border-brand-purple rounded-lg px-6 py-2 hover:bg-brand-purple hover:text-white"
                >
                  Meu Perfil
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="bg-brand-purple text-white font-bold rounded-lg px-6 py-2 hover:opacity-90"
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
    </header>
  );
}

export default Header;

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 ml-1 text-slate-500 transition-transform duration-200"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-3 w-3 mr-1.5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const Avatar = ({ user, size = 10 }) => {
  const logoUrl =
    user?.tipoUsuario === "EMPRESA" ? user.perfilEmpresa?.logoUrl : null;
  const [status, setStatus] = useState(logoUrl ? "loading" : "idle");

  const initials =
    user?.nome
      ?.split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "";

  useEffect(() => {
    if (logoUrl) {
      setStatus("loading");
      const img = new Image();
      img.onload = () => setStatus("loaded");
      img.onerror = () => setStatus("error");
      img.src = logoUrl;
    } else {
      setStatus("idle");
    }
  }, [logoUrl]);

  if (logoUrl && status === "loaded") {
    return (
      <img
        src={logoUrl}
        alt={`Logo de ${user.nome}`}
        className={`h-${size} w-${size} rounded-full object-cover border-2 border-purple-200 bg-slate-100`}
      />
    );
  }

  return (
    <div
      className={`h-${size} w-${size} rounded-full bg-purple-100 text-brand-purple flex items-center justify-center font-bold border-2 border-purple-200 ${
        status === "loading" ? "animate-pulse" : ""
      }`}
    >
      {status === "loading" ? "..." : initials}
    </div>
  );
};

function Header() {
  const { isAuthenticated, user, logout, assinatura, assinaturaLoading } =
    useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef]);

  const handleLogout = () => {
    logout();
    toast.info("Você foi desconectado. Até mais!");
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  const PlanBadge = () => {
    if (user?.tipoUsuario !== "EMPRESA") return null;

    if (assinaturaLoading) {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-500 animate-pulse">
          Carregando...
        </div>
      );
    }

    if (!assinatura || !assinatura.plano) {
      return null;
    }

    const planoId = assinatura.plano.id;
    let styles = {
      bgColor: "bg-gray-200",
      textColor: "text-gray-800",
      text: assinatura.plano.nome,
      icon: null,
    };

    if (planoId === "profissional") {
      styles = {
        bgColor: "bg-brand-purple animate-glow",
        textColor: "text-white",
        text: "Profissional",
        icon: <StarIcon />,
      };
    } else if (planoId === "basico") {
      styles = {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        text: "Básico",
        icon: null,
      };
    }

    return (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors ${styles.bgColor} ${styles.textColor}`}
      >
        {styles.icon}
        {styles.text}
      </div>
    );
  };

  const activeLinkStyle = {
    color: "#5A2E98",
    borderBottom: "2px solid #5A2E98",
    paddingBottom: "4px",
  };

  return (
    <header className="bg-white shadow-md h-20 flex items-center justify-between px-4 sm:px-8 relative z-50">
      <Link to="/" onClick={closeMenu}>
        <img src={logo} alt="Quero Vagas Logo" className="h-14" />
      </Link>

      <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8">
        <NavLink
          to="/vagas"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="text-slate-600 font-semibold hover:text-brand-purple transition-colors"
        >
          Vagas
        </NavLink>
        <NavLink
          to="/empresas"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          className="text-slate-600 font-semibold hover:text-brand-purple transition-colors"
        >
          Para Empresas
        </NavLink>
      </nav>

      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <PlanBadge />
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Avatar user={user} />
                <span className="font-semibold text-slate-700 hidden lg:block">
                  {user?.nome}
                </span>
                <div
                  className={`${
                    isUserMenuOpen ? "rotate-180" : ""
                  } transition-transform`}
                >
                  <ChevronDownIcon />
                </div>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 border z-50">
                  <div className="px-4 py-3 border-b flex items-center gap-3">
                    <Avatar user={user} />
                    <div>
                      <p className="font-bold text-slate-800">{user?.nome}</p>
                      <p className="text-sm text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="border-t my-1"></div>
                  {user?.tipoUsuario === "CANDIDATO" && (
                    <>
                      <Link
                        to="/perfil"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                      >
                        Meu Perfil
                      </Link>
                      <Link
                        to="/minhas-candidaturas"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                      >
                        Minhas Candidaturas
                      </Link>
                    </>
                  )}
                  {user?.tipoUsuario === "EMPRESA" && (
                    <>
                      <Link
                        to="/empresa/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                      >
                        Painel da Empresa
                      </Link>
                      <Link
                        to="/empresa/perfil"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                      >
                        Meu Perfil
                      </Link>
                      <Link
                        to="/vagas/nova"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-100"
                      >
                        Publicar Vaga
                      </Link>
                    </>
                  )}
                  <div className="border-t my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-brand-purple font-bold px-4 py-2 rounded-lg hover:bg-purple-50"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="bg-brand-purple text-white font-bold rounded-lg px-4 py-2 hover:opacity-90"
            >
              Cadastrar
            </Link>
          </>
        )}
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
              className="px-4 py-2 rounded-md hover:bg-slate-100 font-semibold text-slate-700"
            >
              Vagas
            </Link>
            <Link
              to="/empresas"
              onClick={closeMenu}
              className="px-4 py-2 rounded-md hover:bg-slate-100 font-semibold text-slate-700"
            >
              Para Empresas
            </Link>
            <hr />
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} />
                    <span className="font-semibold text-slate-700">
                      {user?.nome}
                    </span>
                  </div>
                  <PlanBadge />
                </div>
                {user?.tipoUsuario === "CANDIDATO" && (
                  <>
                    <Link
                      to="/perfil"
                      onClick={closeMenu}
                      className="px-4 py-2 rounded-md hover:bg-slate-100"
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      to="/minhas-candidaturas"
                      onClick={closeMenu}
                      className="px-4 py-2 rounded-md hover:bg-slate-100"
                    >
                      Minhas Candidaturas
                    </Link>
                  </>
                )}
                {user?.tipoUsuario === "EMPRESA" && (
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
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-md text-red-600 hover:bg-red-50 font-semibold"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="px-4 py-2 rounded-md hover:bg-slate-100 text-center font-bold text-brand-purple border-2 border-brand-purple"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  onClick={closeMenu}
                  className="px-4 py-2 rounded-md bg-brand-purple text-white text-center font-bold hover:opacity-90"
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

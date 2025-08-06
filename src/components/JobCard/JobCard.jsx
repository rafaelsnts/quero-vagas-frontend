import React from "react";
import { Link } from "react-router-dom";

function JobCard({ vaga }) {
  const isDestaque =
    vaga.destaqueExpiresAt && new Date(vaga.destaqueExpiresAt) > new Date();

  const cardClasses = isDestaque
    ? "border-yellow-400 shadow-lg"
    : "border-brand-purple";

  return (
    <div
      className={`relative bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 ${cardClasses}`}
    >
      {isDestaque && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-md">
          DESTAQUE
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-brand-blue">{vaga.titulo}</h3>
        <p className="text-md text-slate-700 mt-1">{vaga.empresa.user.nome}</p>
      </div>
      <div className="mt-6 text-right">
        <Link
          to={`/vagas/${vaga.id}`}
          className="bg-brand-purple text-white font-bold rounded-lg px-5 py-2 hover:opacity-90"
        >
          Ver Detalhes
        </Link>
      </div>
    </div>
  );
}
export default JobCard;

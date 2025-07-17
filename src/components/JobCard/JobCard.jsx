import React from "react";
import { Link } from "react-router-dom";

function JobCard({ vaga }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-brand-purple">
      <div>
        <h3 className="text-xl font-bold text-brand-blue">{vaga.titulo}</h3>
        <p className="text-md text-slate-700 mt-1">{vaga.empresa.nome}</p>
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

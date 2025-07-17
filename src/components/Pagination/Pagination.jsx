import React from "react";

function Pagination({ paginaAtual, totalPaginas, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPaginas; i++) {
    pageNumbers.push(i);
  }

  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <nav className="flex justify-center my-8">
      <ul className="flex items-center -space-x-px h-10 text-base">
        <li>
          <button
            onClick={() => onPageChange(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
        </li>
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 ${
                paginaAtual === number
                  ? "z-10 text-brand-purple border-brand-purple bg-purple-50"
                  : "text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => onPageChange(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-s-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;

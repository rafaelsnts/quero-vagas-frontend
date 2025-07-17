import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

function DetalheCandidatoPage() {
  const { candidatoId } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await api.get(`/perfis/${candidatoId}`);
        setPerfil(response.data);
      } catch (error) {
        toast.error("Não foi possível carregar o perfil deste candidato.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [candidatoId]);

  if (loading)
    return <p className="text-center">Carregando perfil do candidato...</p>;
  if (!perfil)
    return (
      <p className="text-center text-red-500">
        Não foi possível carregar o perfil.
      </p>
    );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-brand-blue">{perfil.nome}</h1>
        <p className="text-slate-500">{perfil.email}</p>
        {perfil.perfil?.linkedin && (
          <a
            href={perfil.perfil.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Perfil no LinkedIn
          </a>
        )}
        {perfil.perfil?.curriculoUrl && (
          <a
            href={`http://localhost:3001/files${perfil.perfil.curriculoUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-purple font-semibold hover:underline ml-4"
          >
            Baixar Currículo
          </a>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue mb-4">Sobre</h2>
        <p className="text-slate-600 break-words">
          {perfil.perfil?.resumo || "O candidato não preencheu um resumo."}
        </p>
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-semibold text-slate-800">Habilidades</h3>
          <p className="text-slate-600 break-words">
            {perfil.perfil?.habilidades || "Nenhuma habilidade informada."}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue mb-4">
          Experiência Profissional
        </h2>
        <div className="space-y-4">
          {perfil.experiencias?.length > 0 ? (
            perfil.experiencias.map((exp) => (
              <div key={exp.id} className="border-b last:border-b-0 pb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  {exp.cargo}
                </h3>
                <p className="text-md font-semibold text-slate-600">
                  {exp.empresa}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(exp.dataInicio).toLocaleDateString()} -{" "}
                  {exp.dataFim
                    ? new Date(exp.dataFim).toLocaleDateString()
                    : "Atual"}
                </p>
                <p className="text-slate-600 mt-2 break-words">
                  {exp.descricao}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-500">
              Nenhuma experiência profissional informada.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue mb-4">
          Formação Acadêmica
        </h2>
        <div className="space-y-4">
          {perfil.formacoesAcademicas?.length > 0 ? (
            perfil.formacoesAcademicas.map((form) => (
              <div key={form.id} className="border-b last:border-b-0 pb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  {form.curso}
                </h3>
                <p className="text-md font-semibold text-slate-600">
                  {form.instituicao} - {form.grau}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(form.dataInicio).toLocaleDateString()} -{" "}
                  {form.dataFim
                    ? new Date(form.dataFim).toLocaleDateString()
                    : "Atual"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-500">
              Nenhuma formação acadêmica informada.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalheCandidatoPage;

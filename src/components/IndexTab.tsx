import React, { useState, useMemo } from 'react';
import { Hash, Search, ArrowRight, FileText, Layers, TrendingUp } from 'lucide-react';
import { Chunk, IndiceInvertidoData } from '../types';

interface IndexTabProps {
  indiceData: IndiceInvertidoData | null;
  chunksMap: Map<string, Chunk>;
}

export const IndexTab: React.FC<IndexTabProps> = ({ indiceData, chunksMap }) => {
  const [filtroTermo, setFiltroTermo] = useState('');
  const [termoSelecionado, setTermoSelecionado] = useState<string>('mestrado');
  const [paginaTermos, setPaginaTermos] = useState(1);
  const termosPorPagina = 24;

  const metadados = indiceData?.metadados;

  // Top mais frequentes do corpus
  const topTermos = useMemo(() => {
    if (!indiceData) return [];
    return Object.entries(indiceData.indice_invertido)
      .map(([termo, dados]) => ({
        termo,
        frequencia_total: dados.frequencia_total,
        total_chunks: dados.chunks.length,
      }))
      .sort((a, b) => b.frequencia_total - a.frequencia_total)
      .slice(0, 30);
  }, [indiceData]);

  const termosFiltrados = useMemo(() => {
    if (!indiceData) return [];
    const todos = Object.keys(indiceData.indice_invertido).sort();
    if (!filtroTermo.trim()) return todos;
    const q = filtroTermo.toLowerCase();
    return todos.filter((t) => t.includes(q));
  }, [indiceData, filtroTermo]);

  const totalPaginas = Math.ceil(termosFiltrados.length / termosPorPagina) || 1;
  const termosExibidos = useMemo(() => {
    const inicio = (paginaTermos - 1) * termosPorPagina;
    return termosFiltrados.slice(inicio, inicio + termosPorPagina);
  }, [termosFiltrados, paginaTermos]);

  const dadosTermoSelecionado = useMemo(() => {
    if (!indiceData || !termoSelecionado) return null;
    return indiceData.indice_invertido[termoSelecionado] || null;
  }, [indiceData, termoSelecionado]);

  return (
    <div className="space-y-6">
      {/* Index Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Total de Termos (Vocabulário)</span>
          <div className="text-2xl font-bold text-white mt-1">
            {metadados?.total_termos.toLocaleString('pt-BR') ?? 5258}
          </div>
          <span className="text-[11px] text-cyan-400">Tokens alfanuméricos únicos</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Total de Postings</span>
          <div className="text-2xl font-bold text-white mt-1">
            {metadados?.total_postings.toLocaleString('pt-BR') ?? 19863}
          </div>
          <span className="text-[11px] text-emerald-400">Pares (Termo, ID_Chunk)</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Total de Ocorrências</span>
          <div className="text-2xl font-bold text-amber-300 mt-1">
            {metadados?.total_ocorrencias.toLocaleString('pt-BR') ?? 35827}
          </div>
          <span className="text-[11px] text-slate-500">Palavras contadas no corpus</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Tempo de Construção</span>
          <div className="text-2xl font-bold text-slate-200 mt-1">
            {metadados?.tempo_construcao_segundos ?? 0.043}{' '}
            <span className="text-xs text-slate-400 font-normal">s</span>
          </div>
          <span className="text-[11px] text-slate-500">Indexação Python in-memory</span>
        </div>
      </div>

      {/* Top Terms Bar / Preview */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Termos com Maior Frequência no Corpus</h3>
          <span className="text-xs text-slate-500">(Distribuição empírica estilo Lei de Zipf)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {topTermos.map((item) => (
            <button
              key={item.termo}
              onClick={() => setTermoSelecionado(item.termo)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                termoSelecionado === item.termo
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              <span className="font-semibold">{item.termo}</span>
              <span className="text-[10px] opacity-75 font-mono">
                {item.frequencia_total}x
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Term browser and Postings viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Term search & list */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Hash className="w-4 h-4 text-cyan-400" />
              Vocabulário ({termosFiltrados.length})
            </h3>
            <span className="text-xs text-slate-500">Ordem lexicográfica</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={filtroTermo}
              onChange={(e) => {
                setFiltroTermo(e.target.value);
                setPaginaTermos(1);
              }}
              placeholder="Filtrar vocabulário..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-[480px] overflow-y-auto pr-1">
            {termosExibidos.map((t) => {
              const info = indiceData?.indice_invertido[t];
              const isSelected = termoSelecionado === t;
              return (
                <button
                  key={t}
                  onClick={() => setTermoSelecionado(t)}
                  className={`text-left px-2.5 py-1.5 rounded-md text-xs font-mono flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="truncate mr-1">{t}</span>
                  <span className="text-[10px] opacity-75 shrink-0">
                    {info?.frequencia_total || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <button
                disabled={paginaTermos <= 1}
                onClick={() => setPaginaTermos((p) => Math.max(1, p - 1))}
                className="px-2 py-0.5 bg-slate-800 disabled:opacity-40 rounded"
              >
                Ant.
              </button>
              <span>
                {paginaTermos} / {totalPaginas}
              </span>
              <button
                disabled={paginaTermos >= totalPaginas}
                onClick={() => setPaginaTermos((p) => Math.min(totalPaginas, p + 1))}
                className="px-2 py-0.5 bg-slate-800 disabled:opacity-40 rounded"
              >
                Próx.
              </button>
            </div>
          )}
        </div>

        {/* Postings List Detail for selected term */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Postings do Termo:</div>
              <div className="text-xl font-bold text-cyan-300 font-mono mt-0.5">
                "{termoSelecionado}"
              </div>
            </div>
            {dadosTermoSelecionado && (
              <div className="text-right text-xs">
                <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2.5 py-1 rounded-md font-mono font-semibold">
                  {dadosTermoSelecionado.chunks.length} chunks • {dadosTermoSelecionado.frequencia_total} ocorrências
                </span>
              </div>
            )}
          </div>

          {dadosTermoSelecionado ? (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2">
              {dadosTermoSelecionado.chunks.map((posting) => {
                const chunk = chunksMap.get(posting.id_chunk);
                return (
                  <div
                    key={posting.id_chunk}
                    className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 text-xs space-y-2 hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">
                          {posting.id_chunk}
                        </span>
                        {chunk && (
                          <span className="text-slate-300 truncate max-w-xs">
                            {chunk.nome_arquivo}
                          </span>
                        )}
                      </div>
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-mono font-semibold">
                        freq: {posting.frequencia}
                      </span>
                    </div>

                    {chunk && (
                      <p className="text-slate-300 line-clamp-3 leading-relaxed font-sans bg-slate-900/40 p-2 rounded">
                        {chunk.texto}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-10">
              Selecione um termo no vocabulário para inspecionar sua lista de postings invertida.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

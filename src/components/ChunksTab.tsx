import React, { useState, useMemo } from 'react';
import { Layers, Search, Filter, Copy, Check, FileText, CheckCircle2 } from 'lucide-react';
import { Chunk, DocumentoCatalogo } from '../types';

interface ChunksTabProps {
  chunks: Chunk[];
  documentos: DocumentoCatalogo[];
}

export const ChunksTab: React.FC<ChunksTabProps> = ({ chunks, documentos }) => {
  const [buscaTexto, setBuscaTexto] = useState('');
  const [filtroDoc, setFiltroDoc] = useState('');
  const [apenasCruzamPagina, setApenasCruzamPagina] = useState(false);
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 15;

  const totalCruzam = useMemo(() => {
    return chunks.filter((c) => c.paginas.length > 1).length;
  }, [chunks]);

  const chunksFiltrados = useMemo(() => {
    return chunks.filter((c) => {
      if (filtroDoc && c.id_documento !== filtroDoc) return false;
      if (apenasCruzamPagina && c.paginas.length <= 1) return false;
      if (buscaTexto.trim()) {
        const termo = buscaTexto.toLowerCase();
        return (
          c.id_chunk.toLowerCase().includes(termo) ||
          c.texto.toLowerCase().includes(termo) ||
          c.nome_arquivo.toLowerCase().includes(termo)
        );
      }
      return true;
    });
  }, [chunks, filtroDoc, apenasCruzamPagina, buscaTexto]);

  const totalPaginas = Math.ceil(chunksFiltrados.length / itensPorPagina) || 1;
  const chunksExibidos = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return chunksFiltrados.slice(inicio, inicio + itensPorPagina);
  }, [chunksFiltrados, paginaAtual]);

  const copyChunk = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Chunking Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Total de Chunks</span>
          <div className="text-2xl font-bold text-white mt-1">{chunks.length}</div>
          <span className="text-[11px] text-cyan-400">Coleção contínua gerada</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Configuração de Janelamento</span>
          <div className="text-xl font-bold text-white mt-1">200 / 30</div>
          <span className="text-[11px] text-slate-400">200 palavras • 30 overlap (passo 170)</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Overlap Entre Páginas</span>
          <div className="text-2xl font-bold text-amber-300 mt-1">{totalCruzam}</div>
          <span className="text-[11px] text-amber-400/80">
            {((totalCruzam / chunks.length) * 100).toFixed(1)}% cruzam fronteiras
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Densidade Média</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">196.8</div>
          <span className="text-[11px] text-slate-500">palavras/chunk (alta densidade)</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={buscaTexto}
              onChange={(e) => {
                setBuscaTexto(e.target.value);
                setPaginaAtual(1);
              }}
              placeholder="Buscar em texto ou ID de chunk..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Doc filter */}
          <div>
            <select
              value={filtroDoc}
              onChange={(e) => {
                setFiltroDoc(e.target.value);
                setPaginaAtual(1);
              }}
              className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="">Todos os 7 documentos</option>
              {documentos.map((doc) => (
                <option key={doc.id_documento} value={doc.id_documento}>
                  {doc.id_documento} - {doc.nome_arquivo}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle cross-page */}
          <label className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg cursor-pointer text-xs text-slate-300 hover:border-slate-700 select-none">
            <input
              type="checkbox"
              checked={apenasCruzamPagina}
              onChange={(e) => {
                setApenasCruzamPagina(e.target.checked);
                setPaginaAtual(1);
              }}
              className="rounded bg-slate-900 border-slate-700 text-cyan-600 focus:ring-cyan-500 h-4 w-4"
            />
            <span>Apenas chunks que cruzam páginas ({totalCruzam})</span>
          </label>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Exibindo {chunksFiltrados.length} de {chunks.length} chunks</span>
          {chunksFiltrados.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                disabled={paginaAtual <= 1}
                onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-slate-800 disabled:opacity-40 rounded hover:bg-slate-700"
              >
                Anterior
              </button>
              <span>
                Página {paginaAtual} de {totalPaginas}
              </span>
              <button
                disabled={paginaAtual >= totalPaginas}
                onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                className="px-2.5 py-1 bg-slate-800 disabled:opacity-40 rounded hover:bg-slate-700"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chunks List */}
      <div className="space-y-3">
        {chunksExibidos.map((chunk) => {
          const cruzou = chunk.paginas.length > 1;
          return (
            <div
              key={chunk.id_chunk}
              className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/70 px-2 py-0.5 rounded">
                    {chunk.id_chunk}
                  </span>
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {chunk.nome_arquivo}
                  </span>
                  {cruzou ? (
                    <span className="bg-amber-950/70 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded text-[11px] font-medium">
                      Páginas [{chunk.paginas.join(', ')}] • Cruzou Página
                    </span>
                  ) : (
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">
                      Página {chunk.paginas[0]}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span className="font-mono text-[11px]">
                    Palavras: {chunk.quantidade_palavras} (pos. {chunk.inicio_palavra}..{chunk.fim_palavra})
                  </span>
                  <button
                    onClick={() => copyChunk(chunk.texto, chunk.id_chunk)}
                    className="p-1 hover:text-slate-200 text-slate-400 bg-slate-800/60 rounded"
                    title="Copiar texto do chunk"
                  >
                    {copiadoId === chunk.id_chunk ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/50 p-3 rounded-lg border border-slate-800/40">
                {chunk.texto}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

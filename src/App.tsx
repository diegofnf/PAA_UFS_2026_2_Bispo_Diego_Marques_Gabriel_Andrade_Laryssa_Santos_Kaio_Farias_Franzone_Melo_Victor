import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { SearchTab } from './components/SearchTab';
import { CorpusTab } from './components/CorpusTab';
import { ChunksTab } from './components/ChunksTab';
import { IndexTab } from './components/IndexTab';
import { PipelineTab } from './components/PipelineTab';
import {
  DocumentoCatalogo,
  DocumentoNormalizado,
  Chunk,
  IndiceInvertidoData,
  RelatorioProcessamento,
  RelatorioChunking,
  RelatorioIndexacao,
} from './types';
import { Loader2, AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'corpus' | 'chunks' | 'index' | 'pipeline'>('search');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [documentos, setDocumentos] = useState<DocumentoCatalogo[]>([]);
  const [documentosNormalizados, setDocumentosNormalizados] = useState<DocumentoNormalizado[]>([]);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [indiceData, setIndiceData] = useState<IndiceInvertidoData | null>(null);
  const [relatorioProcessamento, setRelatorioProcessamento] = useState<RelatorioProcessamento | null>(null);
  const [relatorioChunking, setRelatorioChunking] = useState<RelatorioChunking | null>(null);
  const [relatorioIndexacao, setRelatorioIndexacao] = useState<RelatorioIndexacao | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setError(null);

        const [
          resCatalogo,
          resDocsNorm,
          resChunks,
          resIndice,
          resRelProc,
          resRelChunk,
          resRelIdx,
        ] = await Promise.all([
          fetch('/data/catalogo_documentos.json').then((r) => r.json()),
          fetch('/data/documentos_normalizados.json').then((r) => r.json()),
          fetch('/data/chunks.json').then((r) => r.json()),
          fetch('/data/indice_invertido.json').then((r) => r.json()),
          fetch('/data/relatorio_processamento.json').then((r) => r.json()),
          fetch('/data/relatorio_chunking.json').then((r) => r.json()),
          fetch('/data/relatorio_indexacao.json').then((r) => r.json()),
        ]);

        setDocumentos(resCatalogo.documentos || []);
        setDocumentosNormalizados(resDocsNorm.documentos || []);
        setChunks(resChunks.chunks || []);
        setIndiceData(resIndice);
        setRelatorioProcessamento(resRelProc);
        setRelatorioChunking(resRelChunk);
        setRelatorioIndexacao(resRelIdx);
      } catch (err: any) {
        console.error('Erro ao carregar dados do pipeline:', err);
        setError(err?.message || 'Falha ao carregar artefatos do pipeline');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const chunksMap = useMemo(() => {
    const map = new Map<string, Chunk>();
    for (const chunk of chunks) {
      map.set(chunk.id_chunk, chunk);
    }
    return map;
  }, [chunks]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalDocs={documentos.length}
        totalChunks={chunks.length}
        totalTermos={indiceData?.metadados?.total_termos || 5258}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-slate-200">
              Carregando Corpus e Índice Invertido...
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Inicializando dicionário com 5.258 termos, 19.863 postings e 182 chunks normalizados.
            </p>
          </div>
        ) : error ? (
          <div className="bg-rose-950/40 border border-rose-800 rounded-xl p-6 text-center max-w-lg mx-auto my-12">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">
              Falha ao carregar artefatos
            </h3>
            <p className="text-xs text-rose-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Recarregar aplicação
            </button>
          </div>
        ) : (
          <div>
            {activeTab === 'search' && (
              <SearchTab
                documentos={documentos}
                chunks={chunks}
                chunksMap={chunksMap}
                indiceData={indiceData}
              />
            )}

            {activeTab === 'corpus' && (
              <CorpusTab
                documentos={documentos}
                documentosNormalizados={documentosNormalizados}
              />
            )}

            {activeTab === 'chunks' && (
              <ChunksTab chunks={chunks} documentos={documentos} />
            )}

            {activeTab === 'index' && (
              <IndexTab indiceData={indiceData} chunksMap={chunksMap} />
            )}

            {activeTab === 'pipeline' && (
              <PipelineTab
                relatorioProcessamento={relatorioProcessamento}
                relatorioChunking={relatorioChunking}
                relatorioIndexacao={relatorioIndexacao}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-300">
              UFS • PAA 2026.2 (Projeto e Análise de Algoritmos)
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Bispo Diego, Marques Gabriel, Andrade Laryssa, Santos Kaio, Franzone Melo Victor
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Corpus PROCC/UFS</span>
            <span>•</span>
            <span>Merge Sort O(n log n)</span>
            <span>•</span>
            <span>Índice Invertido O(1)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

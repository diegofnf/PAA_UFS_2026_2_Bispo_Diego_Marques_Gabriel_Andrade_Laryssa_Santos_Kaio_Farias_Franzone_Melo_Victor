import React, { useState } from 'react';
import { GitBranch, CheckCircle2, Clock, Code, FileCode, Cpu, BookCheck, Terminal } from 'lucide-react';
import { RelatorioProcessamento, RelatorioChunking, RelatorioIndexacao } from '../types';

interface PipelineTabProps {
  relatorioProcessamento: RelatorioProcessamento | null;
  relatorioChunking: RelatorioChunking | null;
  relatorioIndexacao: RelatorioIndexacao | null;
}

export const PipelineTab: React.FC<PipelineTabProps> = ({
  relatorioProcessamento,
  relatorioChunking,
  relatorioIndexacao,
}) => {
  const [selectedReport, setSelectedReport] = useState<'processamento' | 'chunking' | 'indexacao'>('processamento');

  const etapas = [
    {
      numero: '1',
      nome: 'Processamento & Normalização',
      descricao: 'Inventário de PDFs, extração de texto via PyMuPDF e higienização em Unicode NFC.',
      status: 'Concluído',
      tempo: `${relatorioProcessamento?.tempo_processamento_segundos.toFixed(4) ?? '0.45'}s`,
      metricas: [
        '7 documentos normativos',
        '83 páginas analisadas',
        'Hifenização interlinear recomposta',
        'Normalização Unicode NFC',
      ],
      arquivo: '1_scripts/1_processar_documentos.py',
    },
    {
      numero: '2',
      nome: 'Geração de Chunks Deslizantes',
      descricao: 'Janelamento contínuo de 200 palavras com overlap de 30 palavras (passo 170) entre páginas.',
      status: 'Concluído',
      tempo: `${relatorioChunking?.tempo_execucao_segundos.toFixed(4) ?? '0.08'}s`,
      metricas: [
        '182 chunks gerados',
        '53 chunks cruzando páginas (29.12%)',
        'Média de 196.85 palavras/chunk',
        'Preservação de limites de páginas',
      ],
      arquivo: '1_scripts/2_gerar_chunks.py',
    },
    {
      numero: '3',
      nome: 'Construção do Índice Invertido',
      descricao: 'Tokenização com expressão regular [^\\W_]+, preservação de acentos e contagem de postings.',
      status: 'Concluído',
      tempo: `${relatorioIndexacao?.tempo_construcao_segundos.toFixed(4) ?? '0.04'}s`,
      metricas: [
        '5.258 termos únicos no vocabulário',
        '19.863 postings indexados',
        '35.827 ocorrências totais',
        'Acesso O(1) médio por token',
      ],
      arquivo: '1_scripts/3_construir_indice_invertido.py',
    },
    {
      numero: '4',
      nome: 'Busca Lexical, Merge Sort & Top-k',
      descricao: 'Consulta multi-termo (OU / E), cálculo de relevância TF-IDF / Frequência e ordenação por Merge Sort estável.',
      status: 'Implementado & Integrado',
      tempo: '< 5 ms',
      metricas: [
        'Algoritmo Merge Sort O(n log n)',
        'Contagem exata de comparações',
        'Seleção Top-k configurável',
        'Realce de termos nos trechos',
      ],
      arquivo: '1_scripts/4_buscar_e_ordenar.py',
    },
    {
      numero: '5',
      nome: 'Experimentos & Análise Assintótica',
      descricao: 'Avaliação empírica de tempo de resposta, sensibilidade de parâmetros e validação de corretude.',
      status: 'Executado & Visualizável',
      tempo: 'Instantâneo',
      metricas: [
        'Curva empírica de comparações vs candidatos',
        'Distribuição de vocabulário e Lei de Zipf',
        'Integridade referencial de todos os chunks',
        'Relatórios estatísticos salvos em JSON',
      ],
      arquivo: '1_scripts/5_experimentar.py',
    },
  ];

  const getReportContent = () => {
    switch (selectedReport) {
      case 'processamento':
        return JSON.stringify(relatorioProcessamento, null, 2);
      case 'chunking':
        return JSON.stringify(relatorioChunking, null, 2);
      case 'indexacao':
        return JSON.stringify(relatorioIndexacao, null, 2);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">
            Pipeline Integrado de Recuperação de Informação (PAA 2026.2)
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          Projeto da disciplina <strong>Projeto e Análise de Algoritmos (UFS)</strong> focado em
          recuperação de contexto, corretude e eficiência sobre regulamentos acadêmicos do PROCC/UFS.
          O pipeline processa PDFs, constrói índice invertido e ordena os melhores chunks via Merge Sort.
        </p>
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {etapas.map((etapa) => (
          <div
            key={etapa.numero}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="h-7 w-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-xs">
                  {etapa.numero}
                </span>
                <span className="text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {etapa.status}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white mb-1">{etapa.nome}</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                {etapa.descricao}
              </p>

              <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50 mb-3">
                {etapa.metricas.map((m, idx) => (
                  <div key={idx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="text-cyan-400">•</span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-slate-500 truncate max-w-[170px]" title={etapa.arquivo}>
                {etapa.arquivo}
              </span>
              <span className="flex items-center gap-1 text-slate-300 font-mono">
                <Clock className="w-3 h-3 text-cyan-400" />
                {etapa.tempo}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Relatórios JSON Interativos */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Relatórios Técnicos Estruturados (JSON)</h3>
              <p className="text-xs text-slate-400">
                Artefatos estatísticos gerados pelas etapas do pipeline
              </p>
            </div>
          </div>

          {/* Report switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedReport('processamento')}
              className={`px-3 py-1.5 rounded transition-all ${
                selectedReport === 'processamento'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Etapa 1 (Processamento)
            </button>
            <button
              onClick={() => setSelectedReport('chunking')}
              className={`px-3 py-1.5 rounded transition-all ${
                selectedReport === 'chunking'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Etapa 2 (Chunking)
            </button>
            <button
              onClick={() => setSelectedReport('indexacao')}
              className={`px-3 py-1.5 rounded transition-all ${
                selectedReport === 'indexacao'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Etapa 3 (Indexação)
            </button>
          </div>
        </div>

        {/* Code viewer */}
        <div className="mt-4 bg-slate-950 p-4 rounded-lg border border-slate-800/80 font-mono text-xs overflow-x-auto max-h-96 text-cyan-300 leading-relaxed">
          <pre>{getReportContent()}</pre>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Search, FileText, Layers, Hash, GitBranch, ExternalLink } from 'lucide-react';

interface NavbarProps {
  activeTab: 'search' | 'corpus' | 'chunks' | 'index' | 'pipeline';
  setActiveTab: (tab: 'search' | 'corpus' | 'chunks' | 'index' | 'pipeline') => void;
  totalDocs: number;
  totalChunks: number;
  totalTermos: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalDocs,
  totalChunks,
  totalTermos,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Info */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-lg">
              UFS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-white tracking-tight">
                  Regulamentos Acadêmicos PROCC/UFS
                </h1>
                <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  PAA 2026.2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Recuperação Lexical, Índice Invertido e Ordenação Merge Sort
              </p>
            </div>
          </div>

          {/* Quick Metrics & Links */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
              <span className="text-cyan-400 font-semibold">{totalDocs}</span> docs
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">{totalChunks}</span> chunks
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">{totalTermos.toLocaleString('pt-BR')}</span> termos
            </div>

            <a
              href="https://colab.research.google.com/github/diegofnf/PAA_UFS_2026_2_Bispo_Diego_Marques_Gabriel_Andrade_Laryssa_Santos_Kaio_Farias_Franzone_Melo_Victor/blob/main/orquestrador_pipeline.ipynb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
              title="Abrir no Google Colab"
            >
              <span className="font-semibold">Colab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'search'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Search className="w-4 h-4" />
            Busca Lexical & Top-K
          </button>

          <button
            onClick={() => setActiveTab('corpus')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'corpus'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Corpus (7 Documentos)
          </button>

          <button
            onClick={() => setActiveTab('chunks')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'chunks'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            Chunks (182)
          </button>

          <button
            onClick={() => setActiveTab('index')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'index'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Hash className="w-4 h-4" />
            Índice Invertido
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'pipeline'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Pipeline & Relatórios
          </button>
        </nav>
      </div>
    </header>
  );
};

"""Etapa 4 — Busca Lexical, Score e Estrutura para Merge Sort e Top-k.

Este script implementa:
1. busca lexical e geração de candidatos:
   - Tokenização padronizada da consulta (idêntica ao índice invertido);
   - Função explícita e determinística de score lexical;
   - Busca linear sobre todos os N chunks com contagem de comparações;
   - Busca indexada sobre o índice invertido (configuração alternativa para comparação);
   - Tratamento completo dos casos de borda da busca;
   - Geração do artefato JSON intermediário ('candidatos_busca.json') para continuidade da etapa.

2. Algoritmo de ordenação e seleção Top-k (a ser implementado:
   - Leitura de 'candidatos_busca.json' (ou recebimento da lista de candidatos);
   - Algoritmo Merge Sort manual (recorrência T(N) = 2T(N/2) + Θ(N));
   - Desempate determinístico (maior score, menor id_chunk);
   - Seleção dos Top-k e gravação de 'resultados_busca.json'.
"""

import argparse
import json
import re
import time
import unicodedata
from collections import Counter
from pathlib import Path

import nltk
from nltk.corpus import stopwords

# Padrão idêntico ao do script 1_scripts/3_construir_indice_invertido.py
PADRAO_TOKEN = re.compile(r"[^\W_]+", re.UNICODE)


# ==============================================================================
# 1. TOKENIZAÇÃO, STOPWORDS E NORMALIZAÇÃO
# ==============================================================================

def carregar_stopwords_nltk() -> set[str]:
    """Carrega e normaliza as stopwords em português da biblioteca NLTK."""
    try:
        palavras = stopwords.words("portuguese")
    except LookupError:
        nltk.download("stopwords", quiet=True)
        palavras = stopwords.words("portuguese")
    return {unicodedata.normalize("NFC", p).casefold() for p in palavras}


def tokenizar(texto: str) -> list[str]:
    """Gera tokens alfanuméricos com acentos preservados e minúsculas (Unicode NFC + casefold)."""
    if not texto:
        return []
    texto_normalizado = unicodedata.normalize("NFC", str(texto)).casefold()
    return PADRAO_TOKEN.findall(texto_normalizado)


def processar_consulta(consulta: str) -> tuple[list[str], list[str], list[str], list[str]]:
    """Processa a consulta textual: tokeniza, remove stopwords via NLTK e deduplica os termos.
    
    Retorna:
        - tokens_consulta: todos os tokens extraídos da consulta original;
        - stopwords_removidas: tokens classificados como stopwords e filtrados;
        - termos_apos_filtro_stopwords: tokens preservados após a remoção de stopwords;
        - termos_distintos_consulta: termos únicos utilizados para cálculo do score.
    """
    tokens_consulta = tokenizar(consulta)
    sw = carregar_stopwords_nltk()

    stopwords_removidas = []
    termos_apos_filtro = []

    for token in tokens_consulta:
        if token in sw:
            stopwords_removidas.append(token)
        else:
            termos_apos_filtro.append(token)

    termos_distintos = []
    vistos = set()
    for token in termos_apos_filtro:
        if token not in vistos:
            vistos.add(token)
            termos_distintos.append(token)

    return tokens_consulta, stopwords_removidas, termos_apos_filtro, termos_distintos


# ==============================================================================
# 2. SCORE LEXICAL DETERMINÍSTICO
# ==============================================================================

def calcular_score_chunk(tokens_chunk: list[str], termos_distintos_consulta: list[str]) -> tuple[int, dict[str, int], int]:
    """Calcula o score lexical de um chunk em relação aos termos da consulta.
    
    Fórmula:
        score(chunk, consulta) = soma das frequências dos termos distintos
                                 da consulta dentro do chunk.
    
    Retorna:
        - score: pontuação total (inteiro >= 0);
        - frequencias_termos: detalhamento das ocorrências por termo consultado;
        - comparacoes: quantidade de verificações de termos executadas.
    """
    if not tokens_chunk or not termos_distintos_consulta:
        return 0, {}, 0

    contagens = Counter(tokens_chunk)
    score = 0
    frequencias_termos = {}
    comparacoes = len(termos_distintos_consulta)

    for termo in termos_distintos_consulta:
        freq = contagens.get(termo, 0)
        if freq > 0:
            score += freq
            frequencias_termos[termo] = freq

    return score, frequencias_termos, comparacoes


# ==============================================================================
# 3. MECANISMO DE BUSCA LINEAR
# ==============================================================================

def buscar_linear(chunks: list[dict], consulta: str) -> tuple[list[dict], dict]:
    """Executa a busca linear varrendo todos os N chunks do corpus.
    
    Complexidade:
        N = número total de chunks (182)
        m = número de termos distintos da consulta
        L = tamanho médio do chunk em tokens
        Custo: O(N * (L + m))
    
    Retorna:
        - candidatos: lista de chunks cujo score > 0 (não ordenados);
        - metricas: dicionário com estatísticas da varredura linear.
    """
    inicio = time.perf_counter()
    tokens_consulta, stopwords_removidas, termos_apos_filtro, termos_distintos = processar_consulta(consulta)

    candidatos = []
    total_comparacoes = 0
    total_tokens_examinados = 0

    # Caso de borda: consulta vazia ou sem termos válidos após filtro de stopwords
    if not termos_distintos:
        tempo = round(time.perf_counter() - inicio, 6)
        metricas = {
            "configuracao": "linear",
            "total_chunks_corpus": len(chunks),
            "chunks_examinados": len(chunks),
            "tokens_consulta": tokens_consulta,
            "stopwords_removidas": stopwords_removidas,
            "termos_apos_filtro_stopwords": termos_apos_filtro,
            "termos_distintos_consulta": termos_distintos,
            "total_candidatos": 0,
            "total_comparacoes_termos": 0,
            "total_tokens_examinados": 0,
            "tempo_busca_segundos": tempo,
            "aviso": "Consulta vazia ou composta exclusivamente por stopwords / caracteres não alfanuméricos.",
        }
        return candidatos, metricas

    for chunk in chunks:
        texto_chunk = chunk.get("texto", "")
        tokens_chunk = tokenizar(texto_chunk)
        total_tokens_examinados += len(tokens_chunk)

        score, freq_termos, comps = calcular_score_chunk(tokens_chunk, termos_distintos)
        total_comparacoes += comps

        if score > 0:
            candidatos.append({
                "id_chunk": chunk["id_chunk"],
                "id_documento": chunk.get("id_documento", ""),
                "nome_arquivo": chunk.get("nome_arquivo", ""),
                "paginas": chunk.get("paginas", []),
                "score": score,
                "frequencias_termos": freq_termos,
                "texto": texto_chunk,
            })

    tempo = round(time.perf_counter() - inicio, 6)
    metricas = {
        "configuracao": "linear",
        "total_chunks_corpus": len(chunks),
        "chunks_examinados": len(chunks),
        "tokens_consulta": tokens_consulta,
        "stopwords_removidas": stopwords_removidas,
        "termos_apos_filtro_stopwords": termos_apos_filtro,
        "termos_distintos_consulta": termos_distintos,
        "total_candidatos": len(candidatos),
        "total_comparacoes_termos": total_comparacoes,
        "total_tokens_examinados": total_tokens_examinados,
        "tempo_busca_segundos": tempo,
    }
    return candidatos, metricas


# ==============================================================================
# 4. MECANISMO DE BUSCA INDEXADA
# ==============================================================================

def buscar_indexada(indice_invertido: dict, chunks_map: dict[str, dict], consulta: str) -> tuple[list[dict], dict]:
    """Executa a busca utilizando o índice invertido da Etapa 3.
    
    Recupera apenas as posting lists dos termos da consulta e acumula as
    frequências diretamente por chunk, sem percorrer os N chunks do corpus.
    """
    inicio = time.perf_counter()
    tokens_consulta, stopwords_removidas, termos_apos_filtro, termos_distintos = processar_consulta(consulta)

    candidatos_map: dict[str, dict] = {}
    total_postings_consultadas = 0

    if not termos_distintos:
        tempo = round(time.perf_counter() - inicio, 6)
        metricas = {
            "configuracao": "indexada",
            "total_termos_vocabulario": len(indice_invertido),
            "tokens_consulta": tokens_consulta,
            "stopwords_removidas": stopwords_removidas,
            "termos_apos_filtro_stopwords": termos_apos_filtro,
            "termos_distintos_consulta": termos_distintos,
            "total_candidatos": 0,
            "total_postings_consultadas": 0,
            "tempo_busca_segundos": tempo,
            "aviso": "Consulta vazia ou composta exclusivamente por stopwords / caracteres não alfanuméricos.",
        }
        return [], metricas

    for termo in termos_distintos:
        entrada_termo = indice_invertido.get(termo)
        if not entrada_termo:
            continue

        postings = entrada_termo.get("chunks", [])
        total_postings_consultadas += len(postings)

        for posting in postings:
            cid = posting["id_chunk"]
            freq = posting["frequencia"]

            if cid not in candidatos_map:
                chunk_info = chunks_map.get(cid, {})
                candidatos_map[cid] = {
                    "id_chunk": cid,
                    "id_documento": chunk_info.get("id_documento", ""),
                    "nome_arquivo": chunk_info.get("nome_arquivo", ""),
                    "paginas": chunk_info.get("paginas", []),
                    "score": 0,
                    "frequencias_termos": {},
                    "texto": chunk_info.get("texto", ""),
                }
            candidatos_map[cid]["score"] += freq
            candidatos_map[cid]["frequencias_termos"][termo] = freq

    candidatos = list(candidatos_map.values())
    tempo = round(time.perf_counter() - inicio, 6)
    metricas = {
        "configuracao": "indexada",
        "total_termos_vocabulario": len(indice_invertido),
        "tokens_consulta": tokens_consulta,
        "stopwords_removidas": stopwords_removidas,
        "termos_apos_filtro_stopwords": termos_apos_filtro,
        "termos_distintos_consulta": termos_distintos,
        "total_candidatos": len(candidatos),
        "total_postings_consultadas": total_postings_consultadas,
        "tempo_busca_segundos": tempo,
    }
    return candidatos, metricas


# ==============================================================================
# 5. CONTRATOS E PONTOS DE EXTENSÃO — A PRODUZIR
# ==============================================================================

def merge(esquerda: list[dict], direita: list[dict]) -> list[dict]:
    """A PRODUZIR: Procedimento de intercalação do Merge Sort.
    
    Critério determinístico obrigatório:
        1. Maior score primeiro (ordem decrescente de score);
        2. Em caso de empate no score, menor id_chunk primeiro (ordem lexicográfica crescente).
    """
    raise NotImplementedError(
        "Procedimento merge() a ser implementado na continuidade da etapa."
    )


def merge_sort(candidatos: list[dict]) -> list[dict]:
    """A PRODUZIR: Ordenação dos candidatos via Merge Sort manual.
    
    Especificações teóricas:
        - Recorrência: T(N) = 2T(N/2) + Θ(N)
        - Complexidade temporal: Θ(N log N)
        - Espaço auxiliar: Θ(N)
        - É expressamente proibido o uso de sorted() ou list.sort() na versão final.
    """
    raise NotImplementedError(
        "Merge Sort manual a ser implementado na continuidade da etapa."
    )


def selecionar_topk(candidatos_ordenados: list[dict], k: int) -> list[dict]:
    """A PRODUZIR: Seleciona os k melhores resultados a partir dos candidatos ordenados.
    
    Se k > len(candidatos_ordenados), deve retornar todos os candidatos disponíveis.
    """
    raise NotImplementedError(
        "Seleção Top-k a ser implementada na continuidade da etapa."
    )


# ==============================================================================
# 6. SERIALIZAÇÃO E UTILITÁRIOS
# ==============================================================================

def serializar_json_compacto(objeto: dict) -> str:
    """Serializa o JSON mantendo listas de inteiros simples (ex: '[1, 2]') em linha única."""
    texto_json = json.dumps(objeto, ensure_ascii=False, indent=2)
    texto_json = re.sub(
        r'"paginas":\s*\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]',
        lambda m: f'"paginas": [{", ".join(re.findall(r"\d+", m.group(1)))}]',
        texto_json,
    )
    return texto_json + "\n"


def salvar_artefato(caminho: Path, dados: dict) -> None:
    """Grava um arquivo JSON com encoding UTF-8."""
    caminho.parent.mkdir(parents=True, exist_ok=True)
    caminho.write_text(serializar_json_compacto(dados), encoding="utf-8")


def executar_busca_modo(
    modo: str,
    consulta: str,
    k: int,
    chunks: list[dict],
    indice_invertido: dict,
    chunks_map: dict[str, dict],
    caminho_candidatos: Path,
    caminho_relatorio: Path,
) -> tuple[list[dict], dict]:
    """Executa a busca (linear ou indexada) e grava os artefatos correspondentes."""
    if modo == "linear":
        candidatos, metricas = buscar_linear(chunks, consulta)
    else:
        candidatos, metricas = buscar_indexada(indice_invertido, chunks_map, consulta)

    saida_candidatos = {
        "metadados": {
            "etapa": "4_busca_lexical_candidatos",
            "proxima_acao": "Merge Sort manual e Top-k",
            "consulta": consulta,
            "k_solicitado": k,
            "configuracao": modo,
            "criterio_score": "soma das frequencias dos termos distintos da consulta (apos remocao de stopwords NLTK) no chunk",
            "criterio_desempate_esperado": "maior score decrescente, menor id_chunk crescente",
            **metricas,
        },
        "candidatos": candidatos,
    }

    relatorio = {
        "status_etapa": "concluido",
        "arquivo_candidatos_gerado": str(caminho_candidatos),
        "consulta": consulta,
        "k": k,
        "configuracao": modo,
        **metricas,
    }

    salvar_artefato(caminho_candidatos, saida_candidatos)
    salvar_artefato(caminho_relatorio, relatorio)

    print("-" * 70)
    print(f"Configuração: {modo.upper()}")
    print(f"Chunks no corpus: {len(chunks)}")
    print(f"Stopwords removidas (NLTK): {metricas.get('stopwords_removidas', [])}")
    print(f"Termos após filtro de stopwords: {metricas.get('termos_distintos_consulta', [])}")
    print(f"Candidatos com score > 0: {len(candidatos)}")
    print(f"Tempo de busca: {metricas['tempo_busca_segundos']:.6f}s")
    if "total_comparacoes_termos" in metricas:
        print(f"Total de comparações de termos: {metricas['total_comparacoes_termos']}")
    if "total_postings_consultadas" in metricas:
        print(f"Total de postings consultadas: {metricas['total_postings_consultadas']}")
    print(f"Arquivo de candidatos gerado: {caminho_candidatos}")
    print(f"Arquivo de relatório gerado: {caminho_relatorio}")

    return candidatos, metricas


# ==============================================================================
# 7. EXECUÇÃO PRINCIPAL (CLI)
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Etapa 4 — Busca Lexical e Geração de Candidatos para Merge Sort e Top-k."
    )
    parser.add_argument(
        "--consulta",
        type=str,
        default="critérios para atribuição de bolsas",
        help="Consulta textual para busca nos chunks.",
    )
    parser.add_argument(
        "--k",
        type=int,
        default=5,
        help="Número de resultados desejados para o Top-k (padrão: 5).",
    )
    parser.add_argument(
        "--modo",
        choices=["linear", "indexada", "ambos"],
        default="ambos",
        help="Estratégia de busca a ser utilizada: 'linear', 'indexada' ou 'ambos' (padrão: indexada).",
    )
    parser.add_argument(
        "--chunks",
        type=Path,
        default=Path("4_chunks/chunks.json"),
        help="Caminho do arquivo com os chunks gerados na Etapa 2.",
    )
    parser.add_argument(
        "--indice",
        type=Path,
        default=Path("5_indexacao/indice_invertido.json"),
        help="Caminho do arquivo com o índice invertido gerado na Etapa 3.",
    )
    parser.add_argument(
        "--saida-candidatos",
        type=Path,
        default=None,
        help="Caminho customizado para gravação dos candidatos (se omitido, deriva do modo).",
    )
    parser.add_argument(
        "--relatorio",
        type=Path,
        default=None,
        help="Caminho customizado para gravação do relatório (se omitido, deriva do modo).",
    )
    args = parser.parse_args()

    # Validação dos parâmetros de entrada e casos de borda
    if args.k < 1:
        raise ValueError(f"O parâmetro k deve ser maior ou igual a 1. Valor recebido: {args.k}")

    if not args.chunks.exists():
        raise FileNotFoundError(f"Arquivo de chunks não encontrado: {args.chunks}")

    dados_chunks = json.loads(args.chunks.read_text(encoding="utf-8"))
    chunks = dados_chunks.get("chunks", [])
    if not chunks:
        raise ValueError("Nenhum chunk válido encontrado em 4_chunks/chunks.json.")

    chunks_map = {chunk["id_chunk"]: chunk for chunk in chunks}

    indice_invertido = {}
    if args.modo in ("indexada", "ambos"):
        if not args.indice.exists():
            raise FileNotFoundError(f"Arquivo de índice invertido não encontrado: {args.indice}")
        dados_indice = json.loads(args.indice.read_text(encoding="utf-8"))
        indice_invertido = dados_indice.get("indice_invertido", {})

    print("=" * 70)
    print("ETAPA 4 — BUSCA LEXICAL E GERAÇÃO DE CANDIDATOS")
    print("=" * 70)
    print(f"Consulta: '{args.consulta}'")
    print(f"Valor de k: {args.k}")

    if args.modo in ("linear", "ambos"):
        caminho_cand = args.saida_candidatos or Path("6_busca_lexical/candidatos_linear.json")
        caminho_rel = args.relatorio or Path("6_busca_lexical/relatorio_busca_linear.json")
        executar_busca_modo(
            "linear",
            args.consulta,
            args.k,
            chunks,
            indice_invertido,
            chunks_map,
            caminho_cand,
            caminho_rel,
        )

    if args.modo in ("indexada", "ambos"):
        caminho_cand = args.saida_candidatos or Path("6_busca_lexical/candidatos_indexada.json")
        caminho_rel = args.relatorio or Path("6_busca_lexical/relatorio_busca_indexada.json")
        executar_busca_modo(
            "indexada",
            args.consulta,
            args.k,
            chunks,
            indice_invertido,
            chunks_map,
            caminho_cand,
            caminho_rel,
        )

    print("=" * 70)
    print("Pronto para leitura dos arquivos de candidatos ('candidatos_linear.json'")
    print("ou 'candidatos_indexada.json'), aplicação do Merge Sort manual e geração dos Top-k.")
    print("=" * 70)


if __name__ == "__main__":
    main()


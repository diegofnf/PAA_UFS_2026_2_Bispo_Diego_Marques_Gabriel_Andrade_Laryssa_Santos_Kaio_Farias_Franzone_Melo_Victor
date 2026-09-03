# Regulamentos acadêmicos e manuais públicos

Corretude, eficiência e recuperação de contexto para IA generativa.

Este README é o manual operacional do repositório. O relatório técnico concentra a fundamentação, as provas, a análise detalhada, os experimentos e a discussão; esta página será atualizada à medida que esses artefatos forem produzidos.

## Relatório técnico

- [Relatório em desenvolvimento](https://docs.google.com/document/d/1RLEssVnXO0mOw0kx70mevGKRufop8sq1oqN-WQzNv2I/edit?usp=sharing)
  
**A PRODUZIR:** adicionar o PDF final do relatório nesta seção quando ele estiver concluído.

## Apresentações

- [Checkpoint — 10/09/2026](https://docs.google.com/presentation/d/1RHaAl9oXhdnzkjwhi0gLFhiCCBeQxHgZQSAyOLu0M_M/edit)
- [Apresentação final — 24/09/2026](https://docs.google.com/presentation/d/1oCvhlEqzGFUmxv-1XzmbMLjySthox-GRHUXjkgRtdVs/edit)

As apresentações estão em desenvolvimento e serão atualizadas com os resultados finais.

## Orquestrador no Google Colab

- [Abrir `orquestrador_pipeline.ipynb` no Google Colab](https://colab.research.google.com/github/diegofnf/PAA_UFS_2026_2_Bispo_Diego_Marques_Gabriel_Andrade_Laryssa_Santos_Kaio_Farias_Franzone_Melo_Victor/blob/main/orquestrador_pipeline.ipynb)

## Vídeo da atividade

**URL pública:** **A PRODUZIR**.

## Status dos entregáveis

Os itens ainda não implementados ou não definidos estão marcados como **A PRODUZIR** e serão atualizados no decorrer do projeto.

## Estrutura do repositório

- `2_corpus/`: PDFs utilizados no corpus.
- `README.md`: dependências, ambiente, comandos, parâmetros e reprodução.
- `.gitignore`: arquivos de apoio e artefatos que não devem ser versionados.
- `1_scripts/1_processar_documentos.py`: inventário, extração, normalização e validação.
- `3_dados/`: JSONs gerados pelo pipeline.
- `4_chunks/`: chunks; **A PRODUZIR**.
- `5_indice_invertido/`: índice invertido; **A PRODUZIR**.
- `6_busca_lexical/`: resultados da busca lexical e Top-k; **A PRODUZIR**.
- `7_resultados/`: tabelas, gráficos e demais resultados; **A PRODUZIR**.
- `orquestrador_pipeline.ipynb`: execução integrada no Google Colab.

## Dependências

Python 3 e `pypdf`.

## Ambiente

Execução validada em Windows com Python 3. O script usa caminhos relativos ao repositório.

## Instalação

```bash
python -m pip install pypdf
```

## Execução

```bash
python 1_scripts/1_processar_documentos.py
```

## Parâmetros

O script aceita `--corpus` e `--saida`. Por padrão, utiliza `2_corpus/` e grava em `3_dados/`. Busca, `k` e chunking pertencem às etapas posteriores.

## Reprodução

1. Obter ou utilizar os PDFs do diretório `2_corpus/`.
2. Preparar o ambiente conforme as seções acima.
3. Executar os comandos do pipeline e dos experimentos.
4. Conferir os resultados, tabelas, gráficos e dados brutos gerados.

Os PDFs da atividade e do blueprint são arquivos de apoio e permanecem fora do versionamento por meio do `.gitignore`; o corpus usado pelo projeto está em `2_corpus/`.

## Corpus

Corpus normativo e orientativo público do PROCC/UFS e normas correlatas. Uso exclusivamente acadêmico.

- **Acesso/download:** 02/09/2026, às 21h10.
- **Quantidade:** 7 documentos, 83 páginas e aproximadamente 4,50 MB.
- **Idioma/formato:** português brasileiro; arquivos PDF.
- **Dados removidos ou anonimizados:** nenhum.
- **Limpeza e normalização:** Unicode NFC, quebras de linha, espaços repetidos e hifenização entre linhas; texto original preservado.
- **Chunking:** ainda será definido. Sugestão inicial: chunks de 200 palavras com overlap de 30 palavras.

| Documento | URL oficial |
|---|---|
| IN 02/2026/PROCC — Destinação de recursos financeiros | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=5040212&key=bd7f4126e48c0ff0c3f3ecd020bea2af) |
| IN 01/2026/PROCC — Credenciamento, recredenciamento e distribuição de vagas de orientação docente | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=5025297&key=2d84693e082547f2c3b9e5a7211baf63) |
| Edital CAPES nº 14/2023 — PRAPG | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=4214078&key=9a30771aef926507ec26e66ff5da6260) |
| IN 01/2023/PROCC — Estrutura curricular do Mestrado | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=4024039&key=3935a3b7b0d57462398d13c8fa68def5) |
| IN 01/2024/PROCC — Critérios para atribuição de bolsas | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=4357246&key=807372ebd6adf4d3ad63cd51277fec38) |
| Resolução nº 04/2021/CONEPE — Normas Acadêmicas da Pós-Graduação | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=2737960&key=1861aeae080b4f6318206935e3b17414) |
| Resolução nº 29/2022/CONEPE — Regimento Interno do PROCC | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=4218408&key=0f7e24ac2195143e5735697d19cb43ac) |





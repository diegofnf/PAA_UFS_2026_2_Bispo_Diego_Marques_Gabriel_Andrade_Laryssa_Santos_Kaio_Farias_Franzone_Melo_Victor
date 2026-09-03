# PAA_UFS_2026_2_Bispo_Diego_Marques_Gabriel_Andrade_Laryssa_Santos_Kaio_Farias_Franzone_Melo_Victor
Corretude, eficiência e recuperação de contexto para IA generativa

## Ficha do corpus

### Nome, fonte e URLs

**Nome:** Corpus normativo e orientativo público do PROCC/UFS e normas correlatas.

**Fonte:** documentos oficiais públicos disponibilizados no Sistema Integrado de Gestão de Atividades Acadêmicas (SIGAA) da Universidade Federal de Sergipe (UFS), no Regimento e nas normas do Programa de Pós-Graduação em Ciência da Computação (PROCC), além de edital da Coordenação de Aperfeiçoamento de Pessoal de Nível Superior (CAPES).

| Documento | URL oficial |
|---|---|
| IN 02/2026/PROCC — Destinação de recursos financeiros | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=5040212&key=bd7f4126e48c0ff0c3f3ecd020bea2af) |
| IN 01/2026/PROCC — Credenciamento, recredenciamento e distribuição de vagas de orientação docente | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=5025297&key=2d84693e082547f2c3b9e5a7211baf63) |
| Edital CAPES nº 14/2023 — Programa de Redução de Assimetrias na Pós-Graduação (PRAPG) | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=4214078&key=9a30771aef926507ec26e66ff5da6260) |
| IN 01/2023/PROCC — Estrutura curricular do Mestrado em Ciência da Computação | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=4024039&key=3935a3b7b0d57462398d13c8fa68def5) |
| IN 01/2024/PROCC — Critérios para atribuição de bolsas de estudo | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=4357246&key=807372ebd6adf4d3ad63cd51277fec38) |
| Resolução nº 04/2021/CONEPE — Normas Acadêmicas da Pós-Graduação Stricto Sensu | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=2737960&key=1861aeae080b4f6318206935e3b17414) |
| Resolução nº 29/2022/CONEPE — Regimento Interno do PROCC | [SIGAA](https://www.sigaa.ufs.br/sigaa/verProducao?idProducao=4218408&key=0f7e24ac2195143e5735697d19cb43ac) |

### Características

- **Data de acesso/download:** 02/09/2026, às 21h10.
- **Quantidade:** 7 documentos, totalizando 83 páginas.
- **Tamanho aproximado:** 4,50 MB.
- **Idioma:** português brasileiro.
- **Formato:** arquivos PDF; um documento tem origem indicada no nome como DOCX convertido para PDF.
- **Condição de uso:** utilização exclusivamente acadêmica.

### Limpeza, normalização e chunking

- **Limpeza e normalização:** ainda serão definidas e documentadas no pipeline de pré-processamento. A previsão é tratar espaços, quebras de linha, caracteres e caixa, preservando a identificação do documento e, quando possível, a página ou seção de origem.
- **Chunking:** ainda será definido. Como sugestão inicial, será avaliado o uso de chunks de 200 palavras com overlap de 30 palavras.

### Qualidade, riscos e limitações

- O corpus é composto por documentos públicos, institucionais e predominantemente normativos, com foco no PROCC/UFS e na pós-graduação.
- A cobertura é limitada aos sete documentos selecionados e pode não representar todas as normas, procedimentos ou versões vigentes da UFS e do PROCC.
- Documentos normativos podem ser alterados ou substituídos; por isso, a data de acesso e a fonte original serão preservadas como metadados.
- A linguagem jurídica e administrativa, remissões entre normas e possíveis diferenças de versão podem afetar a recuperação lexical.
- O corpus não contém, no recorte utilizado, dados pessoais sensíveis identificados.

### Dados removidos ou anonimizados

Nenhum dado foi removido ou anonimizado.

### Limitações para generalização

Os resultados serão válidos principalmente para recuperação de contexto em documentos normativos e orientativos públicos relacionados ao PROCC/UFS. Eles não devem ser generalizados diretamente para outros domínios, instituições, idiomas, formatos documentais ou corpora de escala diferente.

## Relatório técnico

Relatório em construção no [Google Docs](https://docs.google.com/document/d/1RLEssVnXO0mOw0kx70mevGKRufop8sq1oqN-WQzNv2I/edit). Este link será substituído pelo PDF final quando o relatório for concluído.

## 1. Identificação da equipe

- Nome da equipe: PAA_UFS_2026_2_Bispo_Diego_Marques_Gabriel_Andrade_Laryssa_Santos_Kaio_Farias_Franzone_Melo_Victor.
- Integrantes e contribuições individuais: **A PRODUZIR**.
- Commit, tag ou release avaliado: **A PRODUZIR**.

## 2. Tema e problema de recuperação

- Tema: recuperação de contexto em documentos normativos e orientativos públicos relacionados ao PROCC/UFS.
- Perguntas de recuperação e ground truth manual: **A PRODUZIR**.
- Justificativa do recorte: o corpus reúne normas e orientações de um domínio comum, permitindo comparar busca, ordenação, indexação, eficiência e qualidade da recuperação.

## 3. Definição formal do problema

- Entrada: **A PRODUZIR** — corpus `C`, consulta `q`, número `k` e parâmetros de normalização/chunking.
- Saída: **A PRODUZIR** — lista `R` com até `k` documentos ou chunks relevantes.
- Função de relevância: **A PRODUZIR**.
- Pré-condições: **A PRODUZIR**.
- Pós-condições: `R` deverá conter apenas itens de `C`, ter no máximo `k` itens, estar ordenada pela relevância e possuir critério de desempate explícito.
- Casos de borda: consulta vazia, corpus vazio, `k > N`, nenhum termo encontrado e scores iguais.
- Critério de desempate: **A PRODUZIR** — sugestão inicial: score decrescente e ID do chunk crescente.

## 4. Representação dos dados e arquitetura

Pipeline previsto: documentos → extração → normalização → chunking → representação lexical → busca → score de relevância → ordenação → Top-k → métricas e logs.

- Representação de documentos e consultas: **A PRODUZIR**.
- Estruturas de dados: **A PRODUZIR** — listas, índice invertido e demais estruturas.
- Estratégia de chunking: ainda será definida. Sugestão inicial: 200 palavras por chunk com overlap de 30 palavras.
- Ground truth manual: **A PRODUZIR**.

## 5. Algoritmos obrigatórios

### 5.1 Busca linear

Status, implementação, pseudocódigo, corretude e complexidade: **A PRODUZIR**.

### 5.2 Estratégia de ordenação

Algoritmo escolhido: **A PRODUZIR** — sugestão: Merge Sort.

Descrição, implementação, pseudocódigo, corretude e complexidade: **A PRODUZIR**.

### 5.3 Busca binária ou indexada

Estratégia escolhida: **A PRODUZIR** — sugestão: índice invertido `termo → IDs de chunks`.

Chave, estrutura compatível, implementação, pseudocódigo e complexidade: **A PRODUZIR**.

### 5.4 Divisão e conquista

Estratégia: **A PRODUZIR** — sugestão: Merge Sort.

Recorrência: **A PRODUZIR** — sugestão: `T(N) = 2T(N/2) + Θ(N)`.

### 5.5 Baseline

Biblioteca ou ferramenta de referência e separação entre código próprio e baseline: **A PRODUZIR**.

## 6. Justificativa de corretude

- Algoritmo analisado: **A PRODUZIR**.
- Tese a provar: **A PRODUZIR**.
- Hipóteses: **A PRODUZIR**.
- Invariante, indução ou argumento de pré/pós-condições: **A PRODUZIR**.
- Inicialização, manutenção e término, quando aplicável: **A PRODUZIR**.
- Limites da prova e casos não cobertos: **A PRODUZIR**.

## 7. Análise assintótica e modelo RAM

Parâmetros previstos: `N` = número de documentos/chunks; `L` = total de tokens ou caracteres; `m` = tamanho da consulta; `k` = número de resultados; `d` = dimensão vetorial, se houver embeddings; `r` = número de repetições.

- Algoritmos analisados: **A PRODUZIR**.
- Operações elementares: comparações, acessos a listas, atribuições, incrementos, chamadas recursivas e atualizações de estruturas.
- Melhor caso: **A PRODUZIR**.
- Pior caso: **A PRODUZIR**.
- Caso médio e hipóteses: **A PRODUZIR**.
- Complexidade temporal: **A PRODUZIR**.
- Complexidade espacial: **A PRODUZIR**.
- Fatores fora do modelo RAM: E/S, cache, bibliotecas, paralelismo e custo de embeddings, quando aplicável.

## 8. Metodologia experimental

Configurações previstas:

1. **C1 — Baseline:** busca linear em todos os chunks.
2. **C2 — Indexada:** índice invertido, candidatos e busca compatível.
3. **C3 — Divisão e conquista/otimização:** Merge Sort ou estratégia equivalente.
4. **C4 — Opcional:** embeddings/busca semântica como comparação complementar.

- Tamanhos de corpus ou carga de consulta: **A PRODUZIR** — pelo menos dois.
- Repetições: **A PRODUZIR** — pelo menos duas por cenário.
- Total: **A PRODUZIR** — mínimo de 12 execuções mensuráveis.
- Linguagem, bibliotecas, versões, sistema operacional e hardware: **A PRODUZIR**.
- Comandos e parâmetros de reprodução: **A PRODUZIR**.

### 8.1 Métricas

- Tempo de ingestão/pré-processamento: **A PRODUZIR**.
- Tempo de ordenação ou construção do índice: **A PRODUZIR**.
- Tempo de consulta e tempo total: **A PRODUZIR**.
- Uso aproximado de memória: **A PRODUZIR**.
- Número de comparações: **A PRODUZIR**.
- Número de documentos, chunks e valor de `k`: **A PRODUZIR**.
- Precision@k, resultados vazios, itens irrelevantes e taxa de falhas: **A PRODUZIR**.
- Tabelas, dados brutos e pelo menos um gráfico: **A PRODUZIR**.

## 9. Resultados, escalabilidade e discussão

**A PRODUZIR** — inserir tabelas, gráfico principal, interpretação dos resultados, comparação entre configurações, escalabilidade e ponto em que o custo de indexação passa a compensar.

## 10. Relação com IA generativa e RAG

- Incorporação dos documentos/chunks ao prompt: **A PRODUZIR**.
- Impacto de `k`, tamanho de chunk e ordenação no custo de contexto: **A PRODUZIR**.
- Diferença entre similaridade lexical e relevância semântica: **A PRODUZIR**.
- Riscos de recuperação incompleta, enviesada, desatualizada ou irrelevante: **A PRODUZIR**.
- Risco de afirmações não sustentadas pelo contexto: **A PRODUZIR**.
- Fontes, citações e rastreabilidade: **A PRODUZIR**.
- Trade-offs entre precisão, tempo de resposta, memória e custo de geração: **A PRODUZIR**.

## 11. Declaração de uso de IA generativa

- Ferramenta e modelo utilizados: **A PRODUZIR**.
- Finalidade de cada uso: **A PRODUZIR**.
- Até cinco prompts relevantes: **A PRODUZIR**.
- Sugestões aproveitadas, corrigidas ou rejeitadas: **A PRODUZIR**.
- Erros identificados e verificações realizadas: **A PRODUZIR**.
- Testes, provas, documentação e observações usadas na validação: **A PRODUZIR**.
- Contribuição individual dos integrantes: **A PRODUZIR**.

## 12. Limitações e ameaças à validade

**A PRODUZIR** — discutir seleção e atualização do corpus, qualidade da extração, normalização, chunking, ground truth, tamanho das cargas, hardware, número de repetições, métricas, validade interna e validade externa.

## 13. Reprodutibilidade e entregáveis

- Código-fonte e instruções de execução: **A PRODUZIR**.
- README.md: este arquivo será atualizado durante o projeto.
- Corpus ou script de obtenção: diretório `Corpus/`.
- Scripts de pré-processamento, ordenação, busca e medição: **A PRODUZIR**.
- Dados brutos, tabelas e gráficos: **A PRODUZIR**.
- Casos de teste e resultados esperados: **A PRODUZIR**.
- Prova/justificativa de corretude: seção 6 e relatório técnico.
- Declaração de uso de IA: seção 11 e relatório técnico.
- Tabela de contribuição individual: seção 1 e relatório técnico.
- Relatório técnico em PDF: **A PRODUZIR** — substituirá o link provisório do Google Docs.
- Apresentação em PDF ou slides: **A PRODUZIR**.

## 14. Vídeo da atividade

- URL pública: **A PRODUZIR**.
- Data de gravação: **A PRODUZIR**.
- Participantes: **A PRODUZIR**.
- Duração máxima: 10 minutos.

O vídeo deverá apresentar equipe, tema, corpus, problema, algoritmos, demonstração do protótipo, corretude, complexidade, resultados, relação com RAG, limitações, trade-offs e participação de todos.

## 15. Apresentação

- Data: 24/09/2026.
- Duração: 10 a 12 minutos, mais 3 a 5 minutos para perguntas.
- Conteúdo: **A PRODUZIR** — corpus, problema, entradas, saídas, relevância, algoritmos, corretude, complexidade, experimentos, resultados, gráfico, RAG, limitações e uso crítico de IA.

## 16. Cronograma

| Marco | Prazo | Status |
|---|---|---|
| Lançamento da atividade e formação das equipes | 01/09/2026 | Em andamento |
| Reserva do tema/corpus | Até 05/09/2026, às 23h59 | **A PRODUZIR/CONFIRMAR** |
| Definição do problema, coleta e implementação inicial | 03 a 10/09/2026 | **A PRODUZIR** |
| Checkpoint em sala | 10/09/2026 | **A PRODUZIR** |
| Entregáveis no GitHub e Google Classroom | Até 23/09/2026, às 23h59 | **A PRODUZIR** |
| Apresentação e fechamento da AV1 | 24/09/2026 | **A PRODUZIR** |

## 17. Referências

- CORMEN, Thomas H. et al. *Introduction to Algorithms*. 4. ed. MIT Press, 2022.
- KLEINBERG, Jon; TARDOS, Éva. *Algorithm Design*. Pearson, 2006.
- SKIENA, Steven S. *The Algorithm Design Manual*. 3. ed. Springer, 2020.
- SEDGEWICK, Robert; WAYNE, Kevin. *Algorithms*. 4. ed. Addison-Wesley, 2011.
- LEWIS, Patrick et al. *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*. NeurIPS, 2020.
- [FAISS — documentação oficial](https://faiss.ai/).
- [Sentence Transformers — repositório oficial](https://github.com/huggingface/sentence-transformers).
- Referências adicionais: **A PRODUZIR**.

## Apêndice A — Checklist final

- [ ] Equipe formada com 5 a 7 integrantes.
- [ ] Tema/corpus reservado no Google Classroom.
- [x] Fonte, data de acesso e características básicas do corpus registradas.
- [ ] Licença/condições de uso verificadas e registradas conforme orientação da equipe.
- [ ] Problema formalizado com entrada, saída, pré e pós-condições.
- [ ] Busca linear implementada.
- [ ] Ordenação clássica implementada.
- [ ] Busca binária ou indexada implementada quando aplicável.
- [ ] Divisão e conquista implementada.
- [ ] Justificativa de corretude incluída.
- [ ] Melhor, pior e caso médio analisados.
- [ ] Recorrência formulada e resolvida quando aplicável.
- [ ] Pelo menos 12 execuções mensuráveis realizadas.
- [ ] Tabelas, gráfico, scripts e dados experimentais incluídos.
- [ ] Relação explícita com recuperação de contexto e IA generativa.
- [x] Repositório público no GitHub criado.
- [ ] Repositório reproduzível.
- [ ] Declaração de uso de IA incluída.
- [ ] Tabela de contribuição individual incluída.
- [ ] Vídeo de até 10 minutos produzido.
- [ ] URL do vídeo registrada no README, relatório, VIDEO.md/video.txt e Google Classroom quando solicitado.
- [ ] Apresentação preparada para 24/09/2026.

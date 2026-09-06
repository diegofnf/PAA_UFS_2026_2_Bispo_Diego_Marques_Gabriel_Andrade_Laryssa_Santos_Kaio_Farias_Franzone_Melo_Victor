"""Testes de unidade e casos de borda da Etapa 4."""

import json
import sys
import unittest
from pathlib import Path

# Adiciona o diretório dos scripts ao path
diretorio_scripts = Path(__file__).resolve().parent
sys.path.insert(0, str(diretorio_scripts))

from importlib.machinery import SourceFileLoader
buscar_modulo = SourceFileLoader("buscar_e_ordenar", str(diretorio_scripts / "4_buscar_e_ordenar.py")).load_module()


class TestEtapa4(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        raiz = diretorio_scripts.parent
        caminho_chunks = raiz / "4_chunks" / "chunks.json"
        caminho_indice = raiz / "5_indexacao" / "indice_invertido.json"
        
        assert caminho_chunks.exists(), f"Arquivo não encontrado: {caminho_chunks}"
        assert caminho_indice.exists(), f"Arquivo não encontrado: {caminho_indice}"
        
        cls.chunks = json.loads(caminho_chunks.read_text(encoding="utf-8"))["chunks"]
        cls.chunks_map = {c["id_chunk"]: c for c in cls.chunks}
        cls.indice = json.loads(caminho_indice.read_text(encoding="utf-8"))["indice_invertido"]

    def test_tokenizacao_e_deduplicacao_consulta(self):
        """Testa normalização NFC, casefold e descarte de termos repetidos."""
        consulta = "BOLSA bolsa Bolsa critério CRITÉRIO"
        tokens, sw_rem, filtrados, distintos = buscar_modulo.processar_consulta(consulta)
        self.assertEqual(len(tokens), 5)
        self.assertEqual(distintos, ["bolsa", "critério"])

    def test_remocao_stopwords_nltk(self):
        """Verifica se stopwords comuns como 'de', 'para' são removidas via NLTK e registradas."""
        consulta = "critérios para atribuição de bolsas"
        tokens, sw_rem, filtrados, distintos = buscar_modulo.processar_consulta(consulta)
        self.assertIn("de", sw_rem)
        self.assertIn("para", sw_rem)
        self.assertEqual(filtrados, ["critérios", "atribuição", "bolsas"])
        self.assertEqual(distintos, ["critérios", "atribuição", "bolsas"])

    def test_score_lexical_formula(self):
        """Verifica a fórmula: score = soma das frequências dos termos distintos no chunk."""
        tokens_chunk = ["mestrado", "bolsa", "pesquisa", "bolsa", "bolsa", "edital"]
        termos_consulta = ["bolsa", "mestrado"]
        score, freq, comps = buscar_modulo.calcular_score_chunk(tokens_chunk, termos_consulta)
        
        self.assertEqual(score, 4)  # 3 de bolsa + 1 de mestrado
        self.assertEqual(freq, {"bolsa": 3, "mestrado": 1})
        self.assertEqual(comps, 2)

    def test_caso_borda_consulta_vazia(self):
        """Consulta vazia ou com apenas espaços/pontuação deve retornar lista vazia sem erro."""
        candidatos, metricas = buscar_modulo.buscar_linear(self.chunks, "   !!! ???   ")
        self.assertEqual(len(candidatos), 0)
        self.assertEqual(metricas["total_candidatos"], 0)
        self.assertIn("aviso", metricas)

    def test_caso_borda_apenas_stopwords(self):
        """Consulta composta exclusivamente por stopwords deve retornar lista vazia sem erro."""
        candidatos, metricas = buscar_modulo.buscar_linear(self.chunks, "de para em com por")
        self.assertEqual(len(candidatos), 0)
        self.assertEqual(metricas["total_candidatos"], 0)
        self.assertIn("aviso", metricas)

    def test_caso_borda_termos_inexistentes(self):
        """Consulta com palavras que não existem no corpus deve resultar em 0 candidatos."""
        candidatos, metricas = buscar_modulo.buscar_linear(self.chunks, "palavratotalmenteinexistentexyz123")
        self.assertEqual(len(candidatos), 0)
        self.assertEqual(metricas["total_candidatos"], 0)

    def test_caso_borda_consulta_termos_repetidos(self):
        """Consulta com termos repetidos deve ter exatamente o mesmo score que termos únicos."""
        cand_rep, _ = buscar_modulo.buscar_linear(self.chunks, "recursos financeiros recursos recursos")
        cand_unicos, _ = buscar_modulo.buscar_linear(self.chunks, "recursos financeiros")
        
        scores_rep = {c["id_chunk"]: c["score"] for c in cand_rep}
        scores_unicos = {c["id_chunk"]: c["score"] for c in cand_unicos}
        self.assertEqual(scores_rep, scores_unicos)

    def test_equivalencia_busca_linear_e_indexada(self):
        """Garante que a busca linear e a busca indexada retornam exatamente os mesmos candidatos e scores."""
        consulta = "normas acadêmicas da pós graduação"
        candidatos_linear, _ = buscar_modulo.buscar_linear(self.chunks, consulta)
        candidatos_index, _ = buscar_modulo.buscar_indexada(self.indice, self.chunks_map, consulta)
        
        mapa_linear = {c["id_chunk"]: c["score"] for c in candidatos_linear}
        mapa_index = {c["id_chunk"]: c["score"] for c in candidatos_index}
        
        self.assertEqual(len(mapa_linear), len(mapa_index))
        self.assertEqual(mapa_linear, mapa_index)

    def test_metadados_e_formato_candidato(self):
        """Verifica se os campos obrigatórios estão presentes no candidato."""
        candidatos, _ = buscar_modulo.buscar_linear(self.chunks, "recursos")
        self.assertGreater(len(candidatos), 0)
        primeiro = candidatos[0]
        
        campos_obrigatorios = ["id_chunk", "id_documento", "paginas", "score", "frequencias_termos", "texto"]
        for campo in campos_obrigatorios:
            self.assertIn(campo, primeiro)
        self.assertIsInstance(primeiro["paginas"], list)
        self.assertIsInstance(primeiro["score"], int)


if __name__ == "__main__":
    unittest.main()


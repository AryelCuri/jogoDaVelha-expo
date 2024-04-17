import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, Button } from "react-native";

export default function App() {
  // Estado para armazenar o estado atual do tabuleiro
  const [tabuleiro, setTabuleiro] = useState(Array(9).fill(null));
  // Estado para controlar de quem é a vez: X ou O
  const [vezDoX, setVezDoX] = useState(true);
  // Estado para armazenar o vencedor do jogo
  const [vencedor, setVencedor] = useState<string | null>(null);
  // Estado para controlar a visibilidade do botão de reset
  const [mostrarBotaoReset, setMostrarBotaoReset] = useState(false);

  // Função para lidar com o clique em um quadrado do tabuleiro
  const handleClique = (index: number) => {
    const novoTabuleiro = [...tabuleiro];
    // Verificar se já há um vencedor ou se o quadrado já foi preenchido
    if (vencedor || novoTabuleiro[index]) return;
    // Atualizar o estado do tabuleiro com a nova jogada
    novoTabuleiro[index] = vezDoX ? "X" : "O";
    setTabuleiro(novoTabuleiro);
    // Alternar a vez do jogador
    setVezDoX(!vezDoX);
  };

  // Função para renderizar um quadrado do tabuleiro
  const renderizarQuadrado = (index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.gridColumn}
        onPress={() => handleClique(index)}
      >
        <Text style={styles.quadrado}>{tabuleiro[index]}</Text>{" "}
      </TouchableOpacity>
    );
  };

  // Efeito para verificar o vencedor do jogo e reiniciar a página após 4 segundos quando houver um vencedor
  useEffect(() => {
    const ganhador = calcularVencedor(tabuleiro);
    if (ganhador) {
      setVencedor(ganhador);
      setMostrarBotaoReset(true); // Mostrar o botão de reset quando o jogo termina
    } else if (tabuleiro.every((quadrado) => quadrado)) {
      setVencedor("Empate");
      setMostrarBotaoReset(true); // Mostrar o botão de reset quando o jogo termina
    }
  }, [tabuleiro]); // Executar sempre que o estado do tabuleiro mudar

  // Função para reiniciar o jogo
  const reiniciarJogo = () => {
    setTabuleiro(Array(9).fill(null));
    setVencedor(null);
    setVezDoX(true);
    setMostrarBotaoReset(false); // Esconder o botão de reset ao reiniciar o jogo
  };

  // Determinar o status do jogo: próximo jogador ou vencedor
  let status;
  if (vencedor) {
    status = vencedor === "Empate" ? "Empate!" : "Vencedor: " + vencedor;
  } else {
    status = "Próximo jogador: " + (vezDoX ? "X" : "O");
  }

  // Renderizar o componente
  return (
    <View style={styles.container}>
      {/* Exibir o status do jogo */}
      <Text style={styles.status}>{status}</Text>
      {/* Renderizar o tabuleiro */}
      <View style={styles.tabuleiro}>
        {tabuleiro.map((_, index) => renderizarQuadrado(index))}
      </View>
      {/* Exibir o botão de reset condicionalmente */}
      {mostrarBotaoReset && <Button title="Reiniciar Jogo" onPress={reiniciarJogo} />}
      <StatusBar style="auto" />
    </View>
  );
}

// Estilos CSS para o componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    marginBottom: 10,
    fontSize: 20,
  },
  tabuleiro: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    marginTop: 20,
  },
  gridColumn: {
    width: "33.333%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  quadrado: {
    fontSize: 40,
  },
});

  // Função para calcular o vencedor do jogo
  function calcularVencedor(quadrados: Array<string | null>): string | null {
    const linhas = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < linhas.length; i++) {
      const [a, b, c] = linhas[i];
      if (
        quadrados[a] &&
        quadrados[a] === quadrados[b] &&
        quadrados[a] === quadrados[c]
      ) {
        return quadrados[a];
      }
    }
    return null;
  }

import { useState, useEffect } from "react";

const MEDAL_POINTS = { 金: 4, 銀: 3, 銅: 2, 鉄: 1, ダ: 5 };

export function useOlympicScore() {
  const [screen, setScreen] = useState(
    () => localStorage.getItem("golf_screen") || "setup",
  );
  const [players, setPlayers] = useState(
    () =>
      JSON.parse(localStorage.getItem("golf_players")) || [
        "Player 1",
        "Player 2",
        "Player 3",
      ],
  );
  const [currentHole, setCurrentHole] = useState(
    () => Number(localStorage.getItem("golf_currentHole")) || 1,
  );
  const [scores, setScores] = useState(
    () => JSON.parse(localStorage.getItem("golf_scores")) || {},
  );
  const [rate, setRate] = useState(
    () => Number(localStorage.getItem("golf_rate")) || 100,
  );

  useEffect(() => {
    localStorage.setItem("golf_screen", screen);
    localStorage.setItem("golf_players", JSON.stringify(players));
    localStorage.setItem("golf_currentHole", currentHole.toString());
    localStorage.setItem("golf_scores", JSON.stringify(scores));
    localStorage.setItem("golf_rate", rate.toString());
  }, [screen, players, currentHole, scores, rate]);

  const calculateTotalScores = () => {
    return players
      .map((name) => {
        let total = 0;
        Object.values(scores).forEach((holeScores) => {
          const medal = holeScores[name];
          if (medal) total += MEDAL_POINTS[medal] || 0;
        });
        return { name, total };
      })
      .sort((a, b) => b.total - a.total);
  };

  // --- 元のロジックを完全再現 ---
  const selectMedal = (playerName, medalType) => {
    const holeScores = { ...(scores[currentHole] || {}) };
    if (holeScores[playerName] === medalType) {
      delete holeScores[playerName];
    } else {
      holeScores[playerName] = medalType;
    }
    setScores({ ...scores, [currentHole]: holeScores });
  };

  return {
    screen,
    setScreen,
    players,
    setPlayers,
    currentHole,
    setCurrentHole,
    scores,
    setScores,
    rate,
    setRate,
    calculateTotalScores,
    selectMedal,
  };
}

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
    const data = {
      golf_screen: screen,
      golf_players: JSON.stringify(players),
      golf_currentHole: currentHole,
      golf_scores: JSON.stringify(scores),
      golf_rate: rate,
    };
    Object.entries(data).forEach(([k, v]) =>
      localStorage.setItem(k, v.toString()),
    );
  }, [screen, players, currentHole, scores, rate]);

  const calculateTotalScores = () => {
    return players
      .map((name) => {
        let total = 0;
        Object.values(scores).forEach((hole) => {
          if (hole[name]) total += MEDAL_POINTS[hole[name]] || 0;
        });
        return { name, total };
      })
      .sort((a, b) => b.total - a.total);
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
  };
}

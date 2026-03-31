import { useState, useEffect } from "react";

const MEDAL_POINTS = { 金: 4, 銀: 3, 銅: 2, 鉄: 1, ダ: 5 };

export function useOlympicScore() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("golf_history");
    return saved ? JSON.parse(saved) : [];
  });

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
  const [courseName, setCourseName] = useState(
    () => localStorage.getItem("golf_courseName") || "",
  ); // コース名追加
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
    localStorage.setItem("golf_courseName", courseName);
    localStorage.setItem("golf_currentHole", currentHole.toString());
    localStorage.setItem("golf_scores", JSON.stringify(scores));
    localStorage.setItem("golf_rate", rate.toString());
    localStorage.setItem("golf_history", JSON.stringify(history));
  }, [screen, players, courseName, currentHole, scores, rate, history]);

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

  const selectMedal = (playerName, medalType) => {
    const holeScores = { ...(scores[currentHole] || {}) };
    if (holeScores[playerName] === medalType) {
      delete holeScores[playerName];
    } else {
      holeScores[playerName] = medalType;
    }
    setScores({ ...scores, [currentHole]: holeScores });
  };

  const saveToHistory = () => {
    const finalResults = calculateTotalScores();
    const sumAllScores = finalResults.reduce((sum, p) => sum + p.total, 0);
    const playerCount = players.length;

    const newEntry = {
      id: Date.now(),
      // 日付とコース名だけに絞り込み
      date: new Date().toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      }),
      course: courseName || "未設定コース",
      players: finalResults.map((p) => ({
        name: p.name,
        netCash: (p.total * playerCount - sumAllScores) * rate,
      })),
    };
    setHistory((prev) => [newEntry, ...prev]);
  };

  const deleteHistory = (id) => {
    if (window.confirm("この履歴を削除しますか？")) {
      setHistory((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const resetGame = () => {
    setScores({});
    setCurrentHole(1);
    setCourseName("");
    setScreen("setup");
    localStorage.removeItem("golf_scores");
    localStorage.removeItem("golf_currentHole");
    localStorage.removeItem("golf_courseName");
  };

  return {
    screen,
    setScreen,
    players,
    setPlayers,
    courseName,
    setCourseName,
    currentHole,
    setCurrentHole,
    scores,
    setScores,
    rate,
    setRate,
    calculateTotalScores,
    selectMedal,
    history,
    saveToHistory,
    deleteHistory,
    resetGame,
  };
}

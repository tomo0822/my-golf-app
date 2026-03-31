import { useOlympicScore } from "./hooks/useOlympicScore";
import SetupScreen from "./components/SetupScreen";
import GameScreen from "./components/GameScreen";
import ResultScreen from "./components/ResultScreen";

function App() {
  const {
    screen,
    setScreen,
    players,
    setPlayers,
    courseName,
    setCourseName,
    currentHole,
    setCurrentHole,
    scores,
    rate,
    setRate,
    calculateTotalScores,
    selectMedal,
    history,
    saveToHistory,
    deleteHistory,
    resetGame,
  } = useOlympicScore();

  if (screen === "setup") {
    return (
      <SetupScreen
        players={players}
        setPlayers={setPlayers}
        courseName={courseName}
        setCourseName={setCourseName}
        rate={rate}
        setRate={setRate}
        history={history}
        onDeleteHistory={deleteHistory}
        onStart={() => {
          if (players.filter((p) => p.trim()).length < 2)
            return alert("2人以上入力してください");
          setScreen("game");
        }}
      />
    );
  }

  if (screen === "result") {
    return (
      <ResultScreen
        players={players}
        scores={scores}
        rate={rate}
        courseName={courseName}
        calculateTotalScores={calculateTotalScores}
        onNewGame={resetGame}
      />
    );
  }

  return (
    <GameScreen
      currentHole={currentHole}
      setCurrentHole={setCurrentHole}
      players={players}
      scores={scores}
      courseName={courseName}
      selectMedal={selectMedal}
      calculateTotalScores={calculateTotalScores}
      onBack={() => confirm("設定に戻りますか？") && setScreen("setup")}
      onFinish={() => {
        saveToHistory();
        setScreen("result");
      }}
    />
  );
}

export default App;

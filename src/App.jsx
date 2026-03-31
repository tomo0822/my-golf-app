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
    currentHole,
    setCurrentHole,
    scores,
    rate,
    setRate,
    calculateTotalScores,
    selectMedal,
  } = useOlympicScore();

  if (screen === "setup") {
    return (
      <SetupScreen
        players={players}
        setPlayers={setPlayers}
        rate={rate}
        setRate={setRate}
        onStart={() => setScreen("game")}
      />
    );
  }

  if (screen === "result") {
    return (
      <ResultScreen
        players={players}
        scores={scores}
        rate={rate}
        calculateTotalScores={calculateTotalScores}
      />
    );
  }

  return (
    <GameScreen
      currentHole={currentHole}
      setCurrentHole={setCurrentHole}
      players={players}
      scores={scores}
      selectMedal={selectMedal}
      calculateTotalScores={calculateTotalScores}
      onBack={() => confirm("戻りますか？") && setScreen("setup")}
      onFinish={() => setScreen("result")}
    />
  );
}

export default App;

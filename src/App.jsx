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

  // 画面切り替えのロジック
  if (screen === "setup") {
    return (
      <SetupScreen
        players={players}
        setPlayers={setPlayers}
        rate={rate}
        setRate={setRate}
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
        calculateTotalScores={calculateTotalScores}
      />
    );
  }

  // デフォルトは GameScreen
  return (
    <GameScreen
      currentHole={currentHole}
      setCurrentHole={setCurrentHole}
      players={players}
      scores={scores}
      selectMedal={selectMedal}
      calculateTotalScores={calculateTotalScores}
      onBack={() => {
        if (
          window.confirm(
            "設定画面に戻ります。よろしいですか？\n(入力したスコアは保持されます)",
          )
        ) {
          setScreen("setup");
        }
      }}
      onFinish={() => setScreen("result")}
    />
  );
}

export default App;

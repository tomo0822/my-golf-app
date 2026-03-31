import { useState, useEffect } from "react";

function App() {
  // --- 1. ローカルストレージからの初期化 ---
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

  // --- 2. 状態が変わるたびに自動保存 ---
  useEffect(() => {
    localStorage.setItem("golf_screen", screen);
    localStorage.setItem("golf_players", JSON.stringify(players));
    localStorage.setItem("golf_currentHole", currentHole.toString());
    localStorage.setItem("golf_scores", JSON.stringify(scores));
    localStorage.setItem("golf_rate", rate.toString());
  }, [screen, players, currentHole, scores, rate]);

  // --- メダルごとの配点 ---
  const MEDAL_POINTS = { 金: 4, 銀: 3, 銅: 2, 鉄: 1, ダ: 5 };

  // --- 合計点数と順位の計算 ---
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

  const addPlayer = () => {
    if (players.length < 4) setPlayers([...players, ""]);
  };
  const removePlayer = (index) => {
    if (players.length > 2) setPlayers(players.filter((_, i) => i !== index));
  };

  const startGame = () => {
    const activePlayers = players.filter((p) => p.trim() !== "");
    if (activePlayers.length < 2)
      return alert("2人以上の名前を入力してください");
    setPlayers(activePlayers);
    setScreen("game");
  };

  const handleReset = () => {
    if (
      window.confirm(
        "設定画面に戻ります。よろしいですか？\n(入力したスコアは保持されます)",
      )
    ) {
      setScreen("setup");
    }
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

  const isMedalTaken = (medalType, playerName) => {
    const holeScores = scores[currentHole] || {};
    return Object.entries(holeScores).some(
      ([name, type]) => type === medalType && name !== playerName,
    );
  };

  // --- 画面A: 設定画面 ---
  if (screen === "setup") {
    return (
      <div className="p-6 min-h-screen bg-slate-950 text-white flex flex-col items-center">
        <h1 className="text-4xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-700">
          OLYMPIC
        </h1>
        <div className="max-w-md bg-slate-900 border border-slate-800 p-6 mt-4 rounded-[2rem] shadow-2xl flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-[10px] font-black text-slate-500 tracking-[0.2em] mb-1">
                PLAYERS
              </h2>
              <p className="text-xl font-black text-white">メンバー登録</p>
            </div>
            {players.length < 4 && (
              <button
                onClick={addPlayer}
                className="bg-blue-600 text-white text-[14px] font-black px-4 py-2 rounded-xl transition-colors"
              >
                追加
              </button>
            )}
          </div>
          <div className="space-y-3">
            {players.map((name, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-2xl font-bold focus:border-green-500 outline-none text-sm"
                  value={name}
                  placeholder={`Player ${i + 1}`}
                  onChange={(e) => {
                    const next = [...players];
                    next[i] = e.target.value;
                    setPlayers(next);
                  }}
                />
                {players.length > 2 && (
                  <button
                    onClick={() => removePlayer(i)}
                    className="bg-slate-800 text-slate-500 w-12 rounded-2xl border border-slate-700 text-xl"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-800 text-center">
            <h2 className="text-[10px] font-black text-slate-500 tracking-[0.2em] mb-2 uppercase">
              Rate Setting
            </h2>
            <div className="flex items-center justify-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-sm font-bold text-slate-400">1pt =</span>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="bg-transparent text-2xl font-black text-green-400 w-24 text-center outline-none"
              />
              <span className="text-sm font-bold text-slate-400">円</span>
            </div>
          </div>
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-b from-green-500 to-green-700 py-4 rounded-2xl font-black text-lg text-white active:scale-[0.98] transition-all"
          >
            START GAME
          </button>
        </div>
      </div>
    );
  }

  // --- 画面B: 結果発表画面 ---
  if (screen === "result") {
    const finalResults = calculateTotalScores();
    const sumAllScores = finalResults.reduce((sum, p) => sum + p.total, 0);
    const playerCount = players.length;

    const getMedalStats = (playerName) => {
      const stats = { 金: 0, 銀: 0, 銅: 0, 鉄: 0, ダ: 0 };
      Object.values(scores).forEach((holeScores) => {
        if (holeScores[playerName]) stats[holeScores[playerName]]++;
      });
      return stats;
    };

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col">
        <header className="text-center mb-6 pt-4">
          <h1 className="text-[10px] font-black text-green-500 tracking-[0.4em] mb-1">
            FINAL SETTLEMENT
          </h1>
          <div className="text-3xl font-black italic italic">最終結果発表</div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto pb-32">
          {finalResults.map((player, idx) => {
            const stats = getMedalStats(player.name);
            const netPoints = player.total * playerCount - sumAllScores;
            const netCash = netPoints * rate;
            const isPlus = netCash >= 0;

            return (
              <div
                key={player.name}
                className={`relative bg-slate-900 border-3 ${idx === 0 ? "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]" : "border-slate-800"} rounded-[2.5rem] p-6`}
              >
                {/* 順位タグ */}
                <div
                  className={`absolute top-0 right-8 px-4 py-1 rounded-b-xl font-black text-[14px] ${idx === 0 ? "bg-yellow-500 text-yellow-950" : "bg-slate-800 text-slate-400"}`}
                >
                  {idx + 1}位
                </div>

                {/* メイン情報：名前と最終収支 */}
                <div className="flex justify-between items-end mb-1">
                  <div>
                    <h3 className="text-2xl font-black mb-1">{player.name}</h3>
                    <p className="text-sm font-bold text-slate-400">
                      Total Score:{" "}
                      <span className="text-green-400 font-black">
                        {player.total} pt
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-black leading-none ${isPlus ? "text-green-400" : "text-red-400"}`}
                    >
                      {isPlus ? "+" : ""}
                      {netCash.toLocaleString()}
                      <span className="text-xs ml-0.5">円</span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tighter text-center">
                      Net Settlement
                    </p>
                  </div>
                </div>

                {/* 獲得メダル：以前のデザインを維持 */}
                <div className="flex flex-wrap gap-1.5 mb-1 py-3 border-y border-slate-800/50">
                  {Object.entries(stats).map(
                    ([type, count]) =>
                      count > 0 && (
                        <div
                          key={type}
                          className="bg-slate-950 px-2 py-1 rounded-full border border-slate-800 flex items-center gap-1.5"
                        >
                          <span
                            className={`text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full ${type === "金" ? "bg-yellow-500 text-yellow-950" : type === "銀" ? "bg-slate-300 text-slate-900" : type === "銅" ? "bg-orange-500 text-orange-950" : type === "鉄" ? "bg-blue-500 text-blue-50" : "bg-cyan-400 text-cyan-950"}`}
                          >
                            {type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300">
                            {count}
                          </span>
                        </div>
                      ),
                  )}
                </div>

                {/* 計算ロジック詳細（vs 他のプレイヤー） */}
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-600 tracking-widest uppercase mb-2">
                    Calculation Details
                  </p>
                  {finalResults.map((other) => {
                    if (other.name === player.name) return null;
                    const diff = player.total - other.total;
                    const diffCash = diff * rate;
                    return (
                      <div
                        key={other.name}
                        className="flex justify-between items-center bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/30"
                      >
                        <span className="text-[11px] font-bold text-slate-400">
                          vs {other.name}
                        </span>
                        <div className="flex gap-3 items-center">
                          <span
                            className={`text-[10px] font-black ${diff >= 0 ? "text-green-500/50" : "text-red-500/50"}`}
                          >
                            {diff >= 0 ? "+" : ""}
                            {diff} pt
                          </span>
                          <span
                            className={`text-[11px] font-black w-16 text-right ${diff >= 0 ? "text-green-400/90" : "text-red-400/90"}`}
                          >
                            {diff >= 0 ? "+" : ""}
                            {diffCash.toLocaleString()}円
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* 検算表示 */}
          <div className="pt-4 flex flex-col items-center gap-2">
            <div className="bg-slate-900/50 border border-slate-800 px-4 py-2 rounded-full">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Check Sum:{" "}
                <span className="text-green-500">
                  {finalResults.reduce(
                    (acc, p) =>
                      acc + (p.total * playerCount - sumAllScores) * rate,
                    0,
                  )}
                  円
                </span>
              </p>
            </div>
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 w-full p-6 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 pb-10">
          <button
            onClick={() => {
              if (window.confirm("全ての記録を消去して新しく始めますか？")) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 py-4 rounded-2xl font-black text-lg transition-all active:scale-[0.98]"
          >
            NEW GAME
          </button>
        </footer>
      </div>
    );
  }

  // --- 画面C: ゲーム画面 ---
  const currentTotalScores = calculateTotalScores();
  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden p-3 pb-safe">
      <header className="flex justify-between items-center sticky top-0 mb-5 px-1 pt-2">
        <div className="text-2xl font-black italic text-green-500 tracking-tighter">
          HOLE {currentHole}
        </div>
        <button
          onClick={handleReset}
          // 「inline-flex items-center justify-center」を追加
          className="inline-flex items-center justify-center text-[14px] font-black text-slate-500 border border-slate-800 px-5 py-3 rounded-full active:bg-slate-900"
        >
          RESET
        </button>{" "}
      </header>
      <div className="flex-1 flex flex-col gap-5 overflow-hidden mb-2">
        {players.map((name, i) => (
          <div
            key={i}
            className="bg-slate-900/80 border border-slate-800 p-3 rounded-[2rem] flex flex-col justify-center flex-1 max-h-[110px]"
          >
            <div className="flex justify-between items-center mb-2 px-2 border-l-2 border-green-500">
              <span className="text-sm font-black truncate max-w-[120px]">
                {name}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Score:{" "}
                <span className="text-green-400 text-xs font-black">
                  {currentTotalScores.find((s) => s.name === name).total}
                </span>
              </span>
            </div>
            <div className="flex justify-between gap-1">
              {[
                {
                  type: "金",
                  bg: "from-yellow-300 to-yellow-600",
                  text: "text-yellow-950",
                },
                {
                  type: "銀",
                  bg: "from-slate-200 to-slate-400",
                  text: "text-slate-900",
                },
                {
                  type: "銅",
                  bg: "from-orange-400 to-orange-700",
                  text: "text-orange-950",
                },
                {
                  type: "鉄",
                  bg: "from-blue-400 to-blue-600",
                  text: "text-blue-50",
                },
                {
                  type: "ダ",
                  bg: "from-cyan-100 to-cyan-400",
                  text: "text-cyan-950",
                },
              ].map((m) => {
                const isSelected = (scores[currentHole] || {})[name] === m.type;
                const isTaken = isMedalTaken(m.type, name);
                return (
                  <button
                    key={m.type}
                    disabled={isTaken}
                    onClick={() => selectMedal(name, m.type)}
                    className={`relative w-14 h-14 rounded-full font-black text-xs transition-all flex items-center justify-center bg-gradient-to-b ${m.bg} ${m.text} ${isTaken ? "opacity-5 grayscale pointer-events-none" : "active:scale-90 shadow-lg"} ${isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950 z-10 scale-110" : ""}`}
                  >
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                    {m.type}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-20 px-1">
        <p className="text-[9px] font-black text-slate-500 tracking-widest mb-2 px-1 text-center">
          TOTAL RANKING
        </p>
        <div className="flex gap-2 pb-2 scrollbar-hide">
          {currentTotalScores.map((s, idx) => (
            <div
              key={s.name}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col items-center min-w-[80px] flex-1"
            >
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full mb-1 ${idx === 0 ? "bg-yellow-500 text-yellow-950" : "bg-slate-800 text-slate-400"}`}
              >
                {idx + 1}位
              </span>
              <span className="text-xs font-bold truncate w-full text-center">
                {s.name}
              </span>
              <span className="text-lg font-black text-green-400">
                {s.total}
                <span className="text-[10px] ml-0.5 font-normal text-slate-500">
                  pt
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* --- 修正後の footer 部分 --- */}
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-slate-950/95 backdrop-blur-xl flex gap-3 border-t border-slate-800">
        <button
          disabled={currentHole === 1}
          onClick={() => setCurrentHole((h) => h - 1)}
          // 「active:scale」を削除し、サイズを h-14 で固定。flexで中央揃え。
          className="w-20 h-14 bg-slate-900 text-slate-400 rounded-2xl font-black text-xs border border-slate-800 disabled:opacity-10 flex items-center justify-center"
        >
          PREV
        </button>

        <button
          onClick={() => {
            if (currentHole === 18) {
              setScreen("result");
            } else {
              setCurrentHole((h) => h + 1);
            }
          }}
          // 「active:brightness」なども削除。h-14 で高さを固定し、flexで中央揃え。
          className="flex-1 h-14 bg-gradient-to-b from-green-500 to-green-700 rounded-2xl font-black text-base text-white flex items-center justify-center shadow-lg shadow-green-900/20"
        >
          {currentHole === 18 ? "VIEW RESULT" : "NEXT HOLE"}
        </button>
      </footer>{" "}
    </div>
  );
}

export default App;

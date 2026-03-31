export default function GameScreen({
  currentHole,
  setCurrentHole,
  players,
  scores,
  selectMedal,
  calculateTotalScores,
  onBack,
  onFinish,
}) {
  const currentTotalScores = calculateTotalScores();

  // --- 元のロジックを完全再現 ---
  const isMedalTaken = (medalType, playerName) => {
    const holeScores = scores[currentHole] || {};
    return Object.entries(holeScores).some(
      ([name, type]) => type === medalType && name !== playerName,
    );
  };

  const medalConfigs = [
    {
      type: "金",
      bg: "from-yellow-300 to-yellow-600",
      text: "text-yellow-950",
    },
    { type: "銀", bg: "from-slate-200 to-slate-400", text: "text-slate-900" },
    {
      type: "銅",
      bg: "from-orange-400 to-orange-700",
      text: "text-orange-950",
    },
    { type: "鉄", bg: "from-blue-400 to-blue-600", text: "text-blue-50" },
    { type: "ダ", bg: "from-cyan-100 to-cyan-400", text: "text-cyan-950" },
  ];

  return (
    <div className="flex flex-col bg-slate-950 text-white overflow-hidden p-3 pb-safe min-h-screen">
      <header className="flex justify-between items-center sticky top-0 mb-5 px-1 pt-2">
        <div className="text-2xl font-black italic text-green-500 tracking-tighter">
          HOLE {currentHole}
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center text-[14px] font-black text-slate-500 border border-slate-800 px-5 py-3 rounded-full active:bg-slate-900"
        >
          RESET
        </button>
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
              {medalConfigs.map((m) => {
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
        <div className="flex gap-2 pb-2">
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

      <footer className="fixed bottom-0 left-0 w-full p-4 bg-slate-950/95 backdrop-blur-xl flex gap-3 border-t border-slate-800">
        <button
          disabled={currentHole === 1}
          onClick={() => setCurrentHole((h) => h - 1)}
          className="w-20 h-14 bg-slate-900 text-slate-400 rounded-2xl font-black text-xs border border-slate-800 disabled:opacity-10 flex items-center justify-center"
        >
          PREV
        </button>
        <button
          onClick={() =>
            currentHole === 18 ? onFinish() : setCurrentHole((h) => h + 1)
          }
          className="flex-1 h-14 bg-gradient-to-b from-green-500 to-green-700 rounded-2xl font-black text-base text-white flex items-center justify-center shadow-lg shadow-green-900/20"
        >
          {currentHole === 18 ? "VIEW RESULT" : "NEXT HOLE"}
        </button>
      </footer>
    </div>
  );
}

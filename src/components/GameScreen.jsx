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
    <div className="flex flex-col bg-slate-950 text-white p-3 min-h-screen">
      <header className="flex justify-between items-center py-4">
        <div className="text-2xl font-black text-green-500 italic">
          HOLE {currentHole}
        </div>
        <button
          onClick={onBack}
          className="text-xs font-black text-slate-500 border border-slate-800 px-4 py-2 rounded-full"
        >
          RESET
        </button>
      </header>

      <div className="flex-1 space-y-4 mb-24">
        {players.map((name) => (
          <div
            key={name}
            className="bg-slate-900 border border-slate-800 p-4 rounded-[2rem]"
          >
            <div className="flex justify-between items-center mb-3 px-2 border-l-2 border-green-500">
              <span className="font-black">{name}</span>
              <span className="text-xs text-slate-400">
                Total:{" "}
                <span className="text-green-400 font-black">
                  {currentTotalScores.find((s) => s.name === name).total}
                </span>
              </span>
            </div>
            <div className="flex justify-between">
              {medalConfigs.map((m) => {
                const isSelected = (scores[currentHole] || {})[name] === m.type;
                const isTaken = isMedalTaken(m.type, name);
                return (
                  <button
                    key={m.type}
                    disabled={isTaken}
                    onClick={() => selectMedal(name, m.type)}
                    className={`w-14 h-14 rounded-full font-black text-xs flex items-center justify-center bg-gradient-to-b ${m.bg} ${m.text} transition-all ${isTaken ? "opacity-10 grayscale" : "active:scale-90"} ${isSelected ? "ring-2 ring-white scale-110" : ""}`}
                  >
                    {m.type}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-4 bg-slate-950/90 backdrop-blur-xl flex gap-3 border-t border-slate-800">
        <button
          disabled={currentHole === 1}
          onClick={() => setCurrentHole((h) => h - 1)}
          className="w-20 h-14 bg-slate-900 text-slate-400 rounded-2xl font-black text-xs disabled:opacity-20"
        >
          PREV
        </button>
        <button
          onClick={() =>
            currentHole === 18 ? onFinish() : setCurrentHole((h) => h + 1)
          }
          className="flex-1 h-14 bg-gradient-to-b from-green-500 to-green-700 rounded-2xl font-black"
        >
          {currentHole === 18 ? "VIEW RESULT" : "NEXT HOLE"}
        </button>
      </footer>
    </div>
  );
}

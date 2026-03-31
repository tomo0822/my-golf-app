export default function GameScreen({
  currentHole,
  setCurrentHole,
  players,
  scores,
  courseName,
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
      <header className="flex justify-between items-end py-4 px-1">
        <div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {courseName || "OLYMPIC"}
          </div>
          <div className="text-3xl font-black italic text-green-500 tracking-tighter leading-none">
            HOLE {currentHole}
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-[12px] font-black text-slate-600 border border-slate-900 px-4 py-2 rounded-full"
        >
          RESET
        </button>
      </header>

      {/* ホール番号が変わるたびに key をリセットしてアニメーションを再トリガー */}
      <div
        key={currentHole}
        className="flex-1 space-y-4 mb-4 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300"
      >
        {players.map((name) => (
          <div
            key={name}
            className="bg-slate-900 border border-slate-800 p-4 rounded-[2rem] shadow-xl"
          >
            <div className="flex justify-between items-center mb-3 px-2 border-l-2 border-green-500">
              <span className="font-black truncate max-w-[150px] text-sm">
                {name}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Score:{" "}
                <span className="text-green-400 font-black ml-1 text-sm">
                  {currentTotalScores.find((s) => s.name === name)?.total || 0}
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

      <div className="mb-24 px-1">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {currentTotalScores.map((s, idx) => (
            <div
              key={s.name}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 flex flex-col items-center min-w-[85px] flex-1"
            >
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full mb-1 ${idx === 0 ? "bg-yellow-500 text-yellow-950" : "bg-slate-800 text-slate-500"}`}
              >
                {idx + 1}位
              </span>
              <span className="text-lg font-black text-green-400 leading-none">
                {s.total}
                <span className="text-[9px] ml-0.5 font-normal text-slate-600 uppercase">
                  pt
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-4 bg-slate-950/95 backdrop-blur-xl flex gap-3 border-t border-slate-800 pb-8 z-20">
        <button
          disabled={currentHole === 1}
          onClick={() => setCurrentHole((h) => h - 1)}
          className="w-20 h-14 bg-slate-900 text-slate-400 rounded-2xl font-black text-xs border border-slate-800"
        >
          PREV
        </button>
        <button
          onClick={() =>
            currentHole === 18 ? onFinish() : setCurrentHole((h) => h + 1)
          }
          className="flex-1 h-14 bg-gradient-to-b from-green-500 to-green-700 rounded-2xl font-black text-white shadow-lg"
        >
          {currentHole === 18 ? "VIEW RESULT" : "NEXT HOLE"}
        </button>
      </footer>
    </div>
  );
}

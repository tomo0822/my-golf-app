export default function ResultScreen({
  players,
  scores,
  rate,
  calculateTotalScores,
  onNewGame,
}) {
  const results = calculateTotalScores();
  const sumAllScores = results.reduce((sum, p) => sum + p.total, 0);
  const playerCount = players.length;

  const getMedalStats = (playerName) => {
    const stats = { 金: 0, 銀: 0, 銅: 0, 鉄: 0, ダ: 0 };
    Object.values(scores).forEach((holeScores) => {
      const medal = holeScores[playerName];
      if (medal && stats[medal] !== undefined) stats[medal]++;
    });
    return stats;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 pb-32">
      <header className="text-center my-6">
        <h1 className="text-[10px] font-black text-green-500 tracking-[0.4em] mb-1 uppercase">
          Final Settlement
        </h1>
        <div className="text-3xl font-black italic">最終結果発表</div>
      </header>

      <div className="space-y-4">
        {results.map((player, idx) => {
          const stats = getMedalStats(player.name);
          const netPoints = player.total * playerCount - sumAllScores;
          const netCash = netPoints * rate;
          const isPlus = netCash >= 0;

          return (
            <div
              key={player.name}
              className={`relative bg-slate-900 border-2 ${idx === 0 ? "border-yellow-500 shadow-lg" : "border-slate-800"} rounded-[2.5rem] p-6`}
            >
              <div
                className={`absolute top-0 right-8 px-4 py-1 rounded-b-xl font-black text-[14px] ${idx === 0 ? "bg-yellow-500 text-yellow-950" : "bg-slate-800 text-slate-400"}`}
              >
                {idx + 1}位
              </div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-2xl font-black mb-1">{player.name}</h3>
                  <p className="text-sm font-bold text-slate-400">
                    Score:{" "}
                    <span className="text-green-400 font-black">
                      {player.total} pt
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-black ${isPlus ? "text-green-400" : "text-red-400"}`}
                  >
                    {isPlus ? "+" : ""}
                    {netCash.toLocaleString()}
                    <span className="text-xs ml-0.5">円</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 py-3 border-y border-slate-800/50 mb-4">
                {Object.entries(stats).map(
                  ([type, count]) =>
                    count > 0 && (
                      <div
                        key={type}
                        className="bg-slate-950 px-2 py-1 rounded-full border border-slate-800 flex items-center gap-2"
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
              <div className="space-y-1.5">
                {results.map((other) => {
                  if (other.name === player.name) return null;
                  const diff = player.total - other.total;
                  return (
                    <div
                      key={other.name}
                      className="flex justify-between items-center text-[11px] font-bold text-slate-500"
                    >
                      <span>vs {other.name}</span>
                      <span
                        className={
                          diff >= 0 ? "text-green-500/70" : "text-red-500/70"
                        }
                      >
                        {diff >= 0 ? "+" : ""}
                        {(diff * rate).toLocaleString()}円
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-6 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 pb-10">
        <button
          onClick={() => {
            if (window.confirm("履歴を残して、新しいゲームを開始しますか？")) {
              onNewGame(); // ここでリセット関数を実行
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

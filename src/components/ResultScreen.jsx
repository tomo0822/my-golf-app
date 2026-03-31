export default function ResultScreen({
  players,
  scores,
  rate,
  calculateTotalScores,
}) {
  const finalResults = calculateTotalScores();
  const sumAllScores = finalResults.reduce((sum, p) => sum + p.total, 0);
  const playerCount = players.length;

  // 各プレイヤーのメダル獲得数をカウントする関数
  const getMedalStats = (playerName) => {
    const stats = { 金: 0, 銀: 0, 銅: 0, 鉄: 0, ダ: 0 };
    Object.values(scores).forEach((holeScores) => {
      const medal = holeScores[playerName];
      if (medal && stats[medal] !== undefined) stats[medal]++;
    });
    return stats;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col">
      <header className="text-center mb-6 pt-4">
        <h1 className="text-[10px] font-black text-green-500 tracking-[0.4em] mb-1">
          FINAL SETTLEMENT
        </h1>
        <div className="text-3xl font-black italic">最終結果発表</div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto pb-32">
        {finalResults.map((player, idx) => {
          const stats = getMedalStats(player.name);
          // 収支計算ロジック
          const netPoints = player.total * playerCount - sumAllScores;
          const netCash = netPoints * rate;
          const isPlus = netCash >= 0;

          return (
            <div
              key={player.name}
              className={`relative bg-slate-900 border-2 ${
                idx === 0
                  ? "border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                  : "border-slate-800"
              } rounded-[2.5rem] p-6`}
            >
              {/* 順位タグ */}
              <div
                className={`absolute top-0 right-8 px-4 py-1 rounded-b-xl font-black text-[14px] ${
                  idx === 0
                    ? "bg-yellow-500 text-yellow-950"
                    : "bg-slate-800 text-slate-400"
                }`}
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

              {/* 獲得メダル統計 */}
              <div className="flex flex-wrap gap-1.5 mb-1 py-3 border-y border-slate-800/50">
                {Object.entries(stats).map(
                  ([type, count]) =>
                    count > 0 && (
                      <div
                        key={type}
                        className="bg-slate-950 px-2 py-1 rounded-full border border-slate-800 flex items-center gap-1.5"
                      >
                        <span
                          className={`text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full ${
                            type === "金"
                              ? "bg-yellow-500 text-yellow-950"
                              : type === "銀"
                                ? "bg-slate-300 text-slate-900"
                                : type === "銅"
                                  ? "bg-orange-500 text-orange-950"
                                  : type === "鉄"
                                    ? "bg-blue-500 text-blue-50"
                                    : "bg-cyan-400 text-cyan-950"
                          }`}
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
                {finalResults
                  .reduce(
                    (acc, p) =>
                      acc + (p.total * playerCount - sumAllScores) * rate,
                    0,
                  )
                  .toLocaleString()}{" "}
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

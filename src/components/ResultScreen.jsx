export default function ResultScreen({
  players,
  scores,
  rate,
  calculateTotalScores,
}) {
  const results = calculateTotalScores();
  const sumAllScores = results.reduce((sum, p) => sum + p.total, 0);
  const playerCount = players.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 pb-32">
      <header className="text-center my-6">
        <h1 className="text-[10px] font-black text-green-500 tracking-widest">
          FINAL SETTLEMENT
        </h1>
        <div className="text-3xl font-black">最終結果発表</div>
      </header>

      <div className="space-y-4">
        {results.map((player, idx) => {
          const netPoints = player.total * playerCount - sumAllScores;
          const netCash = netPoints * rate;
          return (
            <div
              key={player.name}
              className={`bg-slate-900 p-6 rounded-[2.5rem] border-2 ${idx === 0 ? "border-yellow-500" : "border-slate-800"}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black">{player.name}</h3>
                  <p className="text-green-400 font-bold">{player.total} pt</p>
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-black ${netCash >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {netCash >= 0 ? "+" : ""}
                    {netCash.toLocaleString()}{" "}
                    <span className="text-xs">円</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-6 bg-slate-950/90 border-t border-slate-800">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="w-full bg-slate-800 py-4 rounded-2xl font-black"
        >
          NEW GAME
        </button>
      </footer>
    </div>
  );
}

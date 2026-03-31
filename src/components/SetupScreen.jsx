export default function SetupScreen({
  players,
  setPlayers,
  rate,
  setRate,
  onStart,
}) {
  const addPlayer = () => players.length < 4 && setPlayers([...players, ""]);
  const removePlayer = (index) =>
    players.length > 2 && setPlayers(players.filter((_, i) => i !== index));

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white flex flex-col items-center">
      <h1 className="text-4xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-700">
        OLYMPIC
      </h1>
      <div className="max-w-md bg-slate-900 border border-slate-800 p-6 mt-4 rounded-[2rem] shadow-2xl flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-[10px] font-black text-slate-500 tracking-[0.2em] mb-1 uppercase">
              Players
            </h2>
            <p className="text-xl font-black text-white">メンバー登録</p>
          </div>
          {players.length < 4 && (
            <button
              onClick={addPlayer}
              className="bg-blue-600 text-white text-[14px] font-black px-4 py-2 rounded-xl"
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
          onClick={onStart}
          className="w-full bg-gradient-to-b from-green-500 to-green-700 py-4 rounded-2xl font-black text-lg text-white active:scale-[0.98] transition-all"
        >
          START GAME
        </button>
      </div>
    </div>
  );
}

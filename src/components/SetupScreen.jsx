export default function SetupScreen({
  players,
  setPlayers,
  courseName,
  setCourseName,
  rate,
  setRate,
  onStart,
  history = [],
  onDeleteHistory,
}) {
  const addPlayer = () => players.length < 4 && setPlayers([...players, ""]);
  const removePlayer = (index) =>
    players.length > 2 && setPlayers(players.filter((_, i) => i !== index));

  return (
    <div className="p-6 min-h-screen bg-slate-950 text-white flex flex-col items-center pb-24">
      <header className="mt-4 mb-8 text-center">
        <h1 className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-green-300 via-green-500 to-green-800 tracking-tighter">
          OLYMPIC
        </h1>
      </header>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl flex flex-col gap-5">
        {/* ゴルフ場名入力 */}
        <div className="px-1">
          <h2 className="text-[10px] font-black text-slate-500 tracking-[0.2em] mb-2 uppercase">
            Golf Course
          </h2>
          <input
            className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl font-bold focus:border-green-500 outline-none text-sm shadow-inner"
            value={courseName}
            placeholder="ゴルフ場名を入力"
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>

        <div className="px-1">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">
              Players
            </h2>
            {players.length < 4 && (
              <button
                onClick={addPlayer}
                className="text-blue-500 text-[11px] font-black"
              >
                ＋ 追加
              </button>
            )}
          </div>
          <div className="space-y-2">
            {players.map((name, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="flex-1 bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl font-bold focus:border-green-500 outline-none text-sm"
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
                    className="text-slate-600 px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-500 italic">
              1pt =
            </span>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="bg-transparent text-2xl font-black text-green-400 w-20 text-center outline-none"
            />
            <span className="text-xs font-bold text-slate-500">円</span>
          </div>
        </div>
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-b from-green-500 to-green-700 py-5 rounded-[1.5rem] font-black text-xl active:scale-[0.97] transition-all shadow-lg"
        >
          START GAME
        </button>
      </div>

      {/* 履歴セクション */}
      <div className="w-full max-w-md mt-12 space-y-4">
        <h2 className="text-[11px] font-black text-slate-600 tracking-[0.3em] uppercase text-center italic">
          History
        </h2>
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-[1.5rem] p-4 relative shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-500 uppercase">
                  {item.date}
                </span>
                <span className="text-xs font-black text-green-500 truncate max-w-[150px]">
                  {item.course}
                </span>
              </div>
              <button
                onClick={() => onDeleteHistory(item.id)}
                className="text-slate-700 text-[10px]"
              >
                削除
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {item.players.map((p, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/50"
                >
                  <span className="text-[10px] font-bold truncate max-w-[60px] text-slate-400">
                    {p.name}
                  </span>
                  <span
                    className={`text-[11px] font-black ${p.netCash >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {p.netCash >= 0 ? "+" : ""}
                    {p.netCash.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

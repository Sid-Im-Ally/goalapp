// GOAL — shared UI components
const { useState, useEffect, useRef } = React;

// ─── Header ──────────────────────────────────────────────────────────
function Header({ tab }) {
  const { PROGRAM } = window.GOAL_DATA;
  const dayStr = String(PROGRAM.currentDay).padStart(3, "0");
  const totalStr = String(PROGRAM.totalDays).padStart(3, "0");
  const pct = (PROGRAM.currentDay / PROGRAM.totalDays) * 100;

  const subtitleByTab = {
    STRONGER: `PHASE ${PROGRAM.phase} · WK ${PROGRAM.week} · DAY ${PROGRAM.day}`,
    FASTER: "ENERGY SYSTEMS · PERFORMANCE",
    STEADIER: `RECOVERY BLOCK · WK ${PROGRAM.week}`,
    WIAHWIB: "WHO I AM · HOW I'LL BE",
  };

  return (
    <div className="goal-header">
      <div className="goal-header-row">
        <div className="goal-tab-name">{tab}</div>
        <div className="goal-day-counter">
          <span className="goal-day-num">{dayStr}</span>
          <span className="goal-day-total">/{totalStr}</span>
        </div>
      </div>
      <div className="goal-header-sub">{subtitleByTab[tab]}</div>
      <div className="goal-progress-track">
        <div className="goal-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Bottom Nav ──────────────────────────────────────────────────────
function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: "STRONGER", icon: <IconStronger /> },
    { id: "FASTER", icon: <IconFaster /> },
    { id: "STEADIER", icon: <IconReady /> },
    { id: "WIAHWIB", icon: <IconWhy /> },
  ];
  return (
    <div className="goal-bottomnav">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`goal-navbtn ${tab === t.id ? "active" : ""}`}
          onClick={() => setTab(t.id)}
        >
          <div className="goal-navicon">{t.icon}</div>
          <div className="goal-navlabel">{t.id}</div>
        </button>
      ))}
    </div>
  );
}

// ─── Icons (line, athletic) ──────────────────────────────────────────
function IconStronger() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <rect x="6" y="8" width="2.5" height="8" fill="currentColor" stroke="none" />
      <rect x="15.5" y="8" width="2.5" height="8" fill="currentColor" stroke="none" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
    </svg>
  );
}
function IconFaster() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <polyline points="3,18 8,11 13,14 21,5" />
      <polyline points="16,5 21,5 21,10" />
    </svg>
  );
}
function IconReady() {
  // Balanced figure / steady-stance — two feet on a baseline with vertical plumb line
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="12" y1="3" x2="12" y2="15" />
      <line x1="3" y1="20" x2="21" y2="20" />
      <polyline points="6,15 12,15 18,15" />
      <line x1="6" y1="15" x2="4" y2="20" />
      <line x1="18" y1="15" x2="20" y2="20" />
    </svg>
  );
}
function IconWhy() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
      <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />
    </svg>
  );
}

// ─── Sparkline ───────────────────────────────────────────────────────
function Sparkline({ data, height = 36, accent = false }) {
  if (!data || data.length === 0) return null;
  const w = 100;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = pts.split(" ").pop().split(",");
  return (
    <svg className="goal-spark" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={accent ? "var(--accent)" : "var(--ink)"}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r="2" fill={accent ? "var(--accent)" : "var(--ink)"} />
    </svg>
  );
}

// ─── Set checkbox ────────────────────────────────────────────────────
function SetBox({ done, onClick, idx }) {
  return (
    <button
      className={`goal-setbox ${done ? "done" : ""}`}
      onClick={onClick}
      aria-label={`Set ${idx + 1}`}
    >
      {done ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <polyline points="2,7 6,11 12,3" stroke="white" strokeWidth="2" strokeLinecap="square" fill="none" />
        </svg>
      ) : (
        <span>{idx + 1}</span>
      )}
    </button>
  );
}

// ─── Rest timer ──────────────────────────────────────────────────────
function RestTimer({ seconds, exId }) {
  const [running, setRunning] = useState(false);
  const [remain, setRemain] = useState(seconds);
  useEffect(() => {
    if (!running) return;
    if (remain <= 0) { setRunning(false); return; }
    const t = setTimeout(() => setRemain((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [running, remain]);

  useEffect(() => { setRemain(seconds); setRunning(false); }, [seconds, exId]);

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const pct = seconds > 0 ? ((seconds - remain) / seconds) * 100 : 0;

  return (
    <button
      className={`goal-rest ${running ? "running" : ""}`}
      onClick={() => {
        if (remain === 0) setRemain(seconds);
        setRunning(!running);
      }}
    >
      <span className="goal-rest-label">REST</span>
      <span className="goal-rest-time">{fmt(remain)}</span>
      {running && <div className="goal-rest-fill" style={{ width: `${pct}%` }} />}
    </button>
  );
}

// ─── Workout exercise tile (used by STRONGER + READY) ────────────────
function ExerciseTile({ exercise, idx }) {
  const [done, setDone] = useState(exercise.done);
  const [showSubs, setShowSubs] = useState(false);
  const [restingFor, setRestingFor] = useState(null);

  const toggle = (i) => {
    const next = [...done];
    next[i] = !next[i];
    setDone(next);
    if (next[i]) setRestingFor(i);
  };

  const completed = done.filter(Boolean).length;
  const total = done.length;
  const allDone = completed === total;

  return (
    <div className={`goal-extile ${allDone ? "complete" : ""}`}>
      <div className="goal-extile-head">
        <div className="goal-extile-num">{String(idx + 1).padStart(2, "0")}</div>
        <div className="goal-extile-name">{exercise.name}</div>
        <div className="goal-extile-progress">
          {completed}/{total}
        </div>
      </div>

      <div className="goal-extile-stats">
        <div className="goal-stat">
          <div className="goal-stat-label">SETS×REPS</div>
          <div className="goal-stat-val">
            {exercise.sets}<span className="goal-stat-x">×</span>{exercise.reps}
          </div>
        </div>
        <div className="goal-stat">
          <div className="goal-stat-label">LOAD</div>
          <div className="goal-stat-val">{exercise.load}</div>
        </div>
        <div className="goal-stat">
          <div className="goal-stat-label">REST</div>
          <div className="goal-stat-val">
            {exercise.rest > 0 ? `${exercise.rest}s` : "—"}
          </div>
        </div>
      </div>

      <div className="goal-extile-sets">
        {done.map((d, i) => (
          <SetBox key={i} idx={i} done={d} onClick={() => toggle(i)} />
        ))}
        {exercise.rest > 0 && (
          <RestTimer seconds={exercise.rest} exId={`${idx}-${restingFor}`} />
        )}
      </div>

      {exercise.notes && (
        <div className="goal-extile-notes">
          <span className="goal-notes-label">NOTE</span>
          <span>{exercise.notes}</span>
        </div>
      )}

      <button
        className="goal-subs-toggle"
        onClick={() => setShowSubs(!showSubs)}
      >
        <span>SUBSTITUTES</span>
        <span className="goal-chev">{showSubs ? "−" : "+"}</span>
      </button>
      {showSubs && (
        <ul className="goal-subs-list">
          {exercise.subs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

Object.assign(window, {
  Header, BottomNav, Sparkline, SetBox, RestTimer, ExerciseTile,
});

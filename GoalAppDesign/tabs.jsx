// GOAL — tab views

const { useState: useState2 } = React;

// ─── STRONGER ────────────────────────────────────────────────────────
function StrongerView() {
  const { STRONGER_TODAY } = window.GOAL_DATA;
  return (
    <div className="goal-tabview">
      <Header tab="STRONGER" />
      <div className="goal-workout-meta">
        <div className="goal-workout-title">{STRONGER_TODAY.title}</div>
        <div className="goal-workout-dur">{STRONGER_TODAY.duration}</div>
      </div>
      <div className="goal-tile-stack">
        {STRONGER_TODAY.exercises.map((ex, i) => (
          <ExerciseTile key={ex.name} exercise={ex} idx={i} />
        ))}
      </div>
      <div className="goal-bottom-spacer" />
    </div>
  );
}

// ─── FASTER ──────────────────────────────────────────────────────────
function FasterView() {
  const { FASTER_ACTIVITIES } = window.GOAL_DATA;
  const [openId, setOpenId] = useState2(null);
  return (
    <div className="goal-tabview">
      <Header tab="FASTER" />
      <div className="goal-tile-stack">
        {FASTER_ACTIVITIES.map((a) => (
          <ActivityTile
            key={a.id}
            activity={a}
            open={openId === a.id}
            onToggle={() => setOpenId(openId === a.id ? null : a.id)}
          />
        ))}
      </div>
      <div className="goal-bottom-spacer" />
    </div>
  );
}

function ActivityTile({ activity, open, onToggle }) {
  return (
    <div className={`goal-acttile ${open ? "open" : ""}`}>
      <button className="goal-acttile-head" onClick={onToggle}>
        <div className="goal-acttile-name">{activity.name}</div>
        <div className="goal-acttile-period">{activity.period}</div>
      </button>

      <div className="goal-acttile-primary">
        <div className="goal-primary-left">
          <div className="goal-primary-label">{activity.primary}</div>
          <div className="goal-primary-value">{activity.primaryValue}</div>
          <div className={`goal-primary-delta ${activity.deltaPositive ? "up" : "down"}`}>
            <span className="goal-delta-arrow">
              {activity.deltaPositive ? "▲" : "▼"}
            </span>
            <span>{activity.primaryDelta}</span>
          </div>
        </div>
        <div className="goal-primary-right">
          <Sparkline data={activity.trend} height={56} accent />
        </div>
      </div>

      {open && (
        <div className="goal-acttile-detail">
          <div className="goal-detail-grid">
            {activity.metrics.map((m) => (
              <div className="goal-detail-cell" key={m.label}>
                <div className="goal-detail-label">{m.label}</div>
                <div className="goal-detail-val">{m.value}</div>
              </div>
            ))}
          </div>
          <div className="goal-last-session">
            <span className="goal-last-label">LAST</span>
            <span>{activity.lastSession}</span>
          </div>
          <button className="goal-log-btn">+ LOG SESSION</button>
        </div>
      )}
    </div>
  );
}

// ─── READY ───────────────────────────────────────────────────────────
function ReadyView() {
  const { READY_TODAY } = window.GOAL_DATA;
  return (
    <div className="goal-tabview">
      <Header tab="STEADIER" />
      <div className="goal-workout-meta">
        <div className="goal-workout-title">{READY_TODAY.title}</div>
        <div className="goal-workout-dur">{READY_TODAY.duration}</div>
      </div>
      <div className="goal-tile-stack">
        {READY_TODAY.exercises.map((ex, i) => (
          <ExerciseTile key={ex.name} exercise={ex} idx={i} />
        ))}
      </div>
      <div className="goal-bottom-spacer" />
    </div>
  );
}

// ─── WHY ─────────────────────────────────────────────────────────────
function WhyView() {
  const { WHY_TILES } = window.GOAL_DATA;
  const [idx, setIdx] = useState2(0);
  const total = WHY_TILES.length;
  const cur = WHY_TILES[idx];

  const next = () => setIdx((idx + 1) % total);
  const prev = () => setIdx((idx - 1 + total) % total);

  // swipe
  const startX = React.useRef(0);
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > 50) prev();
    if (dx < -50) next();
  };

  return (
    <div className="goal-tabview">
      <Header tab="WIAHWIB" />
      <div
        className="goal-why-stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={`goal-why-card tone-${cur.tone}`}>
          <div className="goal-why-placeholder">
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <pattern id={`stripes-${cur.id}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.06)" strokeWidth="3" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill={`url(#stripes-${cur.id})`} />
            </svg>
            <div className="goal-why-caption">
              <div className="goal-why-id">PHOTO {String(idx + 1).padStart(2, "0")}</div>
              <div className="goal-why-text">{cur.placeholder}</div>
              <div className="goal-why-hint">[ tap upload to swap ]</div>
            </div>
          </div>
        </div>

        <div className="goal-why-meta">
          <div className="goal-why-label">{cur.label}</div>
          <div className="goal-why-counter">
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        </div>

        <div className="goal-why-controls">
          <button className="goal-why-btn" onClick={prev} aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,4 7,12 15,20" /></svg>
          </button>
          <div className="goal-why-dots">
            {WHY_TILES.map((_, i) => (
              <button
                key={i}
                className={`goal-why-dot ${i === idx ? "active" : ""}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
          <button className="goal-why-btn" onClick={next} aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,4 17,12 9,20" /></svg>
          </button>
        </div>
      </div>
      <div className="goal-bottom-spacer" />
    </div>
  );
}

Object.assign(window, { StrongerView, FasterView, ReadyView, WhyView });

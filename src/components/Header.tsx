interface HeaderProps {
  tab: string
  subtitle: string
  current: number
  total: number
  accent?: string
}

export function Header({ tab, subtitle, current, total, accent }: HeaderProps) {
  const pct = total > 0 ? (current / total) * 100 : 0
  const dayStr = String(current).padStart(3, '0')
  const totalStr = String(total).padStart(3, '0')
  const color = accent ?? 'var(--accent)'

  return (
    <div className="goal-header">
      <div className="goal-header-row">
        <div className="goal-tab-name">{tab}</div>
        {total > 0 && (
          <div className="goal-day-counter" style={{ color }}>
            <span className="goal-day-num" style={{ color }}>{dayStr}</span>
            <span className="goal-day-total">/{totalStr}</span>
          </div>
        )}
      </div>
      <div className="goal-header-sub">{subtitle}</div>
      <div className="goal-progress-track">
        <div className="goal-progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

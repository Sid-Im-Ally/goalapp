'use client'
import { useState, useEffect } from 'react'
import type { CTActivity, CTMetric } from '@/lib/types'
import { logSession, getSessionsForActivity, deleteSession, type LoggedSession } from '@/lib/faster'

interface ActivityTileProps {
  activity: CTActivity
  accent?: string
}

const intensityLabel: Record<string, string> = {
  low: 'LOW',
  moderate: 'MOD',
  high: 'HIGH',
  max: 'MAX',
}

function metricInputMode(type: string): React.HTMLAttributes<HTMLInputElement>['inputMode'] {
  if (type === 'number' || type === 'rating') return 'decimal'
  return 'text'
}

function metricPlaceholder(metric: CTMetric): string {
  if (metric.type === 'rating') return '1–10'
  if (metric.type === 'pace') return '0:00'
  if (metric.type === 'duration') return '0:00'
  if (metric.type === 'time') return '00:00'
  return '—'
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`
}

function SessionHistory({
  sessions,
  metrics,
  onDelete,
  accent,
}: {
  sessions: LoggedSession[]
  metrics: CTMetric[]
  onDelete: (id: string) => void
  accent?: string
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (sessions.length === 0) return null

  return (
    <div className="goal-session-history">
      <div className="goal-history-heading" style={{ color: accent }}>HISTORY</div>
      {sessions.map((session) => {
        const isOpen = expanded === session.id
        const filledMetrics = metrics.filter(
          (m) => session.values[m.key] && session.values[m.key].trim() !== ''
        )
        // Show up to 3 key metrics inline in the collapsed row
        const preview = filledMetrics.slice(0, 3)

        return (
          <div key={session.id} className="goal-session-row">
            <button
              className="goal-session-row-head"
              onClick={() => setExpanded(isOpen ? null : session.id)}
            >
              <span className="goal-session-date">{formatDate(session.date)}</span>
              <span className="goal-session-preview">
                {preview.map((m) => (
                  <span key={m.key} className="goal-session-chip" style={accent ? { background: `${accent}18`, color: accent } : undefined}>
                    {session.values[m.key]}
                    <span className="goal-session-chip-unit" style={{ color: accent ? `${accent}99` : undefined }}>{m.unit !== 'text' ? ` ${m.unit}` : ''}</span>
                  </span>
                ))}
              </span>
              <span className="goal-session-chev">{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
              <div className="goal-session-detail">
                <div className="goal-metric-grid" style={{ marginBottom: 10 }}>
                  {filledMetrics.map((m) => (
                    <div key={m.key} className={`goal-metric-cell ${m.type === 'text' ? 'goal-metric-cell--full' : ''}`}>
                      <div className="goal-metric-label">
                        {m.label}
                        {m.unit && m.unit !== 'text' && (
                          <span className="goal-metric-unit"> {m.unit}</span>
                        )}
                      </div>
                      <div className="goal-session-val">{session.values[m.key]}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="goal-delete-btn"
                  onClick={() => onDelete(session.id)}
                >
                  DELETE
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ActivityTile({ activity, accent }: ActivityTileProps) {
  const color = accent ?? 'var(--accent)'
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<Record<string, string>>({})
  const [sessions, setSessions] = useState<LoggedSession[]>([])

  useEffect(() => {
    if (open) setSessions(getSessionsForActivity(activity.id))
  }, [open, activity.id])

  const set = (key: string, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }))

  const filledCount = Object.values(values).filter((v) => v.trim() !== '').length

  const handleLog = () => {
    if (filledCount === 0) return
    logSession(activity.id, values)
    setSessions(getSessionsForActivity(activity.id))
    setValues({})
  }

  const handleDelete = (id: string) => {
    deleteSession(id)
    setSessions(getSessionsForActivity(activity.id))
  }

  return (
    <div className="goal-acttile">
      <button className="goal-acttile-head" onClick={() => setOpen((o) => !o)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="goal-acttile-name">{activity.name}</div>
          {activity.description && (
            <div className="goal-acttile-period" style={{ marginTop: 2 }}>
              {activity.description}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span
            className={`goal-intensity-badge ${activity.intensity}`}
            style={{ color, borderColor: color }}
          >
            {intensityLabel[activity.intensity] ?? activity.intensity.toUpperCase()}
          </span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--muted)', marginLeft: 4 }}>
            {open ? '−' : '+'}
          </span>
        </div>
      </button>

      {(activity.duration_typical_min > 0 || activity.equipment?.length > 0) && (
        <div className="goal-activity-meta" style={{ padding: '0 14px 10px' }}>
          {activity.duration_typical_min > 0 && <span>{activity.duration_typical_min} MIN</span>}
          {activity.equipment?.length > 0 && <span>{activity.equipment.join(', ')}</span>}
        </div>
      )}

      {open && (
        <div className="goal-acttile-detail">
          {/* metric inputs */}
          {activity.metrics.length > 0 && (
            <div className="goal-metric-grid">
              {activity.metrics.map((metric) =>
                metric.type === 'text' ? (
                  <div key={metric.key} className="goal-metric-cell goal-metric-cell--full">
                    <div className="goal-metric-label">{metric.label}</div>
                    <textarea
                      className="goal-metric-textarea"
                      value={values[metric.key] ?? ''}
                      onChange={(e) => set(metric.key, e.target.value)}
                      placeholder="notes..."
                      rows={2}
                    />
                  </div>
                ) : (
                  <div key={metric.key} className="goal-metric-cell">
                    <div className="goal-metric-label">
                      {metric.label}
                      {metric.unit && metric.unit !== 'text' && (
                        <span className="goal-metric-unit"> {metric.unit}</span>
                      )}
                    </div>
                    <input
                      type="text"
                      inputMode={metricInputMode(metric.type)}
                      className="goal-metric-input"
                      value={values[metric.key] ?? ''}
                      onChange={(e) => set(metric.key, e.target.value)}
                      placeholder={metricPlaceholder(metric)}
                    />
                  </div>
                )
              )}
            </div>
          )}

          {activity.improvement_tip && (
            <div className="goal-extile-notes" style={{ marginTop: 10 }}>
              <span className="goal-notes-label">TIP</span>
              <span>{activity.improvement_tip}</span>
            </div>
          )}

          <button
            className="goal-log-btn"
            onClick={handleLog}
            disabled={filledCount === 0}
            style={{
              opacity: filledCount === 0 ? 0.4 : 1,
              marginBottom: sessions.length > 0 ? 0 : undefined,
              background: filledCount > 0 ? color : 'var(--ink)',
              borderColor: filledCount > 0 ? color : 'var(--ink)',
            }}
          >
            {filledCount > 0
              ? `+ LOG SESSION (${filledCount} field${filledCount > 1 ? 's' : ''})`
              : '+ LOG SESSION'}
          </button>

          {/* history */}
          <SessionHistory
            sessions={sessions}
            metrics={activity.metrics}
            onDelete={handleDelete}
            accent={color}
          />
        </div>
      )}
    </div>
  )
}

'use client';

import { useState } from 'react';

interface LeaderboardClientProps {
  rankings: Array<{
    id: string;
    streak_count: number;
    is_winner: boolean;
    profile?: { username?: string; full_name?: string };
    tier?: { name: string };
  }>;
}

const BADGE_COLORS: Record<string, string> = {
  gold: '#D4AF37', silver: '#A7B0C0', bronze: '#CD7F32',
};

export default function LeaderboardClient({ rankings }: LeaderboardClientProps) {
  const [tab, setTab] = useState<'weekly' | 'monthly' | 'alltime'>('alltime');
  const [search, setSearch] = useState('');

  const filtered = rankings.filter(r => 
    (r.profile?.username || r.profile?.full_name || 'Guest')
    .toLowerCase()
    .includes(search.toLowerCase())
  );

  const top3 = filtered.slice(0, 3);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{
        padding: '72px 0 56px',
        background: 'linear-gradient(180deg, #0D1321 0%, #070B14 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} aria-hidden="true" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Rankings</div>
          <h1 className="section-title" style={{ margin: '0 auto 12px', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
            Global Leaderboard
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Top challengers ranked by streak performance and verified wins.
          </p>
        </div>
      </section>

      {/* Top 3 Spotlight */}
      <section className="section-sm" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
            {top3.map((player, i) => {
              const badge = i === 0 ? 'gold' : i === 1 ? 'silver' : 'bronze';
              const name = player.profile?.username || player.profile?.full_name || 'Challenger';
              return (
                <div key={player.id} style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${BADGE_COLORS[badge] + '40'}`,
                  borderRadius: '20px', padding: '28px',
                  textAlign: 'center',
                  boxShadow: i === 0 ? '0 0 60px rgba(212,175,55,0.15)' : 'var(--shadow-card)',
                  position: 'relative',
                  transform: i === 0 ? 'scale(1.04)' : 'scale(1)',
                }}>
                  {i === 0 && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                      borderRadius: '20px 20px 0 0',
                      background: 'linear-gradient(135deg, #D4AF37, #F6D365)',
                    }} aria-hidden="true" />
                  )}
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                  </div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.875rem', fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: BADGE_COLORS[badge],
                    marginBottom: '4px',
                  }}>#{i + 1}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.125rem', fontWeight: 800, color: '#F8FAFC', marginBottom: '16px' }}>
                    {name}
                  </div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.75rem', fontWeight: 900,
                    background: 'linear-gradient(135deg, #D4AF37, #F6D365)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    letterSpacing: '-0.03em', marginBottom: '8px',
                  }}>{player.streak_count}/3 Streak</div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <div className="tabs-list">
              {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                <button
                  key={t}
                  className={`tab-trigger ${tab === t ? 'active' : ''}`}
                  onClick={() => setTab(t)}
                >
                  {t === 'weekly' ? 'Weekly' : t === 'monthly' ? 'Monthly' : 'All Time'}
                </button>
              ))}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="search"
                placeholder="Search username..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: '16px', width: '220px' }}
                aria-label="Search leaderboard"
              />
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="table" aria-label="Leaderboard rankings">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Current Streak</th>
                  <th>Tier</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.id}>
                    <td>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 800,
                        fontSize: i < 3 ? '1.375rem' : '1rem',
                        color: i === 0 ? BADGE_COLORS.gold : i === 1 ? BADGE_COLORS.silver : i === 2 ? BADGE_COLORS.bronze : '#6E7A91',
                      }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#F8FAFC' }}>
                        {row.profile?.username || row.profile?.full_name || 'Guest Challenger'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: row.streak_count === 3 ? '#22C55E' : '#D4AF37', fontWeight: 700 }}>{row.streak_count}/3</span>
                    </td>
                    <td style={{ color: '#A7B0C0', fontWeight: 600 }}>{row.tier?.name || 'Starter'}</td>
                    <td>
                      {row.is_winner
                        ? <span className="badge badge-success">Verified</span>
                        : <span className="badge badge-blue">In Progress</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

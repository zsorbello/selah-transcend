import { Link } from 'react-router-dom'

const apps = [
  { name: 'Selah', path: '/selah', description: 'Faith-rooted mental wellness companion' },
  { name: 'App 2', path: '/app2', description: 'Coming soon' },
  { name: 'App 3', path: '/app3', description: 'Coming soon' },
  { name: 'App 4', path: '/app4', description: 'Coming soon' },
  { name: 'App 5', path: '/app5', description: 'Coming soon' },
  { name: 'App 6', path: '/app6', description: 'Coming soon' },
]

export default function Hub() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem' }}>
          Selah Transcend
        </h1>
        <p style={{ textAlign: 'center', color: '#a0aec0', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Choose an app to get started
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
        }}>
          {apps.map(app => (
            <Link
              key={app.path}
              to={app.path}
              style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '2rem',
                textDecoration: 'none',
                color: '#fff',
                transition: 'transform 0.2s, background 0.2s',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.14)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              }}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.5rem' }}>{app.name}</h2>
              <p style={{ color: '#a0aec0', fontSize: '0.95rem', margin: 0 }}>{app.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

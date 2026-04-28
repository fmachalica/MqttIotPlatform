import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

function App() {
  // 🔐 LOGIN STATE
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // 📌 MENU VIEW
  const [view, setView] = useState('chart')

  // 📊 DATA
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [data, setData] = useState([])

  const [newValue, setNewValue] = useState('')

  // ---------------- LOGIN ----------------
  const handleLogin = () => {
    if (username === 'admin' && password === 'test1234') {
      setLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials')
    }
  }

  // ---------------- API ----------------
  const fetchData = () => {
    if (!startTime || !endTime) return

    const url = `/api/measurements?start_time=${startTime}&end_time=${endTime}`

    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }

  const sendData = () => {
    if (!newValue) return

    fetch('/api/set_angle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: Number(newValue) })
    })
      .then(res => res.json())
      .then(() => {
        setNewValue('')
      })
      .catch(console.error)
  }

  // ---------------- LOGIN SCREEN ----------------
  if (!loggedIn) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#111',
        color: 'white'
      }}>
        <div>
          <h2>Login</h2>

          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br /><br />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={handleLogin}>Login</button>

          {loginError && (
            <p style={{ color: 'red' }}>{loginError}</p>
          )}
        </div>
      </div>
    )
  }

  // ---------------- DASHBOARD ----------------
  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* LEFT MENU */}
      <div style={{
        width: 200,
        padding: 20,
        background: '#111',
        color: 'white'
      }}>
        <h3>Menu</h3>

        <button
          style={{ width: '100%', marginBottom: 10 }}
          onClick={() => setView('chart')}
        >
          Chart
        </button>

        <button
          style={{ width: '100%' }}
          onClick={() => setView('add')}
        >
          Add Data
        </button>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* CHART VIEW */}
        {view === 'chart' && (
          <>
            <h1>Chart</h1>

            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ marginLeft: 10 }}
            />

            <button onClick={fetchData} style={{ marginLeft: 10 }}>
              Load
            </button>

            <div style={{ height: 400, marginTop: 20 }}>
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ADD DATA VIEW */}
        {view === 'add' && (
          <>
            <h1>Add Data</h1>

            <input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="value"
            />

            <button onClick={sendData} style={{ marginLeft: 10 }}>
              Send
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default App
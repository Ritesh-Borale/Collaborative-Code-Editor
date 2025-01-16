import { useState } from 'react'
import AppRoutes from './routes/Approutes'
import { UserProvider } from "./context/user.context"

function App() {
  const [count, setCount] = useState(0)

  return (
    <UserProvider>
      <AppRoutes/>
    </UserProvider>
  )
}

export default App

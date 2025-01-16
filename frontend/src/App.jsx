import { useState } from 'react'
import AppRoutes from './routes/Approutes'
import { UserProvider } from "./context/user.context"
import './App.css'
import { Toaster } from 'react-hot-toast';


function App() {
  const [count, setCount] = useState(0)

  return (
    <UserProvider>

      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      <AppRoutes />
    
    </UserProvider>
  )
}

export default App

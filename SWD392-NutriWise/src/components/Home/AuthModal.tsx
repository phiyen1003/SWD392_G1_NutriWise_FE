import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase-config"

interface AuthModalProps {
  open: boolean
  onClose: () => void
  onLoginSuccess: (user: { email: string }) => void
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tabValue, setTabValue] = useState(0)
  const [error, setError] = useState("")

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setError("")
  }

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      onLoginSuccess({ email: userCredential.user.email! })
      onClose()
    }catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred.")
      }
    }
    
  }

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      onLoginSuccess({ email: userCredential.user.email! })
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred.")
      }
    }
    
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      onLoginSuccess({ email: result.user.email! });
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={tabValue === 0 ? handleLogin : handleRegister}>{tabValue === 0 ? "Login" : "Register"}</Button>
        <Button onClick={handleGoogleLogin}>Login with Google</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AuthModal


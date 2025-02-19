import type React from "react"
import { Box } from "@mui/material"
import Sidebar from "../../layout/Sidebar"
import Header from "../../layout/Header"
import Footer from "../../layout/Footer"

interface LayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header title={title} subtitle={subtitle} />
        {children}
        <Footer />
      </Box>
    </Box>
  )
}

export default Layout


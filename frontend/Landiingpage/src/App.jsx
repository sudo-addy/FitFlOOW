import React from 'react'
import Hero from './components/Hero'
import BrandPhilosophy from './components/BrandPhilosophy'
import './App.css'

function App() {
  return (
    <main className="app-container">
      {/* Step 2 — Hero Section */}
      <Hero />
      {/* Step 3 — Brand Philosophy Section */}
      <BrandPhilosophy />
    </main>
  )
}

export default App


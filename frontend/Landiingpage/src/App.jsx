import React from 'react'
import Hero from './components/Hero'
import BrandPhilosophy from './components/BrandPhilosophy'
import AscensionChambers from './components/AscensionChambers'
import SanctumGallery from './components/SanctumGallery'
import './App.css'

function App() {
  return (
    <main className="app-container">
      {/* Step 2 — Hero Section */}
      <Hero />
      {/* Step 3 — Brand Philosophy Section */}
      <BrandPhilosophy />
      {/* Step 8 — Ascension Chambers Section */}
      <AscensionChambers />
      {/* Step 10 — Sanctum Gallery Section */}
      <SanctumGallery />
    </main>
  )
}

export default App


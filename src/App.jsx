import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LanguagePicker from './components/LanguagePicker.jsx'
import { useLanguage } from './i18n/index.js'

import Home from './pages/Home.jsx'
import Learn from './pages/Learn.jsx'
import CheckContent from './pages/CheckContent.jsx'
import BeforeInvest from './pages/BeforeInvest.jsx'
import Decisions from './pages/Decisions.jsx'
import Problem from './pages/Problem.jsx'
import Recovery from './pages/Recovery.jsx'

/** Scroll to top on route change (avoids sticky scroll positions). */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  const { pickerOpen } = useLanguage()

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/check" element={<CheckContent />} />
          <Route path="/before-invest" element={<BeforeInvest />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/problem" element={<Problem />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Footer />

      {pickerOpen && <LanguagePicker />}
    </div>
  )
}

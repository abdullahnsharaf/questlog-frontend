import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

function useInView(threshold = 0.1) {
  const ref = useRef()
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

const featureIcons = ['🎮', '⭐', '👥', '📡', '🎯', '🔍']

function FeatureCard({ icon, title, desc, index }) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={`card p-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Orbitron' }}>{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function ContactSection({ t }) {
  const [ref, inView] = useInView()
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setSent(true)
    setLoading(false)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section id="contact" className="py-24 px-4 relative">
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />
      <div
        ref={ref}
        className={`max-w-6xl mx-auto transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4" style={{ fontFamily: 'Orbitron' }}>
            {t.contact.title}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">{t.contact.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {[
              { icon: '📧', label: t.contact.info.email },
              { icon: '⚡', label: t.contact.info.response },
              { icon: '🛡️', label: t.contact.info.support },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <span className="text-gray-300">{item.label}</span>
              </div>
            ))}

            <div className="mt-8 p-6 card">
              <p className="text-gray-400 text-sm leading-relaxed">
                We are a small team passionate about gaming. Your feedback directly shapes QuestLog. Every message is read personally.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="card p-8 space-y-5">
            {sent && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-center">
                ✅ {t.contact.success}
              </div>
            )}
            <div>
              <label className="block text-gray-400 text-sm mb-2">{t.contact.name}</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
                className="w-full bg-dark-200 border border-indigo-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                placeholder={t.contact.name}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">{t.contact.email}</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                className="w-full bg-dark-200 border border-indigo-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                placeholder={t.contact.email}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">{t.contact.message}</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => setForm({...form, message: e.target.value})}
                required
                className="w-full bg-dark-200 border border-indigo-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                placeholder={t.contact.message}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Sending...
                </>
              ) : t.contact.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer({ t }) {
  return (
    <footer className="border-t border-indigo-500/10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs" style={{ fontFamily: 'Orbitron' }}>Q</span>
              </div>
              <span className="font-bold gradient-text" style={{ fontFamily: 'Orbitron' }}>QuestLog</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">{t.footer.tagline}</p>
            <p className="text-gray-600 text-xs">{t.footer.poweredBy}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t.footer.links.product}</h4>
            <ul className="space-y-2">
              {['Search Games', 'My Library', 'Friends', 'Activity Feed'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-indigo-400 transition text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t.footer.links.company}</h4>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Press'].map(item => (
                <li key={item}>
                  <a href="#" className="text-gray-500 hover:text-indigo-400 transition text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">{t.footer.links.legal}</h4>
            <ul className="space-y-2">
              {[
                { key: 'privacy', label: t.footer.legal.privacy },
                { key: 'terms',   label: t.footer.legal.terms },
                { key: 'cookies', label: t.footer.legal.cookies },
                { key: 'disclaimer', label: t.footer.legal.disclaimer },
              ].map(item => (
                <li key={item.key}>
                  <a href="#" className="text-gray-500 hover:text-indigo-400 transition text-sm">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-indigo-500/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">{t.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <p className="text-gray-600 text-xs">
              Game data provided by{' '}
              <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                RAWG.io
              </a>
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-dark-100 border border-indigo-500/10">
          <p className="text-gray-600 text-xs leading-relaxed text-center">
            QuestLog is an independent project not affiliated with any game publisher or developer.
            All game data, images, and metadata are provided by RAWG.io and belong to their respective owners.
            Metacritic scores are sourced from RAWG API and are the property of Fandom, Inc.
            QuestLog does not claim ownership of any third-party content displayed on this platform.
            By using QuestLog you agree to our Terms of Service and Privacy Policy.
            This service is provided "as is" without warranty of any kind.
            © 2026 QuestLog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const { t } = useLanguage()
  const [heroRef, heroInView] = useInView(0.1)
  const [featRef, featInView] = useInView(0.1)
  const [typeIndex, setTypeIndex] = useState(0)

  const taglines = [
    'Track Every Game You Play',
    'Share With Your Friends',
    'Discover Your Next Quest',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTypeIndex(i => (i + 1) % taglines.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">

        {/* Background Effects */}
        <div className="absolute inset-0 cyber-grid-bg" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-3xl" />

        <div
          ref={heroRef}
          className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-indigo-300 mb-8 border border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {t.hero.badge}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: 'Orbitron' }}>
            <span className="text-white">{t.hero.title} </span>
            <span className="gradient-text neon-text">{t.hero.titleAccent}</span>
          </h1>

          {/* Rotating Tagline */}
          <div className="h-8 mb-6 overflow-hidden">
            <p
              key={typeIndex}
              className="text-cyan-400 text-lg font-medium neon-text-cyan"
              style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}
            >
              {taglines[typeIndex]}
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register" className="btn-primary text-base py-4 px-8 inline-block">
              {t.hero.cta} →
            </Link>
            <a href="#features" className="btn-outline text-base py-4 px-8 inline-block">
              {t.hero.ctaSecondary}
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {[
              { value: t.hero.stats.games,    icon: '🎮' },
              { value: t.hero.stats.users,    icon: '✨' },
              { value: t.hero.stats.platforms, icon: '🖥️' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-300">
                <span className="text-xl">{stat.icon}</span>
                <span className="font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
          <span className="text-xs">Scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 relative">
        <div
          ref={featRef}
          className={`max-w-7xl mx-auto transition-all duration-700 ${featInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4" style={{ fontFamily: 'Orbitron' }}>
              {t.features.title}
            </h2>
            <p className="text-gray-400">{t.features.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map((item, i) => (
              <FeatureCard
                key={i}
                icon={featureIcons[i]}
                title={item.title}
                desc={item.desc}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron' }}>
                Ready to Start Your Quest?
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join gamers tracking their journey with QuestLog. Free forever.
              </p>
              <Link to="/register" className="btn-primary text-base py-4 px-10 inline-block">
                Create Free Account →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection t={t} />

      {/* Footer */}
      <Footer t={t} />
    </div>
  )
}
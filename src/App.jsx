import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import { articles, doshaResults, navItems, practitioners, quizQuestions, testimonials, therapies } from './data'
import {
  bookingKey,
  canChangeAppointment,
  favouritesKey,
  formatPrice,
  getSlots,
  isSlotTaken,
  journalKey,
  makeReference,
  quizKey,
  readStorage,
  recentKey,
  todayIso,
  writeStorage,
} from './storage'
import heroImage from './assets/lotus-ayurveda-hero.png'
import './App.css'

function useLocalStore(key, fallback) {
  const [value, setValue] = useState(() => readStorage(key, fallback))
  function update(nextValue) {
    const resolved = typeof nextValue === 'function' ? nextValue(value) : nextValue
    setValue(resolved)
    writeStorage(key, resolved)
  }
  return [value, update]
}

function Logo({ compact = false }) {
  return (
    <Link className={compact ? 'brand compact' : 'brand'} to="/" aria-label="Lotus Ayurveda Spa home">
      <span className="lotus-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path className="petal petal-main" d="M32 37C24 29 25 19 32 11C39 19 40 29 32 37Z" />
          <path className="petal petal-left" d="M32 39C21 38 14 30 15 19C26 21 32 29 32 39Z" />
          <path className="petal petal-right" d="M32 39C43 38 50 30 49 19C38 21 32 29 32 39Z" />
          <path className="petal petal-low-left" d="M32 43C24 45 16 42 11 34C21 31 29 34 32 43Z" />
          <path className="petal petal-low-right" d="M32 43C40 45 48 42 53 34C43 31 35 34 32 43Z" />
          <path className="lotus-bowl" d="M17 49C26 53 38 53 47 49" />
        </svg>
      </span>
      {!compact && (
        <span>
          <strong>Lotus Ayurveda Spa</strong>
          <small>Ayurvedic wellness rituals</small>
        </span>
      )}
    </Link>
  )
}

function Shell({ children, favourites, appointments }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className="site-shell">
      <header className="nav-shell">
        <Logo />
        <button className="icon-button mobile-toggle" type="button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={open ? 'open' : ''} aria-label="Main navigation">
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === '/'} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/appointments" onClick={() => setOpen(false)}>Appointments</NavLink>
          <NavLink to="/saved" onClick={() => setOpen(false)}>Saved <span>{favourites.length}</span></NavLink>
        </nav>
      </header>
      <main className="page-transition" key={location.pathname}>{children}</main>
      <Footer appointments={appointments} />
      <Link className="mobile-booking-cta" to="/book">Book</Link>
      <button className="back-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

function Footer({ appointments }) {
  return (
    <footer>
      <div className="footer-brand">
        <Logo compact />
        <strong>Lotus Ayurveda Spa</strong>
        <p>Quiet Ayurvedic-inspired rituals for restoration, warmth, and thoughtful care.</p>
      </div>
      <div>
        <strong>Contact</strong>
        <p><Mail size={15} /> hello@lotusayurveda.example</p>
        <p><Phone size={15} /> +91 90000 00000</p>
        <p><MapPin size={15} /> Sample wellness district, Bengaluru</p>
      </div>
      <div>
        <strong>Hours</strong>
        <p>Mon-Fri: 9:30 AM - 7:00 PM</p>
        <p>Sat-Sun: 10:00 AM - 4:00 PM</p>
        <p>{appointments.filter((item) => item.status !== 'cancelled').length} locally saved appointment(s)</p>
      </div>
      <div>
        <strong>Explore</strong>
        <Link to="/therapies">Therapies</Link>
        <Link to="/dosha-quiz">Dosha Quiz</Link>
        <Link to="/journal">Journal</Link>
      </div>
    </footer>
  )
}

function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item) => (
        item.to ? <Link key={item.label} to={item.to}>{item.label}</Link> : <span key={item.label}>{item.label}</span>
      ))}
    </nav>
  )
}

function Reveal({ children, className = '' }) {
  const [visible, setVisible] = useState(false)
  const [node, setNode] = useState(null)
  useEffect(() => {
    if (!node) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])
  return <div ref={setNode} className={`reveal ${visible ? 'visible' : ''} ${className}`}>{children}</div>
}

function TherapyCard({ therapy, favourites, toggleFavourite, onView }) {
  return (
    <article className="therapy-card">
      <Link className="therapy-image" to={`/therapies/${therapy.id}`} onClick={() => onView?.(therapy.id)}>
        <img src={therapy.image} alt={`${therapy.name} treatment setting`} />
        <span>{therapy.category}</span>
      </Link>
      <div className="therapy-card-body">
        <div>
          <p className="kicker">{therapy.tone}</p>
          <h3><Link to={`/therapies/${therapy.id}`} onClick={() => onView?.(therapy.id)}>{therapy.name}</Link></h3>
          <p>{therapy.short}</p>
        </div>
        <div className="meta-row">
          <span><Clock size={15} /> {therapy.duration} min</span>
          <span>{formatPrice(therapy.price)}</span>
        </div>
        <div className="card-actions">
          <Link className="secondary-action" to={`/therapies/${therapy.id}`}>Details</Link>
          <Link className="primary-action" to={`/book?treatment=${therapy.id}`}>Book</Link>
          <button
            className={favourites.includes(therapy.id) ? 'icon-button saved' : 'icon-button'}
            type="button"
            onClick={() => toggleFavourite(therapy.id)}
            aria-label={`${favourites.includes(therapy.id) ? 'Remove' : 'Save'} ${therapy.name}`}
          >
            <Heart size={18} fill={favourites.includes(therapy.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  )
}

function HomePage({ favourites, toggleFavourite, addRecent }) {
  const featured = therapies.filter((therapy) => therapy.featured)
  return (
    <>
      <section className="hero-section">
        <img src={heroImage} alt="Ayurvedic spa room with herbs, brass oils, and warm natural light" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="botanical-line" aria-hidden="true" />
        <div className="hero-content">
          <p className="kicker">Rooted in Ayurveda - held with modern calm</p>
          <h1>Find Your Balance. Return to Yourself.</h1>
          <p>
            Slow rituals, warm botanical oils, and attentive guidance for guests seeking a quieter
            way back into their body.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" to="/dosha-quiz">Discover Your Dosha <ArrowRight size={18} /></Link>
            <Link className="secondary-action" to="/therapies">Explore Therapies</Link>
          </div>
        </div>
      </section>
      <Reveal className="intro-band">
        <div><span>06</span><p>Ayurvedic-inspired rituals</p></div>
        <div><span>03</span><p>Dosha-informed recommendation paths</p></div>
        <div><span>24h</span><p>Change window for saved appointments</p></div>
      </Reveal>
      <section className="section split-section">
        <Reveal>
          <p className="kicker">The Lotus rhythm</p>
          <h2>Care that begins with listening.</h2>
          <p>
            The experience is built around mood, pace, and comfort. Choose a ritual by what you
            want to feel: grounded, cooled, clarified, or gently restored.
          </p>
          <Link className="text-link" to="/about">Read our philosophy <ArrowRight size={16} /></Link>
        </Reveal>
        <Reveal className="journey-panel">
          {['Arrive softly', 'Choose by feeling', 'Settle into ritual', 'Leave unhurried'].map((step, index) => (
            <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>
          ))}
        </Reveal>
      </section>
      <section className="section">
        <Reveal className="section-heading">
          <p className="kicker">Featured treatments</p>
          <h2>Rituals with a clear point of view.</h2>
        </Reveal>
        <div className="card-grid">
          {featured.map((therapy) => (
            <TherapyCard key={therapy.id} therapy={therapy} favourites={favourites} toggleFavourite={toggleFavourite} onView={addRecent} />
          ))}
        </div>
      </section>
      <section className="section quiz-teaser">
        <Reveal>
          <Sparkles size={34} />
          <h2>Not sure where to begin?</h2>
          <p>Take a short educational dosha quiz and receive therapy suggestions based on your answers.</p>
          <Link className="primary-action" to="/dosha-quiz">Start the Quiz</Link>
        </Reveal>
      </section>
      <section className="section testimonial-section">
        {testimonials.map((item) => (
          <Reveal as="article" className="testimonial" key={item.name}>
            <p>"{item.quote}"</p>
            <strong>{item.name}</strong>
          </Reveal>
        ))}
      </section>
      <section className="section journal-preview">
        <Reveal className="section-heading">
          <p className="kicker">Wellness journal</p>
          <h2>Short notes for slower living.</h2>
        </Reveal>
        <div className="article-grid">
          {articles.slice(0, 3).map((article) => <ArticleCard article={article} key={article.id} />)}
        </div>
      </section>
      <BookingCta />
    </>
  )
}

function TherapiesPage({ favourites, toggleFavourite, addRecent, recent }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('featured')
  const [maxPrice, setMaxPrice] = useState('all')
  const categories = ['All', ...new Set(therapies.map((therapy) => therapy.category))]
  const filtered = useMemo(() => {
    const list = therapies.filter((therapy) => {
      const matchesQuery = `${therapy.name} ${therapy.short} ${therapy.category}`.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || therapy.category === category
      const matchesPrice = maxPrice === 'all' || therapy.price <= Number(maxPrice)
      return matchesQuery && matchesCategory && matchesPrice
    })
    return [...list].sort((a, b) => {
      if (sort === 'price') return a.price - b.price
      if (sort === 'duration') return a.duration - b.duration
      if (sort === 'name') return a.name.localeCompare(b.name)
      return Number(b.featured) - Number(a.featured)
    })
  }, [category, maxPrice, query, sort])

  return (
    <section className="section page-section">
      <Breadcrumbs items={[{ label: 'Therapies' }]} />
      <PageHeader kicker="Therapy catalogue" title="Browse by ritual, feeling, and practical fit." text="Search, sort, save favourites, and open detailed treatment pages with preparation and aftercare guidance." />
      <div className="catalogue-tools">
        <label><Search size={18} /> Search<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Oil, steam, grounding..." /></label>
        <label><SlidersHorizontal size={18} /> Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Price<select value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}><option value="all">Any price</option><option value="2500">Under INR 2,500</option><option value="3500">Under INR 3,500</option><option value="4500">Under INR 4,500</option></select></label>
        <label>Sort<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured first</option><option value="price">Lowest price</option><option value="duration">Shortest duration</option><option value="name">A-Z</option></select></label>
      </div>
      <ActiveFilters query={query} category={category} maxPrice={maxPrice} clear={() => { setQuery(''); setCategory('All'); setMaxPrice('all') }} />
      {filtered.length ? (
        <div className="card-grid catalogue-grid">
          {filtered.map((therapy) => <TherapyCard key={therapy.id} therapy={therapy} favourites={favourites} toggleFavourite={toggleFavourite} onView={addRecent} />)}
        </div>
      ) : <EmptyState title="No therapies found" text="Try clearing filters or searching by a feeling such as grounding, cooling, or clarity." />}
      {recent.length > 0 && <RecentTreatments recent={recent} />}
    </section>
  )
}

function ActiveFilters({ query, category, maxPrice, clear }) {
  if (!query && category === 'All' && maxPrice === 'all') return null
  return (
    <div className="active-filters">
      {query && <span>Search: {query}</span>}
      {category !== 'All' && <span>{category}</span>}
      {maxPrice !== 'all' && <span>Up to {formatPrice(Number(maxPrice))}</span>}
      <button type="button" onClick={clear}>Clear filters</button>
    </div>
  )
}

function RecentTreatments({ recent }) {
  const items = recent.map((id) => therapies.find((therapy) => therapy.id === id)).filter(Boolean).slice(0, 4)
  return (
    <aside className="recent-strip">
      <strong>Recently viewed</strong>
      {items.map((therapy) => <Link key={therapy.id} to={`/therapies/${therapy.id}`}>{therapy.name}</Link>)}
    </aside>
  )
}

function TherapyDetailsPage({ favourites, toggleFavourite, addRecent }) {
  const { id } = useParams()
  const therapy = therapies.find((item) => item.id === id)
  useEffect(() => {
    if (therapy) addRecent(therapy.id)
  }, [addRecent, therapy])
  if (!therapy) return <NotFoundPage />
  const related = therapy.related.map((relatedId) => therapies.find((item) => item.id === relatedId)).filter(Boolean)
  return (
    <section className="detail-page">
      <div className="detail-hero">
        <img src={therapy.image} alt={`${therapy.name} ritual`} />
        <div>
          <Breadcrumbs items={[{ label: 'Therapies', to: '/therapies' }, { label: therapy.name }]} />
          <p className="kicker">{therapy.category}</p>
          <h1>{therapy.name}</h1>
          <p>{therapy.description}</p>
          <div className="meta-row"><span><Clock size={16} /> {therapy.duration} min</span><span>{formatPrice(therapy.price)}</span><span>{therapy.tone}</span></div>
          <div className="hero-actions">
            <Link className="primary-action" to={`/book?treatment=${therapy.id}`}>Book {therapy.name}</Link>
            <button className="secondary-action" type="button" onClick={() => toggleFavourite(therapy.id)}>
              <Heart size={18} fill={favourites.includes(therapy.id) ? 'currentColor' : 'none'} /> {favourites.includes(therapy.id) ? 'Saved' : 'Save treatment'}
            </button>
          </div>
        </div>
      </div>
      <section className="section detail-content">
        <article><h2>General wellness notes</h2><p>{therapy.short}</p><div className="tag-row">{therapy.benefits.map((item) => <span key={item}>{item}</span>)}</div></article>
        <article><h2>Preparation</h2><p>{therapy.preparation}</p></article>
        <article><h2>Aftercare</h2><p>{therapy.aftercare}</p></article>
      </section>
      <section className="section">
        <PageHeader kicker="Related rituals" title="Continue exploring with similar treatments." />
        <div className="card-grid">{related.map((item) => <TherapyCard key={item.id} therapy={item} favourites={favourites} toggleFavourite={toggleFavourite} onView={addRecent} />)}</div>
      </section>
    </section>
  )
}

function QuizPage({ addToast }) {
  const navigate = useNavigate()
  const [state, setState] = useState(() => readStorage(quizKey, { index: 0, answers: {}, complete: false }))
  const question = quizQuestions[state.index]
  const result = useMemo(() => {
    const totals = { Vata: 0, Pitta: 0, Kapha: 0 }
    Object.values(state.answers).forEach((dosha) => { totals[dosha] += 1 })
    const high = Math.max(...Object.values(totals))
    const winners = Object.entries(totals).filter(([, value]) => value === high).map(([key]) => key)
    const dominant = winners[0] || 'Vata'
    return { totals, dominant, tied: winners.length > 1, recommendations: therapies.filter((therapy) => therapy.doshas.includes(dominant)).slice(0, 3) }
  }, [state.answers])
  function update(next) {
    setState(next)
    writeStorage(quizKey, next)
  }
  function select(dosha) {
    update({ ...state, answers: { ...state.answers, [state.index]: dosha } })
  }
  function next() {
    if (state.index === quizQuestions.length - 1) update({ ...state, complete: true })
    else update({ ...state, index: state.index + 1 })
  }
  function reset() {
    const fresh = { index: 0, answers: {}, complete: false }
    update(fresh)
    addToast('Quiz restarted.')
  }
  return (
    <section className="section page-section quiz-page">
      <Breadcrumbs items={[{ label: 'Dosha Quiz' }]} />
      <PageHeader kicker="Dosha quiz" title="A reflective check-in with personalized recommendations." text="This quiz offers general Ayurvedic wellness guidance and is not a diagnosis or medical assessment." />
      <div className="quiz-panel">
        {!state.complete ? (
          <>
            <div className="quiz-topline"><span>Question {state.index + 1} of {quizQuestions.length}</span><div className="progress-track"><span style={{ width: `${((state.index + 1) / quizQuestions.length) * 100}%` }} /></div></div>
            <h2>{question.prompt}</h2>
            <div className="choice-grid" role="radiogroup" aria-label="Dosha answer choices">
              {question.choices.map((choice) => <button key={choice.label} type="button" role="radio" aria-checked={state.answers[state.index] === choice.dosha} className={state.answers[state.index] === choice.dosha ? 'selected' : ''} onClick={() => select(choice.dosha)}><span>{choice.dosha}</span>{choice.label}</button>)}
            </div>
            <div className="quiz-actions">
              <button className="secondary-action" type="button" disabled={state.index === 0} onClick={() => update({ ...state, index: state.index - 1 })}><ChevronLeft size={18} /> Back</button>
              <button className="primary-action" type="button" disabled={!state.answers[state.index]} onClick={next}>{state.index === quizQuestions.length - 1 ? 'Reveal Result' : 'Next'} <ChevronRight size={18} /></button>
            </div>
          </>
        ) : (
          <div className="result-panel" style={{ '--result-color': doshaResults[result.dominant].color }}>
            <div className="result-orb"><Sparkles size={36} /></div>
            <div><p className="kicker">{result.tied ? 'Balanced signals' : 'Your result'}</p><h2>{doshaResults[result.dominant].title}</h2><p>{doshaResults[result.dominant].description}</p><div className="score-row">{Object.entries(result.totals).map(([dosha, total]) => <span key={dosha}>{dosha}: {total}</span>)}</div></div>
            <div className="recommendations">{result.recommendations.map((therapy) => <article key={therapy.id}><strong>{therapy.name}</strong><p>{therapy.short}</p><button type="button" onClick={() => navigate(`/book?treatment=${therapy.id}`)}>Book recommendation</button></article>)}</div>
            <button className="secondary-action" type="button" onClick={reset}>Retake quiz</button>
          </div>
        )}
      </div>
    </section>
  )
}

function BookingPage({ appointments, setAppointments, addToast }) {
  const params = new URLSearchParams(useLocation().search)
  const preselected = params.get('treatment')
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [booking, setBooking] = useState({
    therapyId: therapies.some((therapy) => therapy.id === preselected) ? preselected : therapies[0].id,
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const therapy = therapies.find((item) => item.id === booking.therapyId) || therapies[0]
  const availableSlots = getSlots(booking.date).filter((slot) => !isSlotTaken(appointments, booking.date, slot))
  function update(field, value) {
    setBooking((current) => ({ ...current, [field]: value, ...(field === 'date' ? { time: '' } : {}) }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }
  function validateCurrent() {
    const next = {}
    if (step === 1 && (!booking.date || booking.date < todayIso())) next.date = 'Choose today or a future date.'
    if (step === 2 && !booking.time) next.time = 'Choose an available time.'
    if (step === 3) {
      if (!booking.name.trim()) next.name = 'Enter your full name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email)) next.email = 'Enter a valid email.'
      if (!/^[0-9+\-\s()]{8,16}$/.test(booking.phone)) next.phone = 'Enter a valid phone number.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }
  function goNext() {
    if (validateCurrent()) setStep((value) => Math.min(4, value + 1))
  }
  function confirm() {
    const entry = { ...booking, reference: makeReference(), status: 'confirmed', createdAt: new Date().toISOString(), therapyName: therapy.name, price: therapy.price, duration: therapy.duration }
    setAppointments([entry, ...appointments])
    setConfirmedBooking(entry)
    setStep(5)
    addToast(`Appointment ${entry.reference} confirmed locally.`)
  }
  return (
    <section className="section page-section booking-page">
      <Breadcrumbs items={[{ label: 'Book Appointment' }]} />
      <PageHeader kicker="Appointment booking" title="Reserve a ritual in six calm steps." text="Your booking is stored locally in this browser. No payment or external message is sent." />
      <div className="booking-shell">
        <StepRail step={step} />
        <div className="booking-step">
          {step === 0 && <TreatmentStep value={booking.therapyId} onChange={(value) => update('therapyId', value)} />}
          {step === 1 && <DateStep date={booking.date} update={update} error={errors.date} />}
          {step === 2 && <TimeStep slots={availableSlots} value={booking.time} update={update} error={errors.time} />}
          {step === 3 && <CustomerStep booking={booking} update={update} errors={errors} />}
          {step === 4 && <ReviewStep booking={booking} therapy={therapy} />}
          {step === 5 && <ConfirmationStep booking={confirmedBooking} />}
          {step < 5 && <div className="wizard-actions"><button className="secondary-action" type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>{step < 4 ? <button className="primary-action" type="button" onClick={goNext}>Continue</button> : <button className="primary-action" type="button" onClick={confirm}>Confirm appointment</button>}</div>}
        </div>
        <BookingSummary booking={booking} therapy={therapy} />
      </div>
    </section>
  )
}

function StepRail({ step }) {
  return <ol className="step-rail">{['Treatment', 'Date', 'Time', 'Details', 'Review', 'Confirm'].map((item, index) => <li className={index <= step ? 'active' : ''} key={item}>{item}</li>)}</ol>
}

function TreatmentStep({ value, onChange }) {
  return <div><h2>Select treatment</h2><div className="select-list">{therapies.map((therapy) => <button className={value === therapy.id ? 'selected' : ''} type="button" key={therapy.id} onClick={() => onChange(therapy.id)}><strong>{therapy.name}</strong><span>{therapy.duration} min - {formatPrice(therapy.price)}</span></button>)}</div></div>
}

function DateStep({ date, update, error }) {
  return <div><h2>Choose a date</h2><label>Appointment date<input type="date" min={todayIso()} value={date} onInput={(event) => update('date', event.target.value)} onChange={(event) => update('date', event.target.value)} /></label>{error && <p className="field-error">{error}</p>}</div>
}

function TimeStep({ slots, value, update, error }) {
  return <div><h2>Select time</h2>{slots.length ? <div className="time-grid">{slots.map((slot) => <button className={value === slot ? 'selected' : ''} type="button" key={slot} onClick={() => update('time', slot)}>{slot}</button>)}</div> : <EmptyState title="No available times" text="Choose another date or manage an existing booking to free this slot." />}{error && <p className="field-error">{error}</p>}</div>
}

function CustomerStep({ booking, update, errors }) {
  return <div><h2>Your details</h2><div className="form-grid"><label>Full name<input value={booking.name} onChange={(event) => update('name', event.target.value)} autoComplete="name" />{errors.name && <small>{errors.name}</small>}</label><label>Email<input type="email" value={booking.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" />{errors.email && <small>{errors.email}</small>}</label><label>Phone<input value={booking.phone} onChange={(event) => update('phone', event.target.value)} autoComplete="tel" />{errors.phone && <small>{errors.phone}</small>}</label><label className="wide">Optional message<textarea rows="4" value={booking.message} onChange={(event) => update('message', event.target.value)} /></label></div></div>
}

function ReviewStep({ booking, therapy }) {
  return <div><h2>Review booking</h2><dl className="summary-list"><div><dt>Treatment</dt><dd>{therapy.name}</dd></div><div><dt>Date</dt><dd>{booking.date}</dd></div><div><dt>Time</dt><dd>{booking.time}</dd></div><div><dt>Guest</dt><dd>{booking.name}</dd></div><div><dt>Price</dt><dd>{formatPrice(therapy.price)}</dd></div></dl></div>
}

function ConfirmationStep({ booking }) {
  return <div className="confirmation"><div className="success-mark"><Check size={34} /></div><h2>Appointment confirmed</h2><p>Reference: <strong>{booking?.reference}</strong></p><p>Keep this reference with your email or phone number to manage the booking.</p><Link className="primary-action" to="/appointments">Manage appointment</Link></div>
}

function BookingSummary({ booking, therapy }) {
  return <aside className="booking-aside"><p className="kicker">Summary</p><h3>{therapy.name}</h3><p>{therapy.short}</p><div className="mini-facts"><span><Clock size={16} /> {therapy.duration} min</span><span>{formatPrice(therapy.price)}</span></div><p>{booking.date || 'Date pending'} {booking.time ? `at ${booking.time}` : ''}</p></aside>
}

function AppointmentsPage({ appointments, setAppointments, addToast }) {
  const [lookup, setLookup] = useState({ reference: '', detail: '' })
  const found = appointments.find((booking) => booking.reference.toLowerCase() === lookup.reference.trim().toLowerCase() && [booking.email, booking.phone].includes(lookup.detail.trim()))
  function cancel(reference) {
    setAppointments(appointments.map((booking) => booking.reference === reference ? { ...booking, status: 'cancelled' } : booking))
    addToast('Appointment cancelled.')
  }
  function reschedule(reference) {
    const nextDate = prompt('Enter a new future date in YYYY-MM-DD format')
    const nextTime = prompt('Enter an available time, for example 10:00 AM')
    if (!nextDate || !nextTime || nextDate < todayIso() || !getSlots(nextDate).includes(nextTime) || isSlotTaken(appointments, nextDate, nextTime, reference)) {
      addToast('That reschedule option is not available.')
      return
    }
    setAppointments(appointments.map((booking) => booking.reference === reference ? { ...booking, date: nextDate, time: nextTime } : booking))
    addToast('Appointment rescheduled.')
  }
  return (
    <section className="section page-section">
      <Breadcrumbs items={[{ label: 'My Appointments' }]} />
      <PageHeader kicker="My appointments" title="Look up, cancel, or reschedule locally saved bookings." text="Use your reference plus the email or phone number used at booking." />
      <div className="lookup-panel"><label>Booking reference<input value={lookup.reference} onChange={(event) => setLookup({ ...lookup, reference: event.target.value })} placeholder="LOTUS-ABCD-1234" /></label><label>Email or phone<input value={lookup.detail} onChange={(event) => setLookup({ ...lookup, detail: event.target.value })} /></label></div>
      {lookup.reference && lookup.detail && !found && <EmptyState title="No matching appointment" text="Check the reference and matching customer detail." />}
      {found && <AppointmentRecord booking={found} cancel={cancel} reschedule={reschedule} />}
    </section>
  )
}

function AppointmentRecord({ booking, cancel, reschedule }) {
  const changeAllowed = canChangeAppointment(booking)
  return <article className="record-card"><p className="kicker">{booking.status}</p><h2>{booking.therapyName}</h2><p>{booking.date} at {booking.time}</p><p>Reference: <strong>{booking.reference}</strong></p><div className="hero-actions"><button className="secondary-action" type="button" disabled={!changeAllowed} onClick={() => reschedule(booking.reference)}>Reschedule</button><button className="secondary-action danger" type="button" disabled={!changeAllowed} onClick={() => cancel(booking.reference)}>Cancel</button></div>{!changeAllowed && <p className="field-error">Changes are available until 24 hours before the appointment.</p>}</article>
}

function AboutPage() {
  return (
    <section className="section page-section">
      <Breadcrumbs items={[{ label: 'About Us' }]} />
      <PageHeader kicker="About Lotus" title="A quiet wellness brand shaped by attention." text="Lotus Ayurveda Spa pairs traditional Ayurvedic inspiration with contemporary hospitality, honest guidance, and careful pacing." />
      <div className="principles">{['Mindful care', 'Traditional inspiration', 'Personalized pacing'].map((title) => <article key={title}><Leaf size={24} /><h3>{title}</h3><p>Every ritual is framed as a supportive wellness experience, guided by guest comfort and clear boundaries.</p></article>)}</div>
      <h2 className="section-subtitle">Practitioner profiles</h2>
      <div className="card-grid profile-grid">{practitioners.map(([name, role, bio]) => <article className="profile-card" key={name}><div>{name.split(' ').map((part) => part[0]).join('')}</div><h3>{name}</h3><p className="kicker">{role}</p><p>{bio}</p></article>)}</div>
    </section>
  )
}

function JournalPage({ savedArticles, toggleArticle }) {
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(articles.map((article) => article.category))]
  const visible = category === 'All' ? articles : articles.filter((article) => article.category === category)
  return (
    <section className="section page-section">
      <Breadcrumbs items={[{ label: 'Wellness Journal' }]} />
      <PageHeader kicker="Wellness journal" title="Short editorial notes for thoughtful care." />
      <div className="tab-row">{categories.map((item) => <button className={category === item ? 'active' : ''} type="button" key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="article-grid">{visible.map((article) => <ArticleCard key={article.id} article={article} saved={savedArticles.includes(article.id)} toggleArticle={toggleArticle} />)}</div>
    </section>
  )
}

function ArticleDetailsPage({ savedArticles, toggleArticle }) {
  const { id } = useParams()
  const article = articles.find((item) => item.id === id)
  if (!article) return <NotFoundPage />
  const related = articles.filter((item) => item.id !== id).slice(0, 2)
  return (
    <section className="section page-section article-detail">
      <Breadcrumbs items={[{ label: 'Journal', to: '/journal' }, { label: article.title }]} />
      <p className="kicker">{article.category} - {article.readTime}</p>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <button className="secondary-action" type="button" onClick={() => toggleArticle(article.id)}><Bookmark size={18} fill={savedArticles.includes(article.id) ? 'currentColor' : 'none'} /> {savedArticles.includes(article.id) ? 'Saved' : 'Save article'}</button>
      <h2>Related articles</h2>
      <div className="article-grid">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div>
    </section>
  )
}

function ArticleCard({ article, saved = false, toggleArticle }) {
  return <article className="article-card"><p className="kicker">{article.category} - {article.readTime}</p><h3><Link to={`/journal/${article.id}`}>{article.title}</Link></h3><p>{article.excerpt}</p><div className="card-actions"><Link className="text-link" to={`/journal/${article.id}`}>Read article <ArrowRight size={15} /></Link>{toggleArticle && <button className="icon-button" type="button" onClick={() => toggleArticle(article.id)} aria-label="Save article"><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button>}</div></article>
}

function SavedPage({ favourites, toggleFavourite, savedArticles, toggleArticle }) {
  const savedTherapies = therapies.filter((therapy) => favourites.includes(therapy.id))
  const savedJournal = articles.filter((article) => savedArticles.includes(article.id))
  return (
    <section className="section page-section">
      <Breadcrumbs items={[{ label: 'Saved Treatments' }]} />
      <PageHeader kicker="Saved" title="Your remembered treatments and articles." />
      {savedTherapies.length ? <div className="card-grid">{savedTherapies.map((therapy) => <TherapyCard key={therapy.id} therapy={therapy} favourites={favourites} toggleFavourite={toggleFavourite} />)}</div> : <EmptyState title="No saved treatments yet" text="Save rituals from the therapy catalogue for quick access." action={<Link className="primary-action" to="/therapies">Explore therapies</Link>} />}
      <h2 className="section-subtitle">Saved articles</h2>
      {savedJournal.length ? <div className="article-grid">{savedJournal.map((article) => <ArticleCard key={article.id} article={article} saved toggleArticle={toggleArticle} />)}</div> : <p className="muted">Saved articles will appear here.</p>}
    </section>
  )
}

function ContactPage({ addToast }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [newsletter, setNewsletter] = useState('')
  const [openFaq, setOpenFaq] = useState(0)
  function submit(event) {
    event.preventDefault()
    if (!form.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.message) {
      addToast('Please complete the contact form.')
      return
    }
    setForm({ name: '', email: '', message: '' })
    addToast('Message saved locally for this visit.')
  }
  function subscribe(event) {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletter)) {
      addToast('Enter a valid email for the newsletter.')
      return
    }
    setNewsletter('')
    addToast('Newsletter preference saved locally.')
  }
  const faqs = [
    ['Do I need to prepare before treatment?', 'Most guests simply arrive hydrated and unhurried. Specific preparation appears on treatment pages.'],
    ['Is the dosha quiz medical advice?', 'No. It is educational wellness guidance and not a diagnosis.'],
    ['Can I change my booking?', 'Local bookings can be changed until 24 hours before the appointment date.'],
  ]
  return (
    <section className="section page-section contact-page">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />
      <PageHeader kicker="Contact" title="Questions, comfort notes, and visit planning." />
      <div className="contact-grid">
        <form className="booking-form" onSubmit={submit}><label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label className="wide">Message<textarea rows="5" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label><button className="primary-action wide" type="submit"><Send size={18} /> Send message</button></form>
        <aside className="booking-aside"><h3>Visit information</h3><p><MapPin size={15} /> Sample wellness district, Bengaluru</p><p><Phone size={15} /> +91 90000 00000</p><p><Mail size={15} /> hello@lotusayurveda.example</p><form onSubmit={subscribe}><label>Newsletter<input value={newsletter} onChange={(event) => setNewsletter(event.target.value)} placeholder="you@example.com" /></label><button className="secondary-action" type="submit">Save preference</button></form></aside>
      </div>
      <div className="faq-list">{faqs.map(([q, a], index) => <article key={q}><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>{q}<ChevronRight size={18} /></button>{openFaq === index && <p>{a}</p>}</article>)}</div>
    </section>
  )
}

function PageHeader({ kicker, title, text }) {
  return <Reveal className="section-heading"><p className="kicker">{kicker}</p><h1>{title}</h1>{text && <p>{text}</p>}</Reveal>
}

function BookingCta() {
  return <section className="section booking-cta"><Reveal><p className="kicker">Appointments</p><h2>Choose a ritual, then let the pace slow down.</h2><Link className="primary-action" to="/book">Book Appointment</Link></Reveal></section>
}

function EmptyState({ title, text, action }) {
  return <div className="empty-state"><Leaf size={28} /><h3>{title}</h3><p>{text}</p>{action}</div>
}

function NotFoundPage() {
  return <section className="section page-section"><PageHeader kicker="Not found" title="This page has drifted out of the treatment room." text="Use the navigation to return to a working part of the site." /><Link className="primary-action" to="/">Return home</Link></section>
}

function Toasts({ toasts }) {
  return <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <div className="toast" key={toast.id}>{toast.message}</div>)}</div>
}

function App() {
  const [favourites, setFavourites] = useLocalStore(favouritesKey, [])
  const [savedArticles, setSavedArticles] = useLocalStore(journalKey, [])
  const [recent, setRecent] = useLocalStore(recentKey, [])
  const [appointments, setAppointments] = useLocalStore(bookingKey, [])
  const [toasts, setToasts] = useState([])

  function addToast(message) {
    const toast = { id: crypto.randomUUID(), message }
    setToasts((items) => [...items, toast])
    setTimeout(() => setToasts((items) => items.filter((item) => item.id !== toast.id)), 3200)
  }

  function toggleFavourite(id) {
    setFavourites((items) => {
      const next = items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
      addToast(next.includes(id) ? 'Treatment saved.' : 'Treatment removed.')
      return next
    })
  }

  function toggleArticle(id) {
    setSavedArticles((items) => {
      const next = items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
      addToast(next.includes(id) ? 'Article saved.' : 'Article removed.')
      return next
    })
  }

  function addRecent(id) {
    setRecent((items) => [id, ...items.filter((item) => item !== id)].slice(0, 6))
  }

  return (
    <Shell favourites={favourites} appointments={appointments}>
      <Routes>
        <Route path="/" element={<HomePage favourites={favourites} toggleFavourite={toggleFavourite} addRecent={addRecent} />} />
        <Route path="/therapies" element={<TherapiesPage favourites={favourites} toggleFavourite={toggleFavourite} addRecent={addRecent} recent={recent} />} />
        <Route path="/therapies/:id" element={<TherapyDetailsPage favourites={favourites} toggleFavourite={toggleFavourite} addRecent={addRecent} />} />
        <Route path="/dosha-quiz" element={<QuizPage addToast={addToast} />} />
        <Route path="/book" element={<BookingPage appointments={appointments} setAppointments={setAppointments} addToast={addToast} />} />
        <Route path="/appointments" element={<AppointmentsPage appointments={appointments} setAppointments={setAppointments} addToast={addToast} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/journal" element={<JournalPage savedArticles={savedArticles} toggleArticle={toggleArticle} />} />
        <Route path="/journal/:id" element={<ArticleDetailsPage savedArticles={savedArticles} toggleArticle={toggleArticle} />} />
        <Route path="/contact" element={<ContactPage addToast={addToast} />} />
        <Route path="/saved" element={<SavedPage favourites={favourites} toggleFavourite={toggleFavourite} savedArticles={savedArticles} toggleArticle={toggleArticle} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toasts toasts={toasts} />
    </Shell>
  )
}

export default App

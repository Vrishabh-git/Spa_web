export const bookingKey = 'lotus-appointments'
export const favouritesKey = 'lotus-favourite-treatments'
export const journalKey = 'lotus-saved-articles'
export const recentKey = 'lotus-recent-treatments'
export const quizKey = 'lotus-quiz-progress'

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    localStorage.removeItem(key)
    return fallback
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function formatPrice(price) {
  return `INR ${price.toLocaleString('en-IN')}`
}

export function getSlots(dateValue) {
  if (!dateValue) return []
  const day = new Date(`${dateValue}T12:00:00`).getDay()
  if (day === 0 || day === 6) return ['10:30 AM', '12:30 PM', '3:00 PM']
  if (day === 5) return ['9:30 AM', '12:00 PM', '2:30 PM', '4:00 PM', '6:00 PM']
  return ['10:00 AM', '11:30 AM', '1:00 PM', '3:30 PM', '5:00 PM']
}

export function makeReference() {
  return `LOTUS-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now()
    .toString()
    .slice(-4)}`
}

export function isSlotTaken(bookings, date, time, ignoreReference = '') {
  return bookings.some(
    (booking) =>
      booking.status !== 'cancelled' &&
      booking.date === date &&
      booking.time === time &&
      booking.reference !== ignoreReference,
  )
}

export function canChangeAppointment(booking) {
  if (!booking || booking.status === 'cancelled') return false
  const now = new Date()
  const appointment = new Date(`${booking.date}T00:00:00`)
  const diffHours = (appointment.getTime() - now.getTime()) / 36e5
  return diffHours >= 24
}

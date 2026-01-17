// Shared date formatting so cards and detail views stay consistent.
// Shared date formatting so cards and detail views stay consistent.
const shortFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

// Full date used in detail views.
const longFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

// Card-friendly short date (e.g., Apr 8).
export const formatShortDate = (value: string) =>
  shortFormatter.format(new Date(value))

// Detail-friendly long date (e.g., Apr 8, 2025).
export const formatLongDate = (value: string) =>
  longFormatter.format(new Date(value))

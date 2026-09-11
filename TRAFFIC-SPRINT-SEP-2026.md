# STall Traffic Sprint — First 10 Paid Salons

## Primary funnel

Traffic source → `traffic.html` → B2B lead saved to `sales_leads` → WhatsApp conversation → 5-minute demo → paid salon.

The existing frozen `whatsapp-score.html` flow is not changed.

## Campaign URL

Base landing page:
`https://free-digital-score.stallwale.in/traffic.html`

Meta / Instagram:
`https://free-digital-score.stallwale.in/traffic.html?utm_source=meta&utm_medium=paid_social&utm_campaign=salon_audit_sep_2026`

Instagram organic:
`https://free-digital-score.stallwale.in/traffic.html?utm_source=instagram&utm_medium=organic&utm_campaign=salon_audit_sep_2026`

Direct outreach:
`https://free-digital-score.stallwale.in/traffic.html?utm_source=outbound&utm_medium=whatsapp&utm_campaign=salon_audit_sep_2026`

## Ad message tests

### A — Problem hook
"Are you losing salon enquiries before they become bookings?"

Get a free digital health check of your salon. See your biggest online gaps in under 2 minutes.

CTA: Get My Free Audit

### B — Curiosity hook
"How strong is your salon online? Score it free."

Google visibility. Website. Offers. Booking path. Customer lead opportunities.

CTA: Check My Salon

### C — Competitive hook
"Nearby salons may be getting customers you should be getting."

Get your free salon digital audit and see what to fix first.

CTA: Get My Free Audit

## Daily operating target

50 targeted salon prospects/day from Google Maps or local directories.

Paid traffic starts small and is judged on qualified salon conversations, not clicks alone.

Target funnel for the first sprint:

150 landing-page visits/day
50 lead-form starts/day
25 completed B2B leads/day
10 qualified conversations/day
5 demos/day
1 paid salon/day

These are operating targets, not current results.

## What counts as a qualified lead

Salon owner/decision maker confirmed.
Valid WhatsApp number.
Salon is active.
Clear interest in getting more enquiries, visibility, booking or automation.

## Source-of-truth fields

Every paid/outbound lead should retain:
- source
- medium
- campaign
- landing_page
- city/state
- package_interest
- status
- created_at

The `sales_leads` table already contains attribution fields for source, landing page, campaign and UTM values.

## Daily review

Every evening review the acquisition dashboard and answer:

1. Which source produced the most qualified leads?
2. Which city produced the most qualified leads?
3. Which message produced the most conversations?
4. How many demos were completed?
5. How many salons paid?

Kill weak traffic sources quickly. Double down on sources that produce qualified conversations and paid salons.

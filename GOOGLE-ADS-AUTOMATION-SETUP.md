# STall Google Ads → Qualified Lead Machine

## What is now automated

Google Ads Lead Form submission → `/api/google-lead` → automatic qualification → Supabase `outreach_prospects` → Acquisition Command Center.

Qualified leads are written with `status=qualified`. Lower-intent leads are parked as `new` instead of entering the working queue.

## Qualification rule

A lead receives points for:
- valid phone: 25
- salon/beauty/barber/spa business: 20
- Delhi NCR target: 20
- growth/lead/booking/marketing pain: 20
- explicit interest/timeline: 15

Score >= 70 = **QUALIFIED**.

## One-time connection

The only setup required outside this repository is connecting the Google Ads Lead Form webhook to the deployed Vercel function and providing a Supabase write key as a Vercel environment variable.

Environment variables:
- `SUPABASE_URL` = `https://dhiimviybpbggvuuzwfh.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = Supabase service-role key (preferred)

`SUPABASE_ANON_KEY` can be used only if the database RLS policy permits the webhook insert; service role is preferred for a server-side webhook.

## Google Ads form fields

Use these field concepts in the lead form so the qualifier has enough signal:
- Business / Salon name
- Phone
- City / Area
- Business type
- Biggest problem (leads, bookings, reviews, marketing, empty chairs, etc.)
- What do you want to improve?
- Interested in a free digital score? (Yes/No)
- When do you want to start? (Now / This month / Just researching)

After deployment, the webhook endpoint is:
`https://<your-vercel-production-domain>/api/google-lead`

## Operator rule

You should not manually copy Google leads into the dashboard. The operator starts work only from the **Qualified** queue.

The dashboard remains the source of truth in Supabase, not a spreadsheet or browser local storage.

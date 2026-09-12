// STall Google Ads Lead Webhook
// Receives Google Ads lead-form webhook payloads, qualifies them automatically,
// and writes qualified leads into the existing Supabase outreach pipeline.

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dhiimviybpbggvuuzwfh.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function normalizePhone(value) {
  return String(value || '').replace(/[^0-9+]/g, '').replace(/^00/, '+');
}

function fieldMap(payload) {
  const map = {};
  const rows = payload?.user_column_data || payload?.userColumnData || [];
  for (const row of rows) {
    const key = String(row.column_id || row.columnId || row.column_name || row.columnName || '').toLowerCase();
    const value = row.string_value ?? row.stringValue ?? row.value ?? '';
    if (key) map[key] = String(value).trim();
  }
  return map;
}

function pick(map, aliases) {
  for (const alias of aliases) {
    if (map[alias] != null && map[alias] !== '') return map[alias];
  }
  return '';
}

function qualify(data) {
  let score = 0;
  const reasons = [];
  const phone = normalizePhone(data.phone);
  const locality = `${data.locality} ${data.city}`.toLowerCase();
  const business = `${data.business_type} ${data.salon_name}`.toLowerCase();
  const pain = `${data.problem} ${data.goal}`.toLowerCase();

  if (phone.length >= 10) { score += 25; reasons.push('valid phone'); }
  if (/salon|beauty|barber|spa|groom|unisex/.test(business)) { score += 20; reasons.push('salon business'); }
  if (/delhi|gurgaon|gurugram|noida|faridabad|ghaziabad|new delhi|dwarka|rohini|pitampura|saket|lajpat|karol|janakpuri|mayur vihar|greater kailash/.test(locality)) { score += 20; reasons.push('Delhi NCR target'); }
  if (/lead|enquir|customer|booking|growth|marketing|instagram|google|review|automation|walk.?in|empty|chair|sales/.test(pain)) { score += 20; reasons.push('growth pain/intent'); }
  if (/yes|interested|call|demo|want|sure|definitely|now/.test(`${data.interest} ${data.timeline}`.toLowerCase())) { score += 15; reasons.push('purchase intent'); }

  return { score, qualified: score >= 70, reasons };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'POST only' });
  if (!SUPABASE_KEY) return json(res, 500, { ok: false, error: 'Supabase key is not configured' });

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const map = fieldMap(payload);
    const data = {
      salon_name: pick(map, ['business_name','salon_name','company_name','name']),
      locality: pick(map, ['locality','area','location','city']),
      city: pick(map, ['city','location']),
      phone: pick(map, ['phone','phone_number','mobile','mobile_number','contact_number']),
      business_type: pick(map, ['business_type','category','type']),
      problem: pick(map, ['biggest_problem','problem','challenge','pain_point']),
      goal: pick(map, ['goal','what_do_you_want','need']),
      interest: pick(map, ['interested','interest','looking_for']),
      timeline: pick(map, ['timeline','when','start_time']),
      lead_id: payload.lead_id || payload.leadId || '',
      campaign_id: payload.campaign_id || payload.campaignId || '',
      adgroup_id: payload.adgroup_id || payload.adGroupId || ''
    };

    const q = qualify(data);
    const status = q.qualified ? 'qualified' : 'new';
    const notes = `Google Ads lead | score ${q.score}/100 | ${q.reasons.join(', ')} | lead_id=${data.lead_id || 'n/a'} | campaign=${data.campaign_id || 'n/a'}`;

    // Avoid duplicate lead creation when Google retries a webhook.
    if (data.lead_id) {
      const dupUrl = `${SUPABASE_URL}/rest/v1/outreach_prospects?select=id&notes=ilike.*lead_id=${encodeURIComponent(data.lead_id)}*`;
      const dup = await fetch(dupUrl, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
      if (dup.ok && (await dup.json()).length) return json(res, 200, { ok: true, duplicate: true, qualified: q.qualified, score: q.score });
    }

    const row = {
      salon_name: data.salon_name || 'Google Ads Lead',
      locality: data.locality || data.city || 'Delhi NCR',
      phone: data.phone,
      rating: '',
      priority: q.qualified ? 1 : 3,
      status,
      notes,
      updated_at: new Date().toISOString()
    };

    const insert = await fetch(`${SUPABASE_URL}/rest/v1/outreach_prospects`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(row)
    });

    if (!insert.ok) {
      const detail = await insert.text();
      return json(res, 502, { ok: false, error: 'Supabase insert failed', detail: detail.slice(0, 500) });
    }

    return json(res, 200, {
      ok: true,
      qualified: q.qualified,
      score: q.score,
      status,
      next: q.qualified ? 'Show in qualified acquisition queue' : 'Park in nurture queue'
    });
  } catch (err) {
    return json(res, 400, { ok: false, error: err.message });
  }
};

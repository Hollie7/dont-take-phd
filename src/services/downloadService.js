// Generates and downloads a self-contained HTML record of the interview session.
// All media (avatar image, advisor audio) is embedded as base64 so the file works offline.

const blobUrlToDataUrl = async (blobUrl) => {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const escapeHtml = (str) =>
  String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const downloadConversationRecord = async ({ advisorProfile, messages, msgAudioMap, result }) => {
  // Convert audio blob URLs to embedded data URLs
  const audioDataMap = {};
  for (const [timestamp, blobUrl] of Object.entries(msgAudioMap ?? {})) {
    try {
      audioDataMap[timestamp] = await blobUrlToDataUrl(blobUrl);
    } catch {
      // Audio unavailable — skip
    }
  }

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isOffer = result === 'offer';
  const resultLabel = isOffer ? '🎉 Offer Received' : '😢 Not Accepted';
  const resultColor = isOffer ? '#16a34a' : '#dc2626';
  const resultBg = isOffer ? '#f0fdf4' : '#fef2f2';
  const resultBorder = isOffer ? '#bbf7d0' : '#fecaca';

  // Avatar: already a data URL if custom, otherwise use emoji placeholder
  const avatarHtml = advisorProfile.customAvatar
    ? `<img src="${advisorProfile.customAvatar}" alt="Avatar" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid #e5e5e5;">`
    : `<div style="width:80px;height:80px;border-radius:50%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:36px;flex-shrink:0;">${advisorProfile.gender === 'male' ? '👨‍🏫' : '👩‍🏫'}</div>`;

  const messagesHtml = messages.map((msg) => {
    const isAdvisor = msg.role === 'advisor';
    const name = isAdvisor ? escapeHtml(advisorProfile.name) : 'You';
    const changeHtml = msg.satisfactionChange !== undefined && msg.satisfactionChange !== 0
      ? `<span style="font-size:11px;font-weight:600;color:${msg.satisfactionChange > 0 ? '#16a34a' : '#dc2626'};margin-left:8px;">${msg.satisfactionChange > 0 ? '+' : ''}${msg.satisfactionChange} pts</span>`
      : '';
    const audioHtml = audioDataMap[msg.timestamp]
      ? `<audio controls src="${audioDataMap[msg.timestamp]}" style="display:block;width:100%;margin-top:10px;height:36px;"></audio>`
      : '';

    return `
    <div style="margin-bottom:14px;${isAdvisor ? '' : 'text-align:right;'}">
      <div style="display:inline-block;max-width:78%;text-align:left;background:${isAdvisor ? '#f9f9f9' : '#1a1a1a'};border:1px solid ${isAdvisor ? '#e5e5e5' : '#333'};border-radius:16px;padding:12px 16px;">
        <div style="font-size:11px;color:${isAdvisor ? '#777' : '#aaa'};font-weight:700;margin-bottom:6px;letter-spacing:0.02em;">
          ${name}${changeHtml}
        </div>
        <p style="margin:0;font-size:14px;line-height:1.65;color:${isAdvisor ? '#333' : '#f0f0f0'};">
          ${escapeHtml(msg.content)}
        </p>
        ${audioHtml}
      </div>
    </div>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PhD Interview — ${escapeHtml(advisorProfile.name)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; color: #1a1a1a; padding: 40px 20px; line-height: 1.5; }
  .wrap { max-width: 680px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 28px; }
  .header h1 { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
  .header .date { font-size: 13px; color: #999; margin-bottom: 12px; }
  .badge { display: inline-block; padding: 6px 20px; border-radius: 20px; font-size: 13px; font-weight: 600; background: ${resultBg}; color: ${resultColor}; border: 1px solid ${resultBorder}; }
  .card { background: #fff; border: 1px solid #e5e5e5; border-radius: 16px; padding: 24px; margin-bottom: 20px; }
  .advisor-row { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .advisor-text h2 { font-size: 18px; font-weight: 700; }
  .advisor-text .sub { font-size: 13px; color: #666; margin-top: 3px; }
  .advisor-text .field { font-size: 12px; color: #999; margin-top: 3px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 4px; }
  .grid-item label { font-size: 10px; font-weight: 700; color: #bbb; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 3px; }
  .grid-item p { font-size: 13px; color: #444; }
  .section-label { font-size: 11px; font-weight: 700; color: #bbb; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; }
  .quote { border-left: 3px solid #e5e5e5; padding-left: 14px; margin-top: 16px; font-style: italic; font-size: 13px; color: #888; }
  .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #ccc; }
  audio { border-radius: 8px; }
  @media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="wrap">

  <div class="header">
    <h1>PhD Interview Record</h1>
    <div class="date">${date}</div>
    <div class="badge">${resultLabel}</div>
  </div>

  <!-- Advisor Profile -->
  <div class="card">
    <div class="advisor-row">
      ${avatarHtml}
      <div class="advisor-text">
        <h2>${escapeHtml(advisorProfile.name)}</h2>
        <div class="sub">${escapeHtml(advisorProfile.title)} · ${escapeHtml(advisorProfile.institution)}</div>
        <div class="field">${escapeHtml(advisorProfile.field)}</div>
      </div>
    </div>
    <div class="grid">
      <div class="grid-item">
        <label>Personality</label>
        <p>${escapeHtml(advisorProfile.personality)}</p>
      </div>
      <div class="grid-item">
        <label>Lab Style</label>
        <p>${escapeHtml(advisorProfile.lab_style)}</p>
      </div>
      <div class="grid-item">
        <label>Research Interests</label>
        <p>${escapeHtml((advisorProfile.research_interests ?? []).join(', '))}</p>
      </div>
      <div class="grid-item">
        <label>Expectations</label>
        <p>${escapeHtml((advisorProfile.expectations ?? []).join('; '))}</p>
      </div>
    </div>
    ${advisorProfile.famous_quote ? `<div class="quote">"${escapeHtml(advisorProfile.famous_quote)}"</div>` : ''}
  </div>

  <!-- Conversation -->
  <div class="card">
    <div class="section-label">Conversation · ${messages.length} messages</div>
    ${messagesHtml}
  </div>

  <div class="footer">Generated by Don't Take a PhD · ${date}</div>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `phd-interview-${(advisorProfile.name ?? 'record').replace(/\s+/g, '-')}-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Builds a Word-compatible (.doc) case report and triggers a browser download.
// Uses the classic "HTML wrapped in Word XML namespaces" technique so the
// output opens natively in Microsoft Word, no server-side docx library needed.

const decisionLabel = {
  approved: 'APPROVED',
  manual_review: 'MANUAL REVIEW',
  rejected: 'REJECTED',
  pending: 'PENDING'
};

export function downloadCaseReport(c) {
  const findings = (c.tamper_findings || [])
    .map((f, i) => `<li>Region ${i + 1}: ${f.label} (approx. position ${Math.round(f.x)}%, ${Math.round(f.y)}%)</li>`)
    .join('');

  const fields = Object.entries(c.extracted_fields || {})
    .map(([k, v]) => `<li><b>${k.replace(/_/g, ' ')}:</b> ${v}</li>`)
    .join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head><meta charset="utf-8"><title>Sentinel ID Case Report</title></head>
  <body style="font-family:Calibri,Arial,sans-serif;">
    <h1 style="color:#1e3a5f;">SENTINEL ID — Case Report</h1>
    <p><b>Case ID:</b> ${c.id}<br/>
       <b>Document Type:</b> ${c.document_type}<br/>
       <b>Generated:</b> ${new Date().toLocaleString()}</p>

    <h2 style="color:#1e3a5f;">1. Extracted Document Fields</h2>
    <ul>${fields || '<li>No fields extracted.</li>'}</ul>

    <h2 style="color:#1e3a5f;">2. Tamper Detection Analysis</h2>
    <p><b>Tamper Risk Score:</b> ${c.tamper_score ?? 'N/A'} / 100</p>
    <p>${c.tamper_summary || 'No summary available.'}</p>
    <ul>${findings || '<li>No suspicious regions flagged.</li>'}</ul>

    <h2 style="color:#1e3a5f;">3. Face Verification</h2>
    <p><b>Face Match Score:</b> ${c.face_match_score ?? 'N/A'} / 100</p>
    <p>${c.face_match_summary || 'No summary available.'}</p>

    <h2 style="color:#1e3a5f;">4. Overall Judge Score</h2>
    <p><b>${c.judge_score ?? 'N/A'} / 100</b> — combined trust score from document tamper risk and face match confidence.</p>

    <h2 style="color:#1e3a5f;">5. Officer Decision</h2>
    <p><b>Decision:</b> ${decisionLabel[c.decision] || 'PENDING'}<br/>
       <b>Officer:</b> ${c.decided_by || 'N/A'}<br/>
       <b>Decided At:</b> ${c.decided_at ? new Date(c.decided_at).toLocaleString() : 'N/A'}</p>
    <p><b>Officer Notes:</b><br/>${(c.officer_notes || 'No notes provided.').replace(/\n/g, '<br/>')}</p>

    <h2 style="color:#1e3a5f;">Point-by-Point Reasoning Summary</h2>
    <ol>
      <li>Document fields were extracted and cross-checked for completeness.</li>
      <li>Tamper analysis produced a risk score of ${c.tamper_score ?? 'N/A'} based on ${(c.tamper_findings || []).length} flagged region(s).</li>
      <li>Live face capture was compared against the document photo, yielding a match score of ${c.face_match_score ?? 'N/A'}.</li>
      <li>The combined judge score of ${c.judge_score ?? 'N/A'} informed the officer's final decision of ${decisionLabel[c.decision] || 'PENDING'}.</li>
    </ol>
  </body>
  </html>`;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SentinelID_Case_${c.id}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
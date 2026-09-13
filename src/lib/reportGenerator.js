// Builds a Word-compatible (.doc) case report with side-by-side image comparison
// and triggers a browser download.

const decisionLabel = {
  approved: 'APPROVED',
  manual_review: 'MANUAL REVIEW',
  rejected: 'REJECTED',
  pending: 'PENDING'
};

// Convert image URL to Data URL via Canvas
async function loadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error("No URL provided"));
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

async function imageUrlToDataUrl(url) {
  if (!url) return null;
  if (url.startsWith("data:")) return url;
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.width || 600;
    canvas.height = img.height || 400;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.88);
  } catch (err) {
    console.warn("Could not convert image URL to Data URL:", err);
    return url;
  }
}

async function generateAnnotatedDocumentDataUrl(documentImageUrl, tamperFindings = []) {
  if (!documentImageUrl) return null;
  try {
    const img = await loadImage(documentImageUrl);
    const canvas = document.createElement("canvas");
    canvas.width = img.width || 800;
    canvas.height = img.height || 600;
    const ctx = canvas.getContext("2d");

    // Draw original image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw flagged region overlays
    if (Array.isArray(tamperFindings) && tamperFindings.length > 0) {
      tamperFindings.forEach((f, idx) => {
        const cx = (f.x / 100) * canvas.width;
        const cy = (f.y / 100) * canvas.height;
        const radius = Math.max(18, (f.radius / 100) * canvas.width);

        // Highlight ring
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.lineWidth = Math.max(4, canvas.width * 0.007);
        ctx.strokeStyle = "#dc2626";
        ctx.stroke();

        // Soft red fill
        ctx.fillStyle = "rgba(220, 38, 38, 0.22)";
        ctx.fill();

        // Label Tag Box
        const badgeText = `#${idx + 1} ${f.label || 'Flagged Region'}`;
        ctx.font = "bold 13px sans-serif";
        const textWidth = ctx.measureText(badgeText).width;

        const badgeX = Math.max(10, Math.min(canvas.width - textWidth - 20, cx - radius));
        const badgeY = Math.max(25, cy - radius - 10);

        ctx.fillStyle = "#dc2626";
        ctx.fillRect(badgeX - 4, badgeY - 14, textWidth + 12, 20);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(badgeText, badgeX + 2, badgeY);
      });
    }

    return canvas.toDataURL("image/jpeg", 0.9);
  } catch (err) {
    console.warn("Could not generate annotated document canvas:", err);
    return documentImageUrl;
  }
}

export async function downloadCaseReport(c) {
  // Generate Base64 Data URLs for all 3 images to ensure they display inline in Word / HTML
  const [originalDocDataUrl, annotatedDocDataUrl, liveFaceDataUrl] = await Promise.all([
    imageUrlToDataUrl(c.document_image_url),
    generateAnnotatedDocumentDataUrl(c.document_image_url, c.tamper_findings || []),
    imageUrlToDataUrl(c.live_face_image_url)
  ]);

  const findings = (c.tamper_findings || [])
    .map((f, i) => `<li><b>Region ${i + 1}:</b> ${f.label} (Position: ${Math.round(f.x)}%, ${Math.round(f.y)}%)</li>`)
    .join('');

  const fields = Object.entries(c.extracted_fields || {})
    .map(([k, v]) => `<li><b>${k.replace(/_/g, ' ')}:</b> ${v}</li>`)
    .join('');

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>Sentinel ID — Verification Case Report</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; color: #1e293b; margin: 20px; }
      h1 { color: #1e3a5f; border-bottom: 2px solid #0f766e; padding-bottom: 6px; }
      h2 { color: #1e3a5f; margin-top: 24px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
      .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .meta-table td { padding: 6px 10px; border: 1px solid #e2e8f0; font-size: 14px; }
      .meta-label { font-weight: bold; background-color: #f8fafc; color: #475569; width: 30%; }
      .comparison-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
      .comparison-table td { border: 1px solid #cbd5e1; padding: 10px; text-align: center; vertical-align: top; width: 33.33%; background-color: #fafafa; }
      .img-caption { font-size: 12px; font-weight: bold; color: #334155; margin-bottom: 8px; text-transform: uppercase; }
      .img-subcaption { font-size: 11px; color: #64748b; margin-top: 6px; }
      .report-img { width: 100%; max-width: 240px; height: 180px; object-fit: contain; border: 1px solid #cbd5e1; border-radius: 6px; background-color: #ffffff; }
      .score-box { background-color: #f1f5f9; padding: 12px; border-radius: 8px; border-left: 4px solid #0f766e; margin: 10px 0; font-size: 14px; }
      .alert-box { background-color: #fff1f2; border: 1px solid #fecdd3; border-left: 4px solid #e11d48; padding: 12px; border-radius: 8px; color: #9f1239; margin: 12px 0; font-size: 13px; }
    </style>
  </head>
  <body>
    <h1>SENTINEL ID — Verification Case Report</h1>
    
    <table class="meta-table">
      <tr><td class="meta-label">Case ID</td><td>${c.id}</td></tr>
      <tr><td class="meta-label">Document Type</td><td style="text-transform:uppercase;">${c.document_type || 'Passport'}</td></tr>
      <tr><td class="meta-label">Verification Strictness</td><td style="text-transform:capitalize;">${c.strictness || 'Standard'} Sensitivity Mode</td></tr>
      <tr><td class="meta-label">Date Generated</td><td>${new Date().toLocaleString()}</td></tr>
      <tr><td class="meta-label">Officer Decision</td><td><b>${decisionLabel[c.decision] || 'PENDING'}</b></td></tr>
      <tr><td class="meta-label">Decided By</td><td>${c.decided_by || 'Officer Alex Mercer'}</td></tr>
    </table>

    <h2>1. Visual Biometric & Document Comparison</h2>
    <p style="font-size:13px; color:#475569;">Side-by-side verification analysis comparing the submitted document photo, AI tamper anomaly detection overlay, and live facial capture.</p>
    
    <table class="comparison-table">
      <tr>
        <td>
          <div class="img-caption">1. Submitted Document Photo</div>
          ${originalDocDataUrl ? `<img src="${originalDocDataUrl}" class="report-img" alt="Submitted Document" />` : '<p style="color:#94a3b8;">No image available</p>'}
          <div class="img-subcaption">Original unedited upload provided by user</div>
        </td>
        <td>
          <div class="img-caption" style="color:#dc2626;">2. Document with Flagged Regions</div>
          ${annotatedDocDataUrl ? `<img src="${annotatedDocDataUrl}" class="report-img" alt="Flagged Anomaly Regions" />` : '<p style="color:#94a3b8;">No image available</p>'}
          <div class="img-subcaption">AI substrate & tamper anomaly highlights</div>
        </td>
        <td>
          <div class="img-caption" style="color:#0f766e;">3. Live Face Scan Photo</div>
          ${liveFaceDataUrl ? `<img src="${liveFaceDataUrl}" class="report-img" alt="Live Face Scan" />` : '<p style="color:#94a3b8;">No image available</p>'}
          <div class="img-subcaption">Camera live facial liveness capture</div>
        </td>
      </tr>
    </table>

    ${c.face_match_score === 0 ? `
      <div class="alert-box">
        <b>Biometric Mismatch Warning (0 Score):</b> Live facial scan failed landmark matching against document photo under ${c.strictness || 'Standard'} sensitivity mode.
      </div>
    ` : ''}

    <h2>2. Quantitative Verification Scores</h2>
    <div class="score-box">
      <b>Tamper Risk Score:</b> ${c.tamper_score ?? 'N/A'} / 100<br/>
      <b>Face Match Score:</b> ${c.face_match_score ?? 'N/A'} / 100<br/>
      <b>Overall Judge Score:</b> <b>${c.judge_score ?? 'N/A'} / 100</b>
    </div>

    <h2>3. Extracted Document Fields</h2>
    <ul>${fields || '<li>No fields extracted.</li>'}</ul>

    <h2>4. Detailed AI Findings & Summaries</h2>
    <p><b>Document Tamper Analysis:</b><br/>${c.tamper_summary || 'No summary available.'}</p>
    <ul>${findings || '<li>No suspicious substrate regions flagged.</li>'}</ul>

    <p><b>Biometric Face Match Analysis:</b><br/>${c.face_match_summary || 'No summary available.'}</p>

    <h2>5. Officer Investigation Notes & Audit Log</h2>
    <p><b>Decision:</b> ${decisionLabel[c.decision] || 'PENDING'}<br/>
       <b>Officer:</b> ${c.decided_by || 'N/A'}<br/>
       <b>Decided At:</b> ${c.decided_at ? new Date(c.decided_at).toLocaleString() : 'N/A'}</p>
    <p><b>Officer Notes:</b><br/>${(c.officer_notes || 'No notes provided.').replace(/\n/g, '<br/>')}</p>

    <h2>6. Point-by-Point Verification Rationale</h2>
    <ol>
      <li>Document photo was uploaded and OCR extracted key document fields.</li>
      <li>AI tamper detection analyzed substrate pixel variance and highlighted ${(c.tamper_findings || []).length} potential anomaly region(s).</li>
      <li>Live face scan camera capture was compared against the document photo with a facial match score of ${c.face_match_score ?? 'N/A'}/100.</li>
      <li>Combined judge confidence score of ${c.judge_score ?? 'N/A'}/100 informed final officer action: ${decisionLabel[c.decision] || 'PENDING'}.</li>
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
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { document_image_url, document_type } = await req.json();
    if (!document_image_url || !document_type) {
      return Response.json({ error: 'document_image_url and document_type are required' }, { status: 400 });
    }

    const fieldGuide = {
      passport: 'name, passport_number, nationality, date_of_birth, date_of_expiry, gender',
      visa: 'visa_number, visa_type, entry_validation, stay_duration, name, nationality',
      national_id: 'name, id_number, date_of_birth, nationality, gender',
      driving_license: 'name, license_number, date_of_birth, date_of_expiry, class',
      permit: 'name, permit_number, permit_type, valid_from, valid_until'
    };

    const prompt = `You are an AI border-security document screening assistant. Analyze the attached ${document_type} image.
1. Extract these fields if visible: ${fieldGuide[document_type] || 'name, document_number, date_of_birth, date_of_expiry'}.
2. Inspect the document for signs of tampering or forgery: photo replacement, text/font manipulation, stamp forgery, inconsistent spacing/alignment, mismatched fonts, blurring or pixel artifacts around fields, unnatural edges.
3. Produce a tamper_score from 0 (clean, no signs of tampering) to 100 (heavily tampered/forged).
4. For every suspicious region you find, estimate its location as percentages of the image width/height from the top-left corner (x, y from 0-100) and an approximate radius as a percent of image width (5-25), with a short label describing the issue. If nothing suspicious is found, return an empty array.
5. Write a concise tamper_summary (2-4 sentences) explaining your reasoning, referencing the specific findings.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [document_image_url],
      response_json_schema: {
        type: 'object',
        properties: {
          extracted_fields: { type: 'object', additionalProperties: true },
          tamper_score: { type: 'number' },
          tamper_findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
                radius: { type: 'number' },
                label: { type: 'string' }
              },
              required: ['x', 'y', 'radius', 'label']
            }
          },
          tamper_summary: { type: 'string' }
        },
        required: ['extracted_fields', 'tamper_score', 'tamper_findings', 'tamper_summary']
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
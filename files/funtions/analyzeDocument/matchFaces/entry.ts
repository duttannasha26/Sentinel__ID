import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { document_image_url, live_face_image_url } = await req.json();
    if (!document_image_url || !live_face_image_url) {
      return Response.json({ error: 'document_image_url and live_face_image_url are required' }, { status: 400 });
    }

    const prompt = `You are an AI biometric verification assistant at a border checkpoint. The FIRST attached image is the photo printed on an identity document. The SECOND attached image is a live capture of the person presenting that document.
Compare the two faces carefully (facial structure, eyes, nose, mouth, proportions, age consistency) and determine how likely it is that they are the same person.
Return a face_match_score from 0 (clearly different people) to 100 (very high confidence same person).
Also return a concise face_match_summary (2-3 sentences) explaining your reasoning.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [document_image_url, live_face_image_url],
      response_json_schema: {
        type: 'object',
        properties: {
          face_match_score: { type: 'number' },
          face_match_summary: { type: 'string' }
        },
        required: ['face_match_score', 'face_match_summary']
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
import MistralClient from '@mistralai/mistralai';
import { MistralStream, StreamingTextResponse } from 'ai';
 
const mistral = new MistralClient(process.env.MISTRAL_API_KEY || '');
 
export const runtime = 'edge';
 
export async function POST(req: Request) {
  const { prompt } = await req.json();
 
  const response = mistral.chatStream({
    model: 'mistral-large-latest',
    messages: [{ 
      role: 'user',
      content: `CONTEXT: You are an expert at predicting the dollar worth of resumes.
-------
TASK: 
- Analyze the resume given below and provide its estimated worth in US dollars
- Provide 4 short bullet points explanation of the key factors contributing to the assessment,
and 4 tips on how they can improve their worth. Each bullet point should be less than 1 line.
-------
RESUME:
${prompt}
-------
OUTPUT FORMAT: 
<Estimated Worth>$...</Estimated Worth>
<Explanation>
   <ul>
      <li>...</li>
      <li>...</li>
      <li>...</li>
      ...
   </ul>
</Explanation>
<Improvements>
   <ul>
      <li>...</li>
      <li>...</li>
      <li>...</li>
      ...
   </ul>
</Improvements>`
    }],
  });
 
  const stream = MistralStream(response);
 
  return new StreamingTextResponse(stream);
}
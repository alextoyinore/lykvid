'use server';

/**
 * @fileOverview An AI agent that extracts lyrics from an audio file.
 *
 * - extractLyrics - A function that handles the lyric extraction process.
 * - ExtractLyricsInput - The input type for the extractLyrics function.
 * - ExtractLyricsOutput - The return type for the extractLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractLyricsInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      'The audio file as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type ExtractLyricsInput = z.infer<typeof ExtractLyricsInputSchema>;

const ExtractLyricsOutputSchema = z.object({
  lyrics: z.string().describe('The extracted lyrics from the audio file.'),
});
export type ExtractLyricsOutput = z.infer<typeof ExtractLyricsOutputSchema>;

export async function extractLyrics(input: ExtractLyricsInput): Promise<ExtractLyricsOutput> {
  return extractLyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractLyricsPrompt',
  input: {schema: ExtractLyricsInputSchema},
  output: {schema: ExtractLyricsOutputSchema},
  prompt: `You are an expert AI that extracts lyrics from an audio file.

  Please extract the lyrics from the given audio file. Return only the lyrics, do not include any other information.

  Audio: {{media url=audioDataUri}}`,
});

const extractLyricsFlow = ai.defineFlow(
  {
    name: 'extractLyricsFlow',
    inputSchema: ExtractLyricsInputSchema,
    outputSchema: ExtractLyricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

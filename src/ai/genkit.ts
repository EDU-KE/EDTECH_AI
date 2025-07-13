import {genkit} from 'genkit';
import {deepseek} from 'genkitx-deepseek';

export const ai = genkit({
  plugins: [
    deepseek({
      apiKey: process.env.DEEPSEEK_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

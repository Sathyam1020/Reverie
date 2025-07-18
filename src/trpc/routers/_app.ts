import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { agentsRouter } from '@/modules/agents/server/procedures';
import { meetingsRouter } from '@/modules/meetings/server/procedures';
import { premiumRouter } from '@/modules/premium/server/procedures';
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
  agents: agentsRouter,
  meetings: meetingsRouter,
  premium: premiumRouter,  
});
// export type definition of API
export type AppRouter = typeof appRouter;
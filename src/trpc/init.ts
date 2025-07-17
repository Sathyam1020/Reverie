import { db } from '@/db';
import { agents } from '@/db/agents';
import { meetings } from '@/db/meetings';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from '@/modules/premium/constants';
import { initTRPC, TRPCError } from '@trpc/server';
import { count, eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';
export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

// Non protected procedure
// This is useful for procedures that do not require authentication
// or any specific context.
// It can be used for public APIs or simple queries.
export const baseProcedure = t.procedure;

// Protected procedure
// This is useful for procedures that require authentication
// or any specific context.
// It checks if the user is authenticated and throws an error if not.
export const protectedProcedure = baseProcedure.use(async ({ ctx, next}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if(!session){
    throw new TRPCError({code: 'UNAUTHORIZED', message: 'You must be logged in to access this resource.'});
  }
  return next({ctx: {...ctx, auth: session}}); 
})

export const premiumProcedure = (entity: "meetings" | "agents") => 
  protectedProcedure.use(async ({ ctx, next }) => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    }); 

    const [userMeetings] = await db
        .select({
            count: count(meetings.id)
        })
        .from(meetings)
        .where(
            eq(meetings.userId, ctx.auth.user.id)
        ); 
    
    const [userAgents] = await db
        .select({
            count: count(agents.id)
        })
        .from(agents)
        .where(
            eq(agents.userId, ctx.auth.user.id)
        ); 

    const isPremium = customer.activeSubscriptions.length > 0;     
    const isFreeAgentLimitReached = userAgents.count >= MAX_FREE_AGENTS; 
    const isFreeMeetingLimitReached = userMeetings.count >= MAX_FREE_MEETINGS;

    const shouldThrowAgentError = entity === "agents" && isFreeAgentLimitReached && !isPremium; 
    const shouldThrowMeetingError = entity === "meetings" && isFreeMeetingLimitReached && !isPremium;
    if(shouldThrowMeetingError || shouldThrowAgentError) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You have reached the limit for ${entity}. Please upgrade to premium to continue using this feature.`,
      });
    }
    return next({ ctx: { ...ctx, customer }})
  }); 
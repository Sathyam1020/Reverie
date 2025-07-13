import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
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
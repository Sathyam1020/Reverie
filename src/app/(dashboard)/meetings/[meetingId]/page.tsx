import { auth } from '@/lib/auth';
import MeetingIdView, { MeetingIdViewError, MeetingIdViewLoading } from '@/modules/meetings/ui/views/MeetingIdView';
import { getQueryClient, trpc } from '@/trpc/server';
import { HydrationBoundary } from '@tanstack/react-query';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  params: Promise<{ meetingId: string }>;
}

const page = async ({
  params
}: Props) => {
  const { meetingId } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  );

  return (
    <HydrationBoundary>
      <Suspense fallback={<MeetingIdViewLoading />}>
        <ErrorBoundary fallback={<MeetingIdViewError />}>
          <MeetingIdView
            meetingId={meetingId}
          />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  )
}

export default page;

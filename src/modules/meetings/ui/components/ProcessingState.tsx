import EmptyState from '@/components/EmptyState';

const ProcessingState = () => {
    return (
        <div className='bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center'>
            <EmptyState
                title='Meeting completed'
                description='This meeting was completed, a summary will appear soon.'
                state='processing'
            />
        </div>
    )
}

export default ProcessingState; 

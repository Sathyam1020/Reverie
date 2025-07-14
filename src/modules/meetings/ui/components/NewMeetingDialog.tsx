import ResponsiveDialog from '@/components/ResponsiveDialog';
import MeetingForm from './MeetingForm';
import { useRouter } from 'next/navigation';

interface NewAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const NewMeetingDialog = ({
    open,
    onOpenChange,
}: NewAgentDialogProps) => {

    const router = useRouter(); 
    

    return (
        <ResponsiveDialog
            title='New Meeting'
            description='Create a new meeting'
            open={open}
            onOpenChange={onOpenChange}
        >
            <MeetingForm
                onSuccess={(id) => {
                    onOpenChange(false);
                    // Redirect to the meeting details page
                    router.push(`/meetings/${id}`);
                }}
                onCancel={() => {
                    onOpenChange(false);
                }}
            /> 
        </ResponsiveDialog>
    )
}

export default NewMeetingDialog; 

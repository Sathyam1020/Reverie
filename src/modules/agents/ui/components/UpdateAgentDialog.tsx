import ResponsiveDialog from '@/components/ResponsiveDialog';
import AgentForm from './AgentForm';
import { AgentGetOne } from '../../types';

interface UpdateAgentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialsValues: AgentGetOne; 
}

const UpdateAgentDialog = ({
    open,
    onOpenChange,
    initialsValues,
}: UpdateAgentDialogProps) => {
    return (
        <ResponsiveDialog
            title='Edit Agent'
            description='Edit the agent details'
            open={open}
            onOpenChange={onOpenChange}
        >
            <AgentForm 
                onSuccess={() => onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialsValues}
            />
        </ResponsiveDialog>
    )
}

export default UpdateAgentDialog; 

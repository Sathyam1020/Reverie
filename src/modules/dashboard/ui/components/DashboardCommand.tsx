import { CommandItem, CommandList, CommandResponsiveDialog } from '@/components/ui/command';
import { CommandInput } from 'cmdk';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    <div>
      <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder='Find a meeting or agent'
          className='p-3'
        />
        <CommandList>
          <CommandItem>
            Test
          </CommandItem>
        </CommandList>
      </CommandResponsiveDialog>
    </div>
  )
}

export default DashboardCommand; 

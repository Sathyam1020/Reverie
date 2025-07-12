import { CommandDialog, CommandItem, CommandList } from '@/components/ui/command';
import { CommandInput } from 'cmdk';
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    open: boolean; 
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    <div>
     <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
            placeholder='Find a meeting or agent'
            className='p-3'
        />
        <CommandList>
            <CommandItem>
                Test
            </CommandItem>
        </CommandList>
     </CommandDialog>
    </div>
  )
}

export default DashboardCommand; 

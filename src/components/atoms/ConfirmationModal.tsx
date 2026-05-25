'use client';

import { Button } from '@/components/ui/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex flex-col items-center bg-white border-3 border-black rounded-xl py-10 md:py-16 md:px-22 px-8 gap-7.5 max-w-lg w-full shadow-lg">
        
        <div className="flex flex-col items-center gap-5">
          <h3 className="text-lg md:text-2xl text-neutral-950 font-medium text-center">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 text-center">
            {message}
          </p>
        </div>

        <div className="flex flex-col w-full items-center gap-2.5">
          <Button
            className="text-white bg-neutral-950 border-2 border-solid border-neutral-950 hover:bg-neutral-800 rounded-full md:px-26 px-8 py-5 w-full max-w-70"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          
          <Button
            className="text-neutral-950 bg-neutral-50 hover:bg-neutral-100 border-2 border-solid border-neutral-950 rounded-full md:px-26 px-8 py-5 w-full max-w-70"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        </div>

      </div>
    </div>
  )
}

import { Button } from "../ui/button"

interface DesignedButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  label: string;
  variant?: 'primary' | 'danger';
  className?: string;
}

export default function DesignedButton({ 
  onClick,
  disabled,
  label,
  variant = 'primary',
  className = 'w-full'
}: DesignedButtonProps) {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className={`${variant === 'danger' ? 'bg-red-800 hover:bg-red-500' : 'hover:bg-secondary'} px-8 md:px-10 py-5 md:py-6 text-md relative border-2 border-neutral-950 ${className}`}
    >
      <span className="text-neutral-50 relative text-outline-black">
        {label}
      </span>
      <span className="text-neutral-50 absolute inset-0 flex items-center justify-center pointer-events-none">
        {label}
      </span>
      <div className="absolute size-full box-content p-0.5 bg-neutral-950 -z-10 top-1 left-1 rounded-md"></div>
    </Button>
  )
}
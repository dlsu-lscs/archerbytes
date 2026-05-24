import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large'
  children?: React.ReactNode;
}

const buttonSizes = {
  small: 14,
  medium: 16,
  large: 20,
}

export default function BookmarkButton({isBookmarked, onToggle, disabled, size = 'medium', children}: BookmarkButtonProps) {
  const currentSize = buttonSizes[size];

  return (
    <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        disabled={disabled}
        aria-label={isBookmarked ? "Unsave article" : "Save article"}
        aria-pressed={isBookmarked}
        className="transition-colors duration-200 flex items-center justify-center cursor-pointer hover:text-primary gap-1.5"
    >
        {isBookmarked ? (
            <FaBookmark size={currentSize} className="text-primary" />
        ) : (
            <FaRegBookmark size={currentSize} />
        )}
        {children}
    </button>
  )
}
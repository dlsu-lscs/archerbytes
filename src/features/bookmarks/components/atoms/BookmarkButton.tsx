import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function BookmarkButton({isBookmarked, onToggle, disabled}: BookmarkButtonProps) {
  return (
    <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label={isBookmarked ? "Unsave article" : "Save article"}
        aria-pressed={isBookmarked}
        className="transition-colors duration-200 flex items-center justify-center cursor-pointer hover:text-primary"
    >
        {isBookmarked ? (
            <FaBookmark className="text-primary" />
        ) : (
            <FaRegBookmark />
        )}
    </button>
  )
}
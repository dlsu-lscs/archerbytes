import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
}

export default function BookmarkButton({isBookmarked, onToggle}: BookmarkButtonProps) {
  return (
    <button
        type="button"
        onClick={onToggle}
        aria-label={isBookmarked ? "Unsave article" : "Save article"}
        aria-pressed={isBookmarked}
        className={`transition-colors duration-200 flex items-center justify-center`}
    >
        {isBookmarked ? (
            <FaBookmark className="text-primary" />
        ) : (
            <FaRegBookmark />
        )}
    </button>
  )
}
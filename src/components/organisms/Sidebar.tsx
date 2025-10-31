import { HiOutlineHome } from 'react-icons/hi';
import { GoPerson } from 'react-icons/go';
import { IoBookmarkOutline } from 'react-icons/io5';
import { BsQuestionLg } from 'react-icons/bs';
import { IoIosInformationCircleOutline } from 'react-icons/io';

export default function Sidebar() {
    return (
        <div className="hidden lg:flex flex-col gap-1 grow max-w-64 text-xl p-5 rounded-xl border-dashed border-neutral-400 border-2">
            <p className="flex gap-2 items-center">
                <HiOutlineHome /> HOME
            </p>
            <p className="flex gap-2 items-center">
                <GoPerson /> PROFILE
            </p>
            <p className="flex gap-2 items-center">
                <IoBookmarkOutline /> SAVED
            </p>
            <p className="flex gap-2 items-center">
                <BsQuestionLg /> FAQS
            </p>
            <p className="flex gap-2 items-center">
                <IoIosInformationCircleOutline /> ABOUT LSCS
            </p>
        </div>
    );
}

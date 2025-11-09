import { HiOutlineHome } from 'react-icons/hi';
import { GoPerson } from 'react-icons/go';
import { IoBookmarkOutline } from 'react-icons/io5';
import { BsQuestionLg } from 'react-icons/bs';

import SidebarItem from '../molecules/SidebarItem';

export default function Sidebar() {
    return (
        <div className="hidden lg:flex flex-col gap-2 grow max-w-52 text-lg p-5 z-10">
            <SidebarItem icon={<HiOutlineHome />} title="HOME" isSelected={true} />
            <SidebarItem icon={<GoPerson />} title="PROFILE" />
            <SidebarItem icon={<IoBookmarkOutline />} title="SAVED" />
            <SidebarItem icon={<BsQuestionLg />} title="FAQS" />
            <SidebarItem
                icon={
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 15 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.7 12.4H2.6L0.5 14.5V2.6C0.5 1.445 1.445 0.5 2.6 0.5H11.7C12.855 0.5 13.8 1.445 13.8 2.6V10.3C13.8 11.455 12.855 12.4 11.7 12.4Z"
                            stroke="#7A7878"
                        />
                        <path
                            d="M7.85004 5.40039H6.45004V9.25039H7.85004V5.40039Z"
                            fill="#7A7878"
                        />
                        <path
                            d="M7.15 4.3502C7.5366 4.3502 7.85 4.03679 7.85 3.6502C7.85 3.2636 7.5366 2.9502 7.15 2.9502C6.7634 2.9502 6.45 3.2636 6.45 3.6502C6.45 4.03679 6.7634 4.3502 7.15 4.3502Z"
                            fill="#7A7878"
                        />
                    </svg>
                }
                title="ABOUT LSCS"
            />
        </div>
    );
}

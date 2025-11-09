import { SidebarItemType } from '@/types/sidebar.types';

export default function SidebarItem({
    icon,
    title,
    isSelected = false,
}: SidebarItemType) {
    if (isSelected) {
        return (
            <div className="flex gap-2 items-center">
                <div className="border-solid border-2 border-primary bg-primary text-neutral-50 rounded-md p-1.5 flex justify-center items-center">
                    {icon}
                </div>
                <p className="text-primary">{title}</p>
            </div>
        );
    } else {
        return (
            <div className="flex gap-2 items-center">
                <div className="border-solid border-2 border-neutral-400 rounded-md p-1.5 flex justify-center items-center">
                    {icon}
                </div>
                <p>{title}</p>
            </div>
        );
    }
}

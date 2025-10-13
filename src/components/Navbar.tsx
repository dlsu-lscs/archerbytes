import Link from 'next/link';
import { MdMenu } from 'react-icons/md';
import { IoIosSearch } from 'react-icons/io';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    return (
        <nav className="flex md:w-full items-center gap-10 bg-neutral-200 py-6 ">
            {/* <MdMenu className="aspect-square " size={32} /> */}
            <div className="flex justify-between max-w-[80vw] mx-auto grow bg-neutral-300 items-center h-6 overflow-y-visible">
                <div className="flex gap-5">
                    <div className="size-10 bg-neutral-400"></div>
                    <div className="flex gap-2 items-center h-10 px-4 rounded-full bg-neutral-400">
                        <IoIosSearch size={24} />
                        <input
                            className="h-10 text-neutral-950 outline-none"
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                </div>
                <div className="flex items-center flex gap-[25px]">
                    <p>Nav Link</p>
                    <p>Nav Link</p>
                    <p>Nav Link</p>
                    <p>Nav Link</p>
                    <p>Nav Link</p>
                    <p>Nav Link</p>
                    <Button className="bg-neutral-500 text-neutral-950 p-4">
                        Get Started
                    </Button>
                </div>
            </div>
        </nav>
    );
}

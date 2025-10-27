import Link from 'next/link';
import { MdMenu } from 'react-icons/md';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { IoIosSearch } from 'react-icons/io';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    return (
        <>
            {/* desktop */}
            <nav className="hidden md:flex md:w-full items-center gap-10 bg-neutral-200 py-6 ">
                {/* <MdMenu className="aspect-square " size={32} /> */}
                <div className="flex justify-between max-w-[80vw] mx-auto grow items-center">
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
            {/* mobile */}
            <Sheet>
                <nav className="flex md:hidden md:w-full items-center gap-10 bg-neutral-200 py-6 ">
                    {/* <MdMenu className="aspect-square " size={32} /> */}
                    <div className="flex justify-between max-w-[80vw] mx-auto grow items-center">
                        <div className="flex gap-5">
                            <SheetTrigger>
                                <MdMenu className="aspect-square " size={32} />
                            </SheetTrigger>
                            <div className="size-10 bg-neutral-400"></div>
                        </div>
                        <Button className="bg-neutral-500 text-neutral-950 p-4">
                            Get Started
                        </Button>
                    </div>
                </nav>

                <SheetContent className="">
                    <SheetHeader className="flex flex-col gap-5 mt-5">
                        <div className="flex gap-2 items-center h-10 px-4 rounded-full bg-neutral-400">
                            <IoIosSearch size={24} />
                            <input
                                className="h-10 text-neutral-950 outline-none"
                                type="text"
                                placeholder="Search"
                            />
                        </div>

                        <div className="flex flex-col items-center flex gap-[25px]">
                            <p>Nav Link</p>
                            <p>Nav Link</p>
                            <p>Nav Link</p>
                            <p>Nav Link</p>
                            <p>Nav Link</p>
                            <p>Nav Link</p>
                        </div>
                        <SheetTitle></SheetTitle>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </>
    );
}

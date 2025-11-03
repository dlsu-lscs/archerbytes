'use client';

import { useState } from 'react';
import { useSession } from '@/lib/auth/client';
import Image from 'next/image';
import { MdMenu } from 'react-icons/md';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { AiOutlineBell } from 'react-icons/ai';
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

import Login from '@/features/auth/components/Login';

export default function Navbar() {
    const [login, setLogin] = useState(false);

    const { data: session, status } = useSession();

    const user = session?.user;

    return (
        <>
            {/* desktop */}
            <nav className="hidden lg:flex md:w-full items-center gap-10 justify-center bg-background py-4 z-100">
                {/* <MdMenu className="aspect-square " size={32} /> */}
                <div className="flex justify-between gap-5 max-w-[80vw] grow items-center">
                    <div className="flex gap-5 min-w-0">
                        <Image
                            src={`/archerbytes-main.webp`}
                            width={80}
                            height={38}
                            className="aspect-2/1"
                            alt="Archerbytes logo"
                        ></Image>
                        <div className="flex shrink min-w-0 gap-2 items-center h-10 px-4 rounded-full bg-neutral-50">
                            <IoIosSearch size={24} className="shrink-0" />
                            <input
                                className="h-10 min-w-0 shrink text-neutral-950 outline-none"
                                type="text"
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    <div className="flex items-center whitespace-nowrap text-md flex gap-[25px]">
                        <p>About ArcherBytes</p>
                        {!session ? (
                            <>
                                <p
                                    className="hover:cursor-pointer"
                                    onClick={() => setLogin(true)}
                                >
                                    Sign in
                                </p>
                                <Button className="bg-secondary relative p-4 border border-2 border-neutral-950">
                                    <p className="font-bold text-neutral-50 text-outline-black">
                                        Get Started
                                    </p>
                                    <p className="font-bold text-neutral-50 absolute inset-0 top-[6px]">
                                        Get Started
                                    </p>
                                </Button>
                            </>
                        ) : (
                            <div className="flex gap-3 items-center">
                                <Button className="bg-secondary relative p-4 border border-2 border-neutral-950">
                                    <HiOutlinePencilAlt className="text-neutral-950 size-6" />
                                    <p className="font-bold text-neutral-50 text-outline-black">
                                        Write
                                    </p>
                                    <p className="font-bold text-neutral-50 absolute inset-0 top-[6px] left-[32px]">
                                        Write
                                    </p>
                                </Button>
                                <AiOutlineBell className="size-8" />
                                <Image
                                    src={user?.image || '/globe.svg'}
                                    width={128}
                                    height={128}
                                    className="rounded-full size-8"
                                    alt="User image"
                                ></Image>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {/* mobile */}
            <Sheet>
                <nav className="flex lg:hidden md:w-full items-center gap-10 bg-background py-4 ">
                    {/* <MdMenu className="aspect-square " size={32} /> */}
                    <div className="flex justify-between max-w-[80vw] mx-auto grow items-center">
                        <div className="flex gap-5">
                            <SheetTrigger>
                                <MdMenu className="aspect-square " size={32} />
                            </SheetTrigger>
                            <Image
                                src={`/archerbytes-main.webp`}
                                width={86}
                                height={50}
                                alt="Archerbytes logo"
                            ></Image>
                        </div>

                        {!session ? (
                            <>
                                <Button className="bg-secondary relative p-4 border border-2 border-neutral-950">
                                    <p className="font-bold text-neutral-50 text-outline-black">
                                        Get Started
                                    </p>
                                    <p className="font-bold text-neutral-50 absolute inset-0 top-[6px]">
                                        Get Started
                                    </p>
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="flex gap-3 items-center">
                                    <Button className="bg-secondary relative p-0 border border-2 border-neutral-950">
                                        <HiOutlinePencilAlt className="text-neutral-950 size-6" />
                                    </Button>
                                    <Image
                                        src={user?.image || '/globe.svg'}
                                        width={128}
                                        height={128}
                                        className="rounded-full size-8"
                                        alt="User image"
                                    ></Image>
                                </div>
                            </>
                        )}
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
                            <p>About ArcherBytes</p>
                        </div>
                        <SheetTitle></SheetTitle>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
            {login === true ? (
                <div
                    className="flex size-full absolute top-0 bg-neutral-500/50 backdrop-blur-xs justify-center items-center z-50 transition-all duration-150"
                    onClick={() => setLogin(false)}
                >
                    <Login />
                </div>
            ) : (
                <></>
            )}
        </>
    );
}

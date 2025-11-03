'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

export default function PrivacyPolicy() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent className="rounded-0 border-none">
                <div className="flex flex-col w-full bg-background text-neutral-50 py-8 px-5 md:px-20 z-100">
                    <div className="flex flex-col gap-3 justify-center md:items-center w-fit max-w-100">
                        <p className="text-xs md:text-base ">
                            By continuing to browse this site, you agree to our use of cookies
                            and our Privacy Policy.
                        </p>
                        <div className="flex gap-[15px] w-full md:text-base">
                            <DrawerClose>
                                <Button className="bg-neutral-50 text-xs md:text-base text-neutral-950 grow">
                                    I agree
                                </Button>
                            </DrawerClose>
                            <DrawerClose>
                                <Button className="bg-neutral-50 text-xs md:text-base text-neutral-950 grow">
                                    I don&apos;t agree
                                </Button>
                            </DrawerClose>
                            <DrawerClose>
                                <Button className="bg-neutral-50 text-xs md:text-base text-neutral-950 grow">
                                    Customize cookies
                                </Button>
                            </DrawerClose>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

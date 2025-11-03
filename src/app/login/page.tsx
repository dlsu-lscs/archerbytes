import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex items-center grow w-full bg-[url(/archerbytes-bg.png)] bg-cover bg-position-[66%_-10px]">
            <div className="flex grow lg:grow-0 text-center lg:text-left justify-center basis-full lg:basis-1/2">
                <div className="flex flex-col items-center lg:items-start md:gap-5 gap-2 max-w-75 md:max-w-133 relative z-10">
                    <div className="relative">
                        <h1 className="font-black md:text-6xl text-3xl text-primary text-outline-white">
                            Find exactly what you need. Leave no byte behind.
                        </h1>
                        <h1 className="font-black md:text-6xl text-3xl text-primary absolute inset-0">
                            Find exactly what you need. Leave no byte behind.
                        </h1>
                    </div>
                    <div>
                        <p className="hidden md:block font-bold md:text-2xl  ">
                            Search easier, one byte at a time
                        </p>
                        <p className="md:hidden font-bold text-md">
                            Search and leave no byte.
                        </p>
                    </div>
                    <Link href={'/'}>
                        <Button className="px-8 md:px-10 py-2 md:py-5 w-fit text-md relative border border-2 border-neutral-950 hover:bg-primary/100 hover:bg-secondary">
                            <p className="text-neutral-50 relative text-outline-black">
                                Start Reading
                            </p>
                            <p className="text-neutral-50 absolute inset-0 top-[4px] md:top-[8px]">
                                Start Reading
                            </p>
                            <div className="absolute size-full box-content p-[2px] bg-neutral-950 -z-10 top-1 left-1 rounded-md"></div>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

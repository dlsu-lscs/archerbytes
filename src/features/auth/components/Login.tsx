import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Login() {
    return (
        <div className="flex size-full absolute top-0 bg-neutral-500/50 justify-center items-center">
            <div className="flex flex-col items-center bg-neutral-50 rounded-xl py-16 px-28 gap-[30px]">
                <div className="flex flex-col items-center gap-[20px]">
                    {/* logo and title */}
                    <div className="size-10 bg-neutral-400"></div>
                    <h3 className="text-2xl text-center">
                        Discover the archer&apos;s way.
                    </h3>
                </div>
                <div className="flex flex-col items-center gap-[10px]">
                    {/* buttons */}
                    <Button className="bg-neutral-300 rounded-full px-26 py-5"></Button>
                    <Button className="bg-neutral-300 rounded-full px-26 py-5"></Button>
                    <Button className="bg-neutral-300 rounded-full px-26 py-5"></Button>
                </div>
                <div className="flex flex-col items-center">
                    {/* sign in */}
                    <p className="text-neutral-600">
                        Already have an account? <Link href="/">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

// import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { signInWithGoogle } from '@/lib/util/auth/client-actions';

export default function Login() {
    return (
        <div className="flex flex-col items-center bg-secondary border border-3 border-black rounded-xl py-10 md:py-16 md:px-22 px-8 gap-[30px]">
            <div className="flex flex-col items-center gap-[20px]">
                {/* logo and title */}
                <Image
                    src={`/archerbytes-main.webp`}
                    width={80}
                    height={42}
                    alt="Archerbytes logo"
                ></Image>
                <h3 className="text-lg md:text-2xl text-neutral-950 font-medium text-center">
                    Discover the archer&apos;s way.
                </h3>
            </div>
            <div className="flex flex-col items-center gap-[10px]">
                {/* buttons */}
                <Button
                    className="text-neutral-950 bg-neutral-50 border-2 border-solid border-neutral-950 rounded-full md:px-26 px-8 py-5 "
                    onClick={() => signInWithGoogle()}
                >
                    Sign up with Google
                </Button>
            </div>
            <div className="flex flex-col items-center">
                {/* sign in */}
                <p className="text-sm text-neutral-600">
                    Already have an account?{' '}
                    <span
                        className="cursor-pointer underline"
                        onClick={() => signInWithGoogle()}
                    >
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
}

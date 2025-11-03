import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="flex flex-col w-full md:items-center bg-background text-neutral-50 py-6 px-5 z-100">
            <div className="flex flex-col gap-2 justify-center md:items-center w-fit">
                <Image
                    src={`/archerbytes-main.webp`}
                    width={86}
                    height={50}
                    alt="Archerbytes logo"
                ></Image>
                <div className="flex gap-[15px] text-xs md:text-base">
                    <p>FAQs</p>
                    <p>Contacts</p>
                    <p>About</p>
                    <p>Help</p>
                </div>
                <p className="text-xs md:text-base">All rights reserved.</p>
            </div>
        </footer>
    );
}

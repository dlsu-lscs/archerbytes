import Link from 'next/link';
import DesignedButton from '@/components/atoms/DesignedButton';

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
            <DesignedButton label={'Start Reading'} className={'w-fit'} />
          </Link>
        </div>
      </div>
    </div>
  );
}

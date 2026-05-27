import { Button } from '@/components/ui/button';

export default function ProfileForm() {
  return (
    <div className='flex flex-col gap-5 items-center md:items-start p-6'>
      <div className="bg-neutral-300 size-60 md:size-80 rounded-full border-4 border-black ring-offset-[7px] ring-offset-primary ring-1 ring-black"></div>

      <div className='flex flex-col gap-2'>
        <p className='text-[#25609F] font-bold text-5xl'>Sample Name</p>
        <p className='text-gray-500 font-normal text-4xl'>Username - Pronouns</p>
        <p className='mt-3'>Description - Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas repellat magni tempore est? Itaque, atque. A vitae, laboriosam ab fugit ullam, totam libero voluptatibus, eius optio dicta perspiciatis modi distinctio molestiae quos tempore quam facilis sunt at deserunt quisquam sed! Sed optio maxime asperiores dolorem quasi! Commodi consequuntur aspernatur totam.</p>
      </div>

      <div className="relative z-10 w-full md:w-4/5">
        <Button className="px-8 md:px-10 py-5 md:py-6 w-full text-md relative border-2 border-neutral-950 hover:bg-primary/100 hover:bg-secondary">
          <span className="text-neutral-50 relative text-outline-black">
            Edit Profile
          </span>
          <span className="text-neutral-50 absolute inset-0 flex items-center justify-center pointer-events-none">
            Edit Profile
          </span>
          <div className="absolute size-full box-content p-0.5 bg-neutral-950 -z-10 top-1 left-1 rounded-md"></div>
        </Button>
      </div>
    </div>
  );
};
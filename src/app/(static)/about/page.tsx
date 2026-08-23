import Image from 'next/image';

export const metadata = {
  title: 'About',
  description:
    'ArcherBytes is the centralized knowledge hub for the DLSU College of Computer Studies community.',
};

{/*what we offer content*/}
const offerings = [
  {
    number: '01',
    title: 'Academic Guidance',
    description:
      'Proper overviews of core CCS subjects, such as the CCPROG series and CCINFOM, here to help you prepare with confidence!',
  },

  {
    number: '02',
    title: 'Professional Development',
    description:
      'Clear guidance through internship and OJT requirements: So you always know what comes next.',
  },

  {
    number: '03',
    title: 'Campus Engagement',
    description:
      'A growing database of CCS organizations and research labs to help you find your community and your niche!',
  },
];

{/*who its for content*/}
const audiences = [
  {
    title: 'The Worried Frosh',
    description:
      'Searching "CCPROG1" at 2am? There\u2019s an ArcherBytes article walking you through exactly what to expect.',
  },


  {
    title: 'BS Org Enthusiasts',
    description:
      'Looking up a specific org by name? Find it in our organization database instead of piecing it together from scattered posts.',
  },


  {
    title: 'The Researcher',
    description:
      'Trying to figure out which lab to join and how? We break down CCS labs so you can plan ahead.',
  },


  {
    title: 'The soon-to-be Intern',
    description:
      'Unsure how OJT requirements even work? We lay out the internship process step by step.',
  },
];

{/*page proper!!*/}

export default function AboutArcherBytesPage() {
  return (
    <div className="flex flex-col grow bg-white text-[#2F2F2F]">
      {/*hero + the logo*/}
      <section className="flex flex-col items-center text-center gap-4 px-5 md:px-20 py-14 md:py-20">
        <Image
          src="/archerbytes-main.webp"
          width={120}
          height={70}
          alt="ArcherBytes logo"
          className="w-auto h-16 object-contain"
        />

        <p className="text-base md:text-lg font-bold uppercase tracking-[0.2em] text-[#7A7878]">
          About ArcherBytes
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold max-w-4xl text-[#3D7BBF] underline decoration-4 underline-offset-8">
          The one stop hub for all things CCS!
        </h1>

        <p className="text-lg md:text-xl italic font-medium max-w-2xl text-[#5A5A5A] mt-2">
          A Zeal for Service initiative by the La Salle Computer Science
          Society, built to close the information gap for DLSU College of
          Computer Studies students.
        </p>
      </section>

      <div className="mx-5 md:mx-20 border-t-2 border-[#2F2F2F]/10" />

      {/*mission*/}
      <section className="flex flex-col items-center text-center gap-3 px-5 md:px-20 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D7BBF]">
          Our Mission
        </h2>

        <p className="text-lg md:text-xl font-medium text-[#2F2F2F] max-w-3xl">
          Academic life is no scavenger hunt. We believe
          navigating it should be accessible, transparent, and collaborative
          Our mission is to curate clear, high-quality answers to the questions every
          CCS student ends up Googling anyway, from tricky subjects to
          internship paperwork.
        </p>
      </section>

      <div className="mx-5 md:mx-20 border-t-2 border-[#2F2F2F]/10" />

      {/*what we offer*/}
      <section className="flex flex-col items-center text-center gap-8 px-5 md:px-20 py-12">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D7BBF]">
            What Archerbytes has in store for you!
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
          {offerings.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-[#2F2F2F] bg-[#FCDF46]/10 p-6 shadow-[4px_4px_0_0_#2F2F2F] h-full"
            >
              <span className="text-sm font-extrabold tracking-widest text-[#FCDF46] bg-[#2F2F2F] rounded-full w-8 h-8 flex items-center justify-center">
                {item.number}
              </span>
              <h3 className="font-extrabold text-xl text-[#3D7BBF]">
                {item.title}
              </h3>
              <p className="text-lg font-medium text-[#2F2F2F]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-5 md:mx-20 border-t-2 border-[#2F2F2F]/10" />

      {/*who it's for*/}
      <section className="flex flex-col items-center text-center gap-8 px-5 md:px-20 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D7BBF]">
          Who It&apos;s For
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="flex flex-col gap-2 rounded-2xl border-2 border-[#2F2F2F] bg-white p-6 shadow-[4px_4px_0_0_#2F2F2F] text-left h-full"
            >
              <h3 className="font-extrabold text-xl text-[#3D7BBF]">
                {audience.title}
              </h3>
              <p className="text-lg font-medium text-[#2F2F2F]">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-5 md:mx-20 border-t-2 border-[#2F2F2F]/10" />

      {/*community driven part*/}
      <section className="flex flex-col items-center text-center gap-3 px-5 md:px-20 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D7BBF]">
          A Community-Driven Platform
        </h2>

        <p className="text-lg md:text-xl font-medium text-[#2F2F2F] max-w-3xl">
          
          <span className="italic">
            Beyond the library of articles and services it offers, Archerbytes is a platform that drives Lasallians together to  help each other. {' '}
          </span>
        </p>
      </section>
    </div>
  );
}




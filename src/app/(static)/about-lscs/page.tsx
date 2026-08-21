import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About La Salle Computer Society (LSCS)',
  description:
    'Get to know more about the La Salle Computer Society, the organization behind Archerbytes!',
};

{/*core value content*/}
const coreValues = [
  {
    number: '01',
    title: 'Purpose',
    description:
      'Understanding the reason behind every act, decision, and endeavor pursued.',
  },

  {
    number: '02',
    title: 'Process',
    description:
      'Organizing and overseeing every project so it moves deliberately toward its purpose.',
  },

  {
    number: '03',
    title: 'Excellence',
    description:
      'Accomplishing goals in the best way possible, in line with LSCS and DLSU ideals.',
  },
];

{/*page proper!!*/}

export default function AboutLSCSPage() {
  return (
    <div className="flex flex-col grow bg-white text-[#2F2F2F]">
      {/*hero and logo*/}
      <section className="flex flex-col items-center text-center gap-4 px-5 md:px-20 py-14 md:py-20">
        <Image
          src="/lscs-logo.png"
          width={96}
          height={96}
          alt="La Salle Computer Society logo"
          className="h-24 w-24 object-contain"
        />

        <p className="text-base md:text-lg font-bold uppercase tracking-[0.2em] text-[#7A7878]">
          About LSCS
        </p>

        <h1 className="text-5xl md:text-7xl font-extrabold max-w-4xl text-[#3D7BBF] underline decoration-4 underline-offset-8">
          The La Salle Computer Society
        </h1>

        <p className="text-lg md:text-xl italic font-medium max-w-2xl text-[#5A5A5A] mt-2">
          LSCS, the organization behind Archerbytes, is the pioneering
          student org of De La Salle University&apos;s College of Computer
          Studies, continuing to serve the Lasallian community as it enters
          its 41st year.
        </p>
      </section>

      <div className="mx-5 md:mx-20 border-t-2 border-[#2F2F2F]/10" />

      {/*LSCS activities*/}
      <section className="flex flex-col items-center text-center gap-3 px-5 md:px-20 py-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D7BBF]">
          What We Do
        </h2>

        <p className="text-lg md:text-xl font-medium text-[#2F2F2F] max-w-3xl">
          LSCS runs activities, events, and projects for the College of
          Computer Studies, the wider student body, and even the broader
          computer science community; ranging from academic workshops, career
          seminars, training programs, hackathons and contests, and
          socio-civic initiatives.
        </p>
      </section>

      {/*Vision/Mission section*/}
      <section className="flex flex-col px-5 md:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-6">
          <div className="flex flex-col gap-2 rounded-2xl border-2 border-[#2F2F2F] bg-white p-7 shadow-[4px_4px_0_0_#2F2F2F] text-center md:text-left h-full">
            <p className="text-sm font-bold italic uppercase tracking-wide text-[#7A7878]">
              Where we&apos;re headed
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D7BBF]">
              Vision
            </h2>

            <p className="text-lg md:text-xl font-medium text-[#2F2F2F]">
              To be the organization that molds its members academically,
              socially, and spiritually into competent Lasallians and
              well-rounded individuals, and to stand as the pioneering
              student organization that represents the College of Computer
              Studies and expertise in computer science.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border-2 border-[#2F2F2F] bg-white p-7 shadow-[4px_4px_0_0_#2F2F2F] text-center md:text-left h-full">
            <p className="text-sm font-bold italic uppercase tracking-wide text-[#7A7878]">
              How we get there
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D7BBF]">
              Mission
            </h2>

            <p className="text-lg md:text-xl font-medium text-[#2F2F2F]">
              To provide quality assistance and activities that develop
              members academically, socially and spiritually into
              competent, well-rounded Lasallians.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-5 md:mx-20 border-t-2 border-[#2F2F2F]/10" />

      {/*Core values section*/}
      <section className="flex flex-col items-center text-center gap-8 px-5 md:px-20 py-12">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#3D7BBF]">
            Our Core Values
          </h2>
          <p className="text-base md:text-lg italic font-medium text-[#7A7878] max-w-xl">
            The three-step throughline behind everything LSCS builds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-5xl">
          {coreValues.map((value) => (
            <div
              key={value.title}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-[#2F2F2F] bg-[#FCDF46]/10 p-6 shadow-[4px_4px_0_0_#2F2F2F] h-full"
            >
              <span className="text-sm font-extrabold tracking-widest text-[#FCDF46] bg-[#2F2F2F] rounded-full w-8 h-8 flex items-center justify-center">
                {value.number}
              </span>
              <h3 className="font-extrabold text-xl text-[#3D7BBF]">
                {value.title}
              </h3>
              <p className="text-lg font-medium text-[#2F2F2F]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-5 md:mx-20 border-t-2 border-[#2F2F2F]/10" />

      {/*LSCS + CSO accreditation thing*/}
      <section className="flex flex-col items-center text-center gap-3 px-5 md:px-20 py-12">
        <p className="text-lg md:text-xl font-medium text-[#2F2F2F] max-w-3xl">
          <span className="italic">LSCS is one of 42 accredited organizations under the Council of
          Student Organizations (CSO), and is part of ONECCS, the College of
          Computer Studies student council.</span>
        </p>
      </section>

      {/*Links to LSCS website!*/}
      <section className="flex flex-col items-center text-center gap-4 px-5 md:px-20 py-16">
        <p className="text-base md:text-lg italic font-medium text-[#7A7878]">
          Want to learn more?
        </p>

        <Link
          href="https://dlsu-lscs.org/about-us"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center rounded-full border-2 border-[#2F2F2F] bg-[#FCDF46] px-8 py-3 text-lg md:text-xl font-extrabold text-[#2F2F2F] transition-colors hover:bg-[#3D7BBF] hover:text-white"
        >
          Visit the LSCS website!
        </Link>
      </section>
    </div>
  );
}
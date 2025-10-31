import Image from 'next/image';

type PhotoType = {
    source: string;
};

export default function Photo({ source }: PhotoType) {
    return (
        <Image
            className="rounded-xl "
            src={source}
            width={1600}
            height={900}
            alt={'Template Image'}
        />
    );
}

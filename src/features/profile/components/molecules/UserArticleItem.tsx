import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import IconGroup from "@/features/landing/components/atoms/IconGroup";

export default function UserArticleItem() {
  return (
    <Card className="flex flex-col gap-0 border-0 shadow-none rounded-none py-2 bg-transparent">
      <div className="flex items-center gap-5 md:gap-7">
        <Image
          className="hidden md:block w-48 aspect-video shrink-0 rounded-xl object-cover"
          height={480}
          width={854}
          src={'/image.jpg'}
          alt="Preview"
        />

        <CardContent className="flex flex-col gap-2 p-0 w-full">
          <div>
            <h5 className="font-bold">Article Title</h5>
            <p className="text-sm text-gray-600">Article Subtitle</p>
          </div>
          <IconGroup
            date={new Date}
            reactions={1}
            comments={1}
          />
        </CardContent>
      </div>
    </Card>
  )
}
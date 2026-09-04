"use client"

import { qna } from "../../../data/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Sidebar from '@/components/organisms/Sidebar';
import RelatedSidebar from '@/components/organisms/RelatedSidebar';


import Link from "next/link";

export default function FAQPage() {
    return(
        <div className="flex flex-col grow bg-white text-[#2F2F2F]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] justify-center grow py-10 bg-neutral-50">
                <div className="hidden lg:flex justify-end">
                    <Sidebar/>
                </div>
                <main className="flex flex-col gap-5 px-10">
                    <h1 className="mt-3 text-5xl text-black font-bold">Frequently Asked Questions</h1>
                    {/*Dummy FAQs*/}
                    <Accordion type="single" collapsible className="rounded-xl border bg-white px-4 shadow-sm">
                        {qna.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className = "cursor-pointer hover:no-underline"> 
                                    {item.question}
                                </AccordionTrigger>
                            
                                <AccordionContent>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </main>
                <div className="hidden lg:block grow">
                    <RelatedSidebar />
                </div>
            </div>
        </div>  
    );
}

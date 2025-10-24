import React from "react";
import { FlipWords } from "@/src/components/ui/flip-words";

export function FlipWordsDemo({ flipWords }: { flipWords: string[] }) {
    //   const words = ["better", "cute", "beautiful", "modern"];
    const words = [...flipWords]

    return (<div>
        What Should I Eat for<FlipWords words={words} />?
    </div>

        // <div className="h-[40rem] flex justify-center items-center px-4">
        //   <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
        //     <FlipWords words={words} /> <br />
        //   </div>
        // </div>
    );
}

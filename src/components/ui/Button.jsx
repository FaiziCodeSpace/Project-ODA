import { ArrowUpRight } from 'lucide-react';

export default function Button({ content }) {
    return (
        <div className="flex items-center font-founders font-medium justify-center leading-none w-fit bg-[#161616] gap-2.5 text-[18px] text-white rounded-[4px] px-[71px] py-[22px] text-nowrap uppercase">
            <h1 className="text-center translate-y-[3px]">{content}</h1>
            <ArrowUpRight />
        </div>
    );
}
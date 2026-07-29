import { ArrowUpRight  } from 'lucide-react';

export default function Button({ content }) {
    return (<div className="flex bg-[#161616] gap-2.5 text-[18px] font-medium text-white rounded-[4px] px-[50px] py-[20px] uppercase">
        {content}
        <ArrowUpRight  />
    </div>)
}
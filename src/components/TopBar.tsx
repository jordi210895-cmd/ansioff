'use client';

import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
    title: string;
    onBack: () => void;
    dark?: boolean;
}

export default function TopBar({ title, onBack, dark }: TopBarProps) {
    return (
        <div className="flex items-center gap-[14px] px-[24px] pt-[48px] pb-[20px] bg-[#03080f]/95 backdrop-blur-[24px] sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)]">
            <button
                onClick={onBack}
                className="w-[36px] h-[36px] rounded-[12px] flex items-center justify-center transition-all bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] hover:bg-[rgba(255,255,255,0.07)] active:scale-[0.95] text-[#ddeef5]"
            >
                <ArrowLeft size={18} strokeWidth={2} />
            </button>
            <h1 className="text-[20px] font-medium text-[#ddeef5] font-serif leading-none" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>
                {title}
            </h1>
        </div>
    );
}


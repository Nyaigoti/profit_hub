interface LastDigitsChartProps {
    digits: number[];
}

export function LastDigitsChart({ digits }: LastDigitsChartProps) {
    const displayDigits = digits.slice(-20);

    const digitColors: Record<number, string> = {
        0: 'bg-gradient-to-br from-pink-400 to-pink-500',
        1: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
        2: 'bg-gradient-to-br from-cyan-400 to-cyan-500',
        3: 'bg-gradient-to-br from-fuchsia-400 to-fuchsia-500',
        4: 'bg-gradient-to-br from-teal-400 to-teal-500',
        5: 'bg-gradient-to-br from-blue-500 to-blue-600',
        6: 'bg-gradient-to-br from-rose-400 to-rose-500',
        7: 'bg-gradient-to-br from-violet-400 to-violet-500',
        8: 'bg-gradient-to-br from-yellow-400 to-amber-500',
        9: 'bg-gradient-to-br from-purple-500 to-purple-600',
    };

    return (
        <div className='w-full overflow-x-auto pb-4'>
            <div className='flex items-center gap-3 min-w-max px-2'>
                {displayDigits.map((digit, index) => (
                    <div
                        key={index}
                        className={`w-12 h-12 sm:w-14 sm:h-14 ${digitColors[digit]} rounded-lg flex items-center justify-center shadow-lg shrink-0`}
                    >
                        <span className='text-xl sm:text-2xl font-bold text-white'>{digit}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

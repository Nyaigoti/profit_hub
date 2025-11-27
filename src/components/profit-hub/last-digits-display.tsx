interface LastDigitsDisplayProps {
    digits: number[];
    currentDigit: number | null;
    mode: 'even-odd' | 'over-under' | 'match-diff';
    theme?: 'light' | 'dark';
}

export function LastDigitsDisplay({ digits, mode }: LastDigitsDisplayProps) {
    const displayDigits = digits.slice(-40);

    const getDigitColor = (digit: number) => {
        if (mode === 'even-odd') {
            if (digit % 2 === 0) return 'bg-blue-500'; // Even
            return 'bg-pink-500'; // Odd
        }
        if (mode === 'over-under') {
            if (digit <= 4) return 'bg-blue-500'; // Under
            return 'bg-green-500'; // Over
        }
        return 'bg-gray-500';
    };

    return (
        <div className='flex flex-wrap gap-2 justify-center'>
            {displayDigits.map((digit, index) => (
                <div
                    key={index}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getDigitColor(digit)} ${
                        index === displayDigits.length - 1 ? 'ring-2 ring-white ring-offset-2 ring-offset-black' : ''
                    }`}
                >
                    {digit}
                </div>
            ))}
        </div>
    );
}

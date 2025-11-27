import { type AnalysisResult } from '@/lib/analysis-engine';

interface DigitDistributionProps {
    frequencies: AnalysisResult['digitFrequencies'];
    // currentDigit: number | null;
    // theme: 'light' | 'dark';
}

export function DigitDistribution({ frequencies }: DigitDistributionProps) {
    return (
        <div className='analysis__digit-grid'>
            {frequencies.map(freq => (
                <div key={freq.digit} className='analysis__digit-card'>
                    <div className='analysis__digit-number'>{freq.digit}</div>
                    <div className='analysis__digit-count'>{freq.count}</div>
                    <div className='analysis__digit-percentage'>{freq.percentage.toFixed(1)}%</div>
                    <div className='analysis__digit-bar' style={{ width: `${Math.min(freq.percentage * 2, 100)}%` }} />
                </div>
            ))}
        </div>
    );
}

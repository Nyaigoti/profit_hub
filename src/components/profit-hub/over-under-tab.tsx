import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import type { AnalysisResult, Signal } from '@/lib/analysis-engine';

interface OverUnderTabProps {
    analysis: AnalysisResult | null;
    signals: Signal[];
    currentDigit: number | null;
    currentPrice: number | null;
    recentDigits: number[];
    theme?: 'light' | 'dark';
}

export function OverUnderTab({
    analysis,
    currentDigit,
    currentPrice,
    recentDigits,
    // theme = 'dark',
}: OverUnderTabProps) {
    const [hasError, setHasError] = useState(false);
    const [tradeTimer, setTradeTimer] = useState<number>(0);

    useEffect(() => {
        try {
            if (!analysis) {
                console.log('[v0] Over/Under waiting for analysis data');
            }
        } catch (error) {
            console.error('[v0] Error in Over/Under tab:', error);
            setHasError(true);
        }
    }, [analysis]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (tradeTimer > 0) {
            interval = setInterval(() => {
                setTradeTimer(prev => (prev > 1 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [tradeTimer]);

    if (hasError) return <div className='analysis__no-signals'>Error loading tab.</div>;
    if (!analysis || !recentDigits || recentDigits.length === 0)
        return <div className='analysis__no-signals'>Loading analysis...</div>;

    // const last100Digits = recentDigits.slice(Math.max(0, recentDigits.length - 100));
    const last10Digits = recentDigits.slice(Math.max(0, recentDigits.length - 10));

    const underCount10 = last10Digits.filter(d => d >= 0 && d <= 4).length;
    const overCount10 = last10Digits.filter(d => d >= 5 && d <= 9).length;
    const underPercent10 = last10Digits.length > 0 ? (underCount10 / last10Digits.length) * 100 : 50;
    const overPercent10 = last10Digits.length > 0 ? (overCount10 / last10Digits.length) * 100 : 50;

    const maxPercentage = Math.max(underPercent10, overPercent10);
    const favored = underPercent10 > overPercent10 ? 'under' : 'over';

    let signalStatus: 'TRADE NOW' | 'WAIT' | 'NEUTRAL' = 'NEUTRAL';
    let signalMessage = '';

    if (maxPercentage >= 60) {
        signalStatus = 'TRADE NOW';
        signalMessage = `STRONG ${favored.toUpperCase()} signal at ${maxPercentage.toFixed(1)}%`;
        if (tradeTimer === 0) setTradeTimer(60);
    } else if (maxPercentage >= 53) {
        signalStatus = 'WAIT';
        signalMessage = `${favored.toUpperCase()} building power at ${maxPercentage.toFixed(1)}%`;
    } else {
        signalStatus = 'NEUTRAL';
        signalMessage = 'No clear direction';
    }

    return (
        <div className='space-y-6'>
            <div className='analysis__price-display'>
                <div className='analysis__price-card'>
                    <div className='analysis__price-label'>Current Price</div>
                    <div className='analysis__price-value'>{currentPrice?.toFixed(5) || '---'}</div>
                </div>
                <div className='analysis__digit-card-main'>
                    <div className='analysis__digit-label'>Current Digit</div>
                    <div className='analysis__digit-value'>{currentDigit !== null ? currentDigit : '-'}</div>
                </div>
            </div>

            <div
                className={`analysis__signal-card analysis__signal-card--${signalStatus === 'TRADE NOW' ? 'trade' : signalStatus === 'WAIT' ? 'wait' : 'neutral'}`}
            >
                <div className='text-center mb-8'>
                    <h2 className='analysis__section-title'>OVER vs UNDER</h2>
                    <span className='analysis__signal-status'>
                        {signalStatus} {tradeTimer > 0 && `(${tradeTimer}s)`}
                    </span>
                </div>

                <div className='text-center mb-8'>
                    <h3 className='analysis__signal-recommendation'>{signalMessage}</h3>
                </div>

                <div className='analysis__content'>
                    <div className='analysis__digit-card'>
                        <div className='analysis__digit-number' style={{ color: '#3b82f6' }}>
                            {underPercent10.toFixed(1)}%
                        </div>
                        <div className='analysis__digit-percentage'>UNDER (0-4)</div>
                        <div className='analysis__digit-count'>Last 10 Ticks</div>
                        <div
                            className='analysis__digit-bar'
                            style={{ width: `${Math.min(underPercent10, 100)}%`, background: '#3b82f6' }}
                        ></div>
                    </div>

                    <div className='analysis__digit-card'>
                        <div className='analysis__digit-number' style={{ color: '#4caf50' }}>
                            {overPercent10.toFixed(1)}%
                        </div>
                        <div className='analysis__digit-percentage'>OVER (5-9)</div>
                        <div className='analysis__digit-count'>Last 10 Ticks</div>
                        <div
                            className='analysis__digit-bar'
                            style={{ width: `${Math.min(overPercent10, 100)}%`, background: '#4caf50' }}
                        ></div>
                    </div>
                </div>

                {signalStatus === 'TRADE NOW' && (
                    <div className='mt-8'>
                        <Button
                            size='lg'
                            className='w-full bg-[#4caf50] hover:bg-[#43a047] text-white text-[1.6rem] font-bold py-8 rounded-lg'
                        >
                            TRADE {favored.toUpperCase()} NOW - {maxPercentage.toFixed(1)}%
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

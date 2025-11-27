import { useEffect, useState } from 'react';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AnalysisResult, Signal } from '@/lib/analysis-engine';
import { LastDigitsDisplay } from './last-digits-display';

interface EvenOddTabProps {
    analysis: AnalysisResult | null;
    signals: Signal[];
    currentDigit: number | null;
    currentPrice: number | null;
    recentDigits: number[];
    theme?: 'light' | 'dark';
}

export function EvenOddTab({
    analysis,
    // signals,
    currentDigit,
    currentPrice,
    recentDigits,
    theme = 'dark',
}: EvenOddTabProps) {
    const [tradeTimer, setTradeTimer] = useState<number>(0);
    // const [marketChanged, setMarketChanged] = useState(false)
    // const [powerTrend, setPowerTrend] = useState<'increasing' | 'decreasing' | 'stable'>('stable');
    // const last100Digits = recentDigits.slice(-100);
    // const last50Digits = recentDigits.slice(-50);
    // const last25Digits = recentDigits.slice(-25);
    const last10Digits = recentDigits.slice(-10);

    // const evenPercent100 = (last100Digits.filter(d => d % 2 === 0).length / Math.max(1, last100Digits.length)) * 100;
    // const oddPercent100 = (last100Digits.filter(d => d % 2 === 1).length / Math.max(1, last100Digits.length)) * 100;

    const evenPercent50 = (last50Digits.filter(d => d % 2 === 0).length / Math.max(1, last50Digits.length)) * 100;
    const oddPercent50 = (last50Digits.filter(d => d % 2 === 1).length / Math.max(1, last50Digits.length)) * 100;

    // const evenPercent25 = (last25Digits.filter(d => d % 2 === 0).length / Math.max(1, last25Digits.length)) * 100;
    // const oddPercent25 = (last25Digits.filter(d => d % 2 === 1).length / Math.max(1, last25Digits.length)) * 100;

    const evenPercent10 = (last10Digits.filter(d => d % 2 === 0).length / Math.max(1, last10Digits.length)) * 100;
    const oddPercent10 = (last10Digits.filter(d => d % 2 === 1).length / Math.max(1, last10Digits.length)) * 100;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (tradeTimer > 0) {
            interval = setInterval(() => {
                setTradeTimer(prev => (prev > 1 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [tradeTimer]);

    useEffect(() => {
        if (evenPercent10 > evenPercent50) {
            // setPowerTrend('increasing');
        } else if (evenPercent10 < evenPercent50) {
            // setPowerTrend('decreasing');
        } else {
            // setPowerTrend('stable');
        }
    }, [evenPercent10, evenPercent50]);

    if (!analysis) {
        return (
            <div className='analysis__no-signals'>
                <p>Loading analysis...</p>
            </div>
        );
    }

    const evenIncreasing = evenPercent10 > evenPercent50;
    const oddIncreasing = oddPercent10 > oddPercent50;
    const maxCurrent = Math.max(evenPercent10, oddPercent10);
    const dominantType = evenPercent10 > oddPercent10 ? 'EVEN' : 'ODD';

    let signalStatus: 'TRADE NOW' | 'WAIT' | 'NEUTRAL' = 'NEUTRAL';
    let signalMessage = '';
    let signalDescription = '';

    const isPowerIncreasing = (dominantType === 'EVEN' && evenIncreasing) || (dominantType === 'ODD' && oddIncreasing);

    if (maxCurrent >= 56 && isPowerIncreasing) {
        signalStatus = 'TRADE NOW';
        signalMessage = `${dominantType} at ${maxCurrent.toFixed(1)}% - POWERFUL SIGNAL`;
        signalDescription = `${dominantType} power is at ${maxCurrent.toFixed(1)}% and INCREASING. Market momentum is strong!`;
        if (tradeTimer === 0) setTradeTimer(120);
    } else if (maxCurrent >= 50 && isPowerIncreasing) {
        signalStatus = 'WAIT';
        signalMessage = `${dominantType} at ${maxCurrent.toFixed(1)}% - Building Power`;
        signalDescription = `${dominantType} power reaching threshold. Watch for confirmation to reach 56%+.`;
    } else {
        signalStatus = 'NEUTRAL';
        signalMessage = 'Analyzing market patterns';
        signalDescription = 'Waiting for either EVEN or ODD to reach 50%+ with increasing power.';
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
                    <h2 className='analysis__section-title'>EVEN vs ODD</h2>
                    <span className='analysis__signal-status'>
                        {signalStatus} {tradeTimer > 0 && `(${tradeTimer}s)`}
                    </span>
                </div>

                <div className='text-center mb-8'>
                    <h3 className='analysis__signal-recommendation'>{signalMessage}</h3>
                    <p className='analysis__signal-entry'>{signalDescription}</p>
                </div>

                <div className='analysis__content'>
                    <div className='analysis__digit-card'>
                        <div
                            className='analysis__digit-number'
                            style={{ color: evenIncreasing ? '#4caf50' : '#f44336' }}
                        >
                            {evenPercent10.toFixed(1)}%
                        </div>
                        <div className='analysis__digit-percentage'>EVEN</div>
                        <div className='analysis__digit-count'>Last 10 Ticks</div>
                        <div
                            className='analysis__digit-bar'
                            style={{ width: `${Math.min(evenPercent10, 100)}%`, background: '#3b82f6' }}
                        ></div>
                    </div>

                    <div className='analysis__digit-card'>
                        <div
                            className='analysis__digit-number'
                            style={{ color: oddIncreasing ? '#4caf50' : '#f44336' }}
                        >
                            {oddPercent10.toFixed(1)}%
                        </div>
                        <div className='analysis__digit-percentage'>ODD</div>
                        <div className='analysis__digit-count'>Last 10 Ticks</div>
                        <div
                            className='analysis__digit-bar'
                            style={{ width: `${Math.min(oddPercent10, 100)}%`, background: '#ec4899' }}
                        ></div>
                    </div>
                </div>

                {signalStatus === 'TRADE NOW' && (
                    <div className='mt-8'>
                        <Button
                            size='lg'
                            className='w-full bg-[#4caf50] hover:bg-[#43a047] text-white text-[1.6rem] font-bold py-8 rounded-lg'
                        >
                            TRADE {dominantType} NOW - {maxCurrent.toFixed(1)}%
                        </Button>
                    </div>
                )}
            </div>

            {recentDigits.length > 0 && (
                <div className='analysis__digit-frequencies'>
                    <h3 className='analysis__section-title'>Last 40 Digits</h3>
                    <LastDigitsDisplay
                        digits={recentDigits}
                        currentDigit={currentDigit}
                        mode='even-odd'
                        theme={theme}
                    />
                </div>
            )}
        </div>
    );
}

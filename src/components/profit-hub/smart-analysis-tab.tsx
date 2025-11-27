import type { AnalysisResult, Signal } from '@/lib/analysis-engine';
import { DigitDistribution } from './digit-distribution';
import { LastDigitsLineChart } from './last-digits-line-chart';

interface SmartAnalysisTabProps {
    analysis: AnalysisResult | null;
    signals?: Signal[];
    currentDigit: number | null;
    currentPrice: number | null;
    recentDigits: number[];
    recent100Digits: number[];
    theme?: 'light' | 'dark';
}

export function SmartAnalysisTab({
    analysis,
    currentDigit,
    currentPrice,
    recentDigits = [],
    recent100Digits = [],
    theme = 'dark',
}: SmartAnalysisTabProps) {
    // Calculate Frequency Analysis (Dominant/Weakest)
    const sortedFrequencies = analysis ? [...analysis.digitFrequencies].sort((a, b) => b.count - a.count) : [];
    const dominantDigit = sortedFrequencies.length > 0 ? sortedFrequencies[0] : null;
    const weakestDigit = sortedFrequencies.length > 0 ? sortedFrequencies[sortedFrequencies.length - 1] : null;

    return (
        <div className='space-y-6'>
            {/* Price Display Section */}
            <div className='analysis__price-display'>
                <div className='analysis__price-card'>
                    <div className='analysis__price-label'>Current Price</div>
                    <div className='analysis__price-value'>{currentPrice?.toFixed(5) || '---'}</div>
                </div>
                <div className='analysis__digit-card-main'>
                    <div className='analysis__digit-label'>Last Digit</div>
                    <div className='analysis__digit-value'>{currentDigit !== null ? currentDigit : '-'}</div>
                </div>
                {analysis && (
                    <div className='analysis__tick-card'>
                        <div className='analysis__tick-label'>Tick Count</div>
                        <div className='analysis__tick-value'>{analysis.totalTicks || 0}</div>
                    </div>
                )}
            </div>

            {/* Stats Section */}
            {analysis && (
                <div className='analysis__stats'>
                    <div className='analysis__stat-card'>
                        <div className='analysis__stat-label'>Even</div>
                        <div className='analysis__stat-value'>{analysis.evenPercentage.toFixed(1)}%</div>
                        <div className='analysis__stat-count'>({analysis.evenCount})</div>
                    </div>
                    <div className='analysis__stat-card'>
                        <div className='analysis__stat-label'>Odd</div>
                        <div className='analysis__stat-value'>{analysis.oddPercentage.toFixed(1)}%</div>
                        <div className='analysis__stat-count'>({analysis.oddCount})</div>
                    </div>
                    <div className='analysis__stat-card'>
                        <div className='analysis__stat-label'>Over 4.5</div>
                        <div className='analysis__stat-value'>{analysis.highPercentage.toFixed(1)}%</div>
                        <div className='analysis__stat-count'>({analysis.highCount})</div>
                    </div>
                    <div className='analysis__stat-card'>
                        <div className='analysis__stat-label'>Under 4.5</div>
                        <div className='analysis__stat-value'>{analysis.lowPercentage.toFixed(1)}%</div>
                        <div className='analysis__stat-count'>({analysis.lowCount})</div>
                    </div>
                </div>
            )}

            {/* Frequency Analysis Section (New) */}
            {analysis && dominantDigit && weakestDigit && (
                <div className='analysis__stats'>
                    <div className='analysis__stat-card' style={{ borderColor: 'var(--brand-blue)' }}>
                        <div className='analysis__stat-label' style={{ color: 'var(--brand-blue)' }}>
                            Dominant Digit
                        </div>
                        <div className='analysis__stat-value'>{dominantDigit.digit}</div>
                        <div className='analysis__stat-count'>({dominantDigit.percentage.toFixed(1)}%)</div>
                    </div>
                    <div className='analysis__stat-card' style={{ borderColor: '#f44336' }}>
                        <div className='analysis__stat-label' style={{ color: '#f44336' }}>
                            Weakest Digit
                        </div>
                        <div className='analysis__stat-value'>{weakestDigit.digit}</div>
                        <div className='analysis__stat-count'>({weakestDigit.percentage.toFixed(1)}%)</div>
                    </div>
                </div>
            )}

            <div className='analysis__content'>
                <div className='analysis__column'>
                    {analysis && analysis.digitFrequencies && (
                        <div className='analysis__digit-frequencies'>
                            <h3 className='analysis__section-title'>Digit Distribution</h3>
                            <DigitDistribution
                                frequencies={analysis.digitFrequencies}
                                currentDigit={currentDigit}
                                theme={theme}
                            />
                        </div>
                    )}
                </div>

                <div className='analysis__column'>
                    {analysis && recent100Digits.length > 0 && recentDigits.length > 0 && (
                        <div className='analysis__digit-frequencies'>
                            <h3 className='analysis__section-title'>Trend Analysis (Last 10)</h3>
                            <LastDigitsLineChart digits={recentDigits.slice(-10)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

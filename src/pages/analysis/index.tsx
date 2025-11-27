import React from 'react';
import { observer } from 'mobx-react-lite';
import { useDerivAnalysis } from '@/hooks/use-deriv-analysis';
import { Localize } from '@deriv-com/translations';
import './analysis.scss';

const Analysis = observer(() => {
    const {
        connectionStatus,
        currentPrice,
        currentDigit,
        tickCount,
        analysis,
        signals,
        proSignals,
        aiPrediction,
        symbol,
        maxTicks,
        availableSymbols,
        changeSymbol,
        changeMaxTicks,
        // getRecentDigits,
        // isConnected,
    } = useDerivAnalysis();

    const connectionStatusBadge = {
        connected: { text: 'Connected', className: 'analysis__status--connected' },
        disconnected: { text: 'Disconnected', className: 'analysis__status--disconnected' },
        reconnecting: { text: 'Reconnecting...', className: 'analysis__status--reconnecting' },
    }[connectionStatus];

    const renderDigitFrequencies = () => {
        if (!analysis) return null;

        return (
            <div className='analysis__digit-frequencies'>
                <h3 className='analysis__section-title'>
                    <Localize i18n_default_text='Digit Distribution' />
                </h3>
                <div className='analysis__digit-grid'>
                    {analysis.digitFrequencies.map(freq => (
                        <div key={freq.digit} className='analysis__digit-card'>
                            <div className='analysis__digit-number'>{freq.digit}</div>
                            <div className='analysis__digit-count'>{freq.count}</div>
                            <div className='analysis__digit-percentage'>{freq.percentage.toFixed(1)}%</div>
                            <div
                                className='analysis__digit-bar'
                                style={{ width: `${Math.min(freq.percentage * 2, 100)}%` }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSignals = () => {
        if (!signals || signals.length === 0) return null;

        const activeSignals = signals.filter(s => s.status !== 'NEUTRAL');
        if (activeSignals.length === 0) {
            return (
                <div className='analysis__no-signals'>
                    <Localize i18n_default_text='No active signals. Continue monitoring...' />
                </div>
            );
        }

        return (
            <div className='analysis__signals'>
                {activeSignals.map((signal, index) => (
                    <div
                        key={index}
                        className={`analysis__signal-card analysis__signal-card--${signal.status === 'TRADE NOW' ? 'trade' : 'wait'}`}
                    >
                        <div className='analysis__signal-header'>
                            <span className='analysis__signal-type'>{signal.type.toUpperCase()}</span>
                            <span className='analysis__signal-status'>{signal.status}</span>
                        </div>
                        <div className='analysis__signal-probability'>{signal.probability.toFixed(1)}%</div>
                        <div className='analysis__signal-recommendation'>{signal.recommendation}</div>
                        <div className='analysis__signal-entry'>{signal.entryCondition}</div>
                    </div>
                ))}
            </div>
        );
    };

    const renderProSignals = () => {
        if (!proSignals || proSignals.length === 0) return null;

        return (
            <div className='analysis__pro-signals'>
                <h3 className='analysis__section-title'>
                    <Localize i18n_default_text='Pro Signals' />
                </h3>
                {proSignals.map((signal, index) => (
                    <div key={index} className='analysis__signal-card analysis__signal-card--pro'>
                        <div className='analysis__signal-header'>
                            <span className='analysis__signal-type'>{signal.type.toUpperCase()}</span>
                            <span className='analysis__signal-status'>{signal.status}</span>
                        </div>
                        <div className='analysis__signal-probability'>{signal.probability.toFixed(1)}%</div>
                        <div className='analysis__signal-recommendation'>{signal.recommendation}</div>
                        <div className='analysis__signal-entry'>{signal.entryCondition}</div>
                        {signal.targetDigit !== undefined && (
                            <div className='analysis__signal-target'>Target Digit: {signal.targetDigit}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderAIPrediction = () => {
        if (!aiPrediction) return null;

        return (
            <div className='analysis__ai-prediction'>
                <h3 className='analysis__section-title'>
                    <Localize i18n_default_text='AI Prediction' />
                </h3>
                <div className='analysis__prediction-grid'>
                    <div className='analysis__prediction-card analysis__prediction-card--top'>
                        <div className='analysis__prediction-label'>Top Prediction</div>
                        <div className='analysis__prediction-digit'>{aiPrediction.topPrediction.digit}</div>
                        <div className='analysis__prediction-confidence'>
                            {aiPrediction.topPrediction.confidence.toFixed(1)}%
                        </div>
                    </div>
                    <div className='analysis__prediction-card'>
                        <div className='analysis__prediction-label'>Second Prediction</div>
                        <div className='analysis__prediction-digit'>{aiPrediction.secondPrediction.digit}</div>
                        <div className='analysis__prediction-confidence'>
                            {aiPrediction.secondPrediction.confidence.toFixed(1)}%
                        </div>
                    </div>
                </div>
                <div className='analysis__prediction-explanation'>{aiPrediction.explanation}</div>
            </div>
        );
    };

    const renderStats = () => {
        if (!analysis) return null;

        return (
            <div className='analysis__stats'>
                <div className='analysis__stat-card'>
                    <div className='analysis__stat-label'>
                        <Localize i18n_default_text='Even' />
                    </div>
                    <div className='analysis__stat-value'>{analysis.evenPercentage.toFixed(1)}%</div>
                    <div className='analysis__stat-count'>({analysis.evenCount})</div>
                </div>
                <div className='analysis__stat-card'>
                    <div className='analysis__stat-label'>
                        <Localize i18n_default_text='Odd' />
                    </div>
                    <div className='analysis__stat-value'>{analysis.oddPercentage.toFixed(1)}%</div>
                    <div className='analysis__stat-count'>({analysis.oddCount})</div>
                </div>
                <div className='analysis__stat-card'>
                    <div className='analysis__stat-label'>
                        <Localize i18n_default_text='Over 4.5' />
                    </div>
                    <div className='analysis__stat-value'>{analysis.highPercentage.toFixed(1)}%</div>
                    <div className='analysis__stat-count'>({analysis.highCount})</div>
                </div>
                <div className='analysis__stat-card'>
                    <div className='analysis__stat-label'>
                        <Localize i18n_default_text='Under 4.5' />
                    </div>
                    <div className='analysis__stat-value'>{analysis.lowPercentage.toFixed(1)}%</div>
                    <div className='analysis__stat-count'>({analysis.lowCount})</div>
                </div>
                <div className='analysis__stat-card'>
                    <div className='analysis__stat-label'>
                        <Localize i18n_default_text='Entropy' />
                    </div>
                    <div className='analysis__stat-value'>{analysis.entropy.toFixed(2)}</div>
                </div>
            </div>
        );
    };

    return (
        <div className='analysis'>
            <div className='analysis__header'>
                <h1 className='analysis__title'>
                    <Localize i18n_default_text='Market Analysis' />
                </h1>
                <div className='analysis__controls'>
                    <div className='analysis__control-group'>
                        <label>
                            <Localize i18n_default_text='Symbol' />:
                        </label>
                        <select value={symbol} onChange={e => changeSymbol(e.target.value)}>
                            {availableSymbols.map(sym => (
                                <option key={sym.symbol} value={sym.symbol}>
                                    {sym.display_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='analysis__control-group'>
                        <label>
                            <Localize i18n_default_text='Ticks' />:
                        </label>
                        <select value={maxTicks} onChange={e => changeMaxTicks(Number(e.target.value))}>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={150}>150</option>
                            <option value={200}>200</option>
                            <option value={300}>300</option>
                            <option value={500}>500</option>
                        </select>
                    </div>
                    <div className={`analysis__status ${connectionStatusBadge.className}`}>
                        {connectionStatusBadge.text}
                    </div>
                </div>
            </div>

            <div className='analysis__price-display'>
                <div className='analysis__price-card'>
                    <div className='analysis__price-label'>
                        <Localize i18n_default_text='Current Price' />
                    </div>
                    <div className='analysis__price-value'>{currentPrice?.toFixed(5) || '---'}</div>
                </div>
                <div className='analysis__digit-card-main'>
                    <div className='analysis__digit-label'>
                        <Localize i18n_default_text='Last Digit' />
                    </div>
                    <div className='analysis__digit-value'>{currentDigit ?? '-'}</div>
                </div>
                <div className='analysis__tick-card'>
                    <div className='analysis__tick-label'>
                        <Localize i18n_default_text='Tick Count' />
                    </div>
                    <div className='analysis__tick-value'>{tickCount}</div>
                </div>
            </div>

            {renderStats()}

            <div className='analysis__content'>
                <div className='analysis__column'>
                    {renderDigitFrequencies()}
                    {renderAIPrediction()}
                </div>
                <div className='analysis__column'>
                    <h3 className='analysis__section-title'>
                        <Localize i18n_default_text='Trading Signals' />
                    </h3>
                    {renderSignals()}
                    {renderProSignals()}
                </div>
            </div>
        </div>
    );
});

export default Analysis;

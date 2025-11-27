import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDeriv } from '@/hooks/use-deriv';
import { EvenOddTab } from './even-odd-tab';
import { OverUnderTab } from './over-under-tab';
import { SmartAnalysisTab } from './smart-analysis-tab';
import '@/pages/analysis/analysis.scss'; // Import the analysis styles

export function ProfitHubContainer() {
    const [theme] = useState<'light' | 'dark'>('dark');

    // Initialize theme
    useEffect(() => {
        document.documentElement.classList.add('dark');
    }, []);

    const { connectionStatus, currentPrice, currentDigit, analysis, signals, getRecentDigits } = useDeriv();

    const recentDigits = getRecentDigits(20);
    const recent100Digits = getRecentDigits(100);
    const recent50Digits = getRecentDigits(50);
    const recent40Digits = getRecentDigits(40);

    const connectionStatusBadge = {
        connected: { text: 'Connected', className: 'analysis__status--connected' },
        disconnected: { text: 'Disconnected', className: 'analysis__status--disconnected' },
        reconnecting: { text: 'Reconnecting...', className: 'analysis__status--reconnecting' },
    }[connectionStatus] || { text: 'Unknown', className: '' };

    return (
        <div className='analysis mx-auto'>
            <div className='analysis__header flex flex-col items-center justify-center gap-4 mb-8'>
                <h1 className='analysis__title text-center'>Profit Hub</h1>
                <div className='analysis__controls justify-center'>
                    <div className={`analysis__status ${connectionStatusBadge.className}`}>
                        {connectionStatusBadge.text}
                    </div>
                </div>
            </div>

            <Tabs defaultValue='smart-analysis' className='w-full flex flex-col items-center'>
                <div className='analysis__controls mb-8 w-full flex justify-center'>
                    <TabsList className='bg-[var(--general-section-1)] border border-[var(--border-normal)] p-1 rounded-lg h-auto'>
                        <TabsTrigger
                            value='smart-analysis'
                            className='text-[1.4rem] px-6 py-2 data-[state=active]:bg-[var(--general-main-1)] data-[state=active]:text-[var(--text-prominent)] text-[var(--text-general)]'
                        >
                            Smart Analysis
                        </TabsTrigger>
                        <TabsTrigger
                            value='even-odd'
                            className='text-[1.4rem] px-6 py-2 data-[state=active]:bg-[var(--general-main-1)] data-[state=active]:text-[var(--text-prominent)] text-[var(--text-general)]'
                        >
                            Even/Odd
                        </TabsTrigger>
                        <TabsTrigger
                            value='over-under'
                            className='text-[1.4rem] px-6 py-2 data-[state=active]:bg-[var(--general-main-1)] data-[state=active]:text-[var(--text-prominent)] text-[var(--text-general)]'
                        >
                            Over/Under
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className='w-full max-w-[1200px]'>
                    {connectionStatus !== 'connected' ? (
                        <div className='analysis__no-signals text-center'>
                            <h2 className='analysis__section-title'>
                                {connectionStatus === 'reconnecting'
                                    ? 'Connecting to Deriv API...'
                                    : 'Connection Failed'}
                            </h2>
                            <p>
                                {connectionStatus === 'reconnecting'
                                    ? 'Establishing a secure connection to the trading server...'
                                    : 'Unable to connect. Please check your internet connection and refresh the page.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <TabsContent value='smart-analysis' className='mt-0 focus-visible:outline-none w-full'>
                                <SmartAnalysisTab
                                    analysis={analysis}
                                    signals={signals}
                                    currentDigit={currentDigit}
                                    currentPrice={currentPrice}
                                    recentDigits={recentDigits}
                                    recent100Digits={recent100Digits}
                                    theme={theme}
                                />
                            </TabsContent>

                            <TabsContent value='even-odd' className='mt-0 focus-visible:outline-none w-full'>
                                <EvenOddTab
                                    analysis={analysis}
                                    signals={signals}
                                    currentDigit={currentDigit}
                                    currentPrice={currentPrice}
                                    recentDigits={recent40Digits}
                                    theme={theme}
                                />
                            </TabsContent>

                            <TabsContent value='over-under' className='mt-0 focus-visible:outline-none w-full'>
                                <OverUnderTab
                                    analysis={analysis}
                                    signals={signals}
                                    currentDigit={currentDigit}
                                    currentPrice={currentPrice}
                                    recentDigits={recent50Digits}
                                    theme={theme}
                                />
                            </TabsContent>
                        </>
                    )}
                </div>
            </Tabs>
        </div>
    );
}

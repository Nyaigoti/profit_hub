import { useCallback, useEffect, useRef, useState } from 'react';
import { AIPredictor, PredictionResult } from '@/lib/ai-predictor';
import { AnalysisEngine, AnalysisResult, Signal, TickData } from '@/lib/analysis-engine';
import { ConnectionLog, DerivSymbol, DerivWebSocket } from '@/lib/deriv-websocket';

export interface UseDerivAnalysisReturn {
    connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
    currentPrice: number | null;
    currentDigit: number | null;
    tickCount: number;
    analysis: AnalysisResult | null;
    signals: Signal[];
    proSignals: Signal[];
    aiPrediction: PredictionResult | null;
    symbol: string;
    maxTicks: number;
    availableSymbols: DerivSymbol[];
    connectionLogs: ConnectionLog[];
    changeSymbol: (newSymbol: string) => void;
    changeMaxTicks: (newMaxTicks: number) => void;
    getRecentDigits: (count: number) => number[];
    isConnected: boolean;
}

export const useDerivAnalysis = (appId = '1089'): UseDerivAnalysisReturn => {
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>(
        'disconnected'
    );
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [currentDigit, setCurrentDigit] = useState<number | null>(null);
    const [tickCount, setTickCount] = useState(0);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [signals, setSignals] = useState<Signal[]>([]);
    const [proSignals, setProSignals] = useState<Signal[]>([]);
    const [aiPrediction, setAIPrediction] = useState<PredictionResult | null>(null);
    const [symbol, setSymbol] = useState('R_100');
    const [maxTicks, setMaxTicks] = useState(100);
    const [availableSymbols, setAvailableSymbols] = useState<DerivSymbol[]>([]);
    const [connectionLogs, setConnectionLogs] = useState<ConnectionLog[]>([]);

    const wsRef = useRef<DerivWebSocket | null>(null);
    const engineRef = useRef<AnalysisEngine | null>(null);
    const predictorRef = useRef<AIPredictor | null>(null);

    // Initialize engines
    useEffect(() => {
        if (!engineRef.current) {
            engineRef.current = new AnalysisEngine(maxTicks);
        }
        if (!predictorRef.current) {
            predictorRef.current = new AIPredictor();
        }
    }, [maxTicks]);

    // Initialize WebSocket connection
    useEffect(() => {
        const ws = new DerivWebSocket(appId);
        wsRef.current = ws;

        // Connection status listener
        ws.onConnectionStatus(status => {
            setConnectionStatus(status);
        });

        // Connection logs listener
        ws.subscribe('connection_log', (log: ConnectionLog) => {
            setConnectionLogs(prev => [...prev.slice(-99), log]);
        });

        // Tick data listener
        ws.subscribe('tick', (data: any) => {
            if (data.tick) {
                const tick: TickData = {
                    epoch: data.tick.epoch,
                    quote: data.tick.quote,
                    symbol: data.tick.symbol,
                    pipSize: data.tick.pip_size || 2,
                };

                setCurrentPrice(tick.quote);

                if (engineRef.current) {
                    engineRef.current.setPipSize(tick.pipSize || 2);
                    engineRef.current.addTick(tick);

                    setCurrentDigit(engineRef.current.getCurrentDigit());
                    setTickCount(engineRef.current.getTicks().length);

                    const currentAnalysis = engineRef.current.getAnalysis();
                    setAnalysis(currentAnalysis);
                    setSignals(engineRef.current.generateSignals());
                    setProSignals(engineRef.current.generateProSignals());

                    // AI prediction
                    if (predictorRef.current) {
                        const digitCounts = new Map<number, number>();
                        currentAnalysis.digitFrequencies.forEach(freq => {
                            digitCounts.set(freq.digit, freq.count);
                        });
                        const prediction = predictorRef.current.predict(engineRef.current.getLastDigits(), digitCounts);
                        setAIPrediction(prediction);
                    }
                }
            }
        });

        // Active symbols listener
        ws.subscribe('active_symbols', (data: any) => {
            if (data.active_symbols) {
                const symbols: DerivSymbol[] = data.active_symbols
                    .filter((s: any) => s.market === 'synthetic_index')
                    .map((s: any) => ({
                        symbol: s.symbol,
                        display_name: s.display_name,
                        market: s.market,
                        market_display_name: s.market_display_name,
                        submarket: s.submarket,
                        submarket_display_name: s.submarket_display_name,
                        pip_size: s.pip,
                    }));
                setAvailableSymbols(symbols);
            }
        });

        // Connect and get symbols
        ws.connect()
            .then(() => {
                ws.getActiveSymbols();
                ws.subscribeTicks(symbol);
            })
            .catch(error => {
                console.error('Failed to connect to Deriv WebSocket:', error);
            });

        // Cleanup
        return () => {
            ws.disconnect();
        };
    }, [appId, symbol]);

    const changeSymbol = useCallback((newSymbol: string) => {
        if (wsRef.current) {
            wsRef.current.unsubscribeTicks();
            setSymbol(newSymbol);

            if (engineRef.current) {
                engineRef.current.clear();
            }

            setCurrentPrice(null);
            setCurrentDigit(null);
            setTickCount(0);
            setAnalysis(null);
            setSignals([]);
            setProSignals([]);
            setAIPrediction(null);

            setTimeout(() => {
                if (wsRef.current) {
                    wsRef.current.subscribeTicks(newSymbol);
                }
            }, 100);
        }
    }, []);

    const changeMaxTicks = useCallback((newMaxTicks: number) => {
        setMaxTicks(newMaxTicks);
        if (engineRef.current) {
            engineRef.current.setMaxTicks(newMaxTicks);
        }
    }, []);

    const getRecentDigits = useCallback((count: number): number[] => {
        if (engineRef.current) {
            return engineRef.current.getRecentDigits(count);
        }
        return [];
    }, []);

    return {
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
        connectionLogs,
        changeSymbol,
        changeMaxTicks,
        getRecentDigits,
        isConnected: connectionStatus === 'connected',
    };
};

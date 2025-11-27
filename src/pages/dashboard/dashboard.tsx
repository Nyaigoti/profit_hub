import React, { lazy, Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import ChunkLoader from '@/components/loader/chunk-loader';
import { localize } from '@deriv-com/translations';

const ProfitHubContainer = lazy(() =>
    import('@/components/profit-hub/profit-hub-container').then(module => ({ default: module.ProfitHubContainer }))
);

const DashboardComponent = observer(() => {
    return (
        <div className='profit-hub-dashboard h-full w-full overflow-y-auto'>
            <Suspense fallback={<ChunkLoader message={localize('Loading Profit Hub...')} />}>
                <ProfitHubContainer />
            </Suspense>
        </div>
    );
});

export default DashboardComponent;

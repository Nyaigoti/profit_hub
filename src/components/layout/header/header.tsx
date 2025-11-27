import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { DerivAuth } from '@/components/deriv-auth/deriv-auth';
import { useStore } from '@/hooks/useStore';
import { Header, useDevice, Wrapper } from '@deriv-com/ui';
import MenuItems from './menu-items';
import MobileMenu from './mobile-menu';
import './header.scss';

// type TAppHeaderProps = {
//     isAuthenticating?: boolean;
// };

const AppHeader = observer(() => {
    const { isDesktop } = useDevice();
    const { client } = useStore() ?? {};

    if (client?.should_hide_header) return null;

    return (
        <>
            <Header
                className={clsx('app-header', {
                    'app-header--desktop': isDesktop,
                    'app-header--mobile': !isDesktop,
                })}
            >
                <Wrapper variant='left'>
                    <MobileMenu onLogout={() => client?.logout()} />
                    <div className='flex items-center gap-2 ml-2'>
                        <span className='text-lg font-bold text-[var(--text-general)]'>Profit Hub</span>
                    </div>
                    {isDesktop && <MenuItems />}
                </Wrapper>
                <Wrapper variant='right'>
                    <DerivAuth theme='dark' />
                </Wrapper>
            </Header>
        </>
    );
});

export default AppHeader;

import {useContext, useEffect, useState} from 'preact/hooks';
import {JSX} from 'preact';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';
import {Menu, MenuItem, useMediaQuery, useTheme} from '@mui/material';
import {enqueueSnackbar} from 'notistack';
import {AppState} from '../../screens/ViewController';
import RenderOnAuthenticated from '../conditionals/RenderOnAuthenticated';
import RenderOnAnonymous from '../conditionals/RenderOnAnonymous';
import {C} from './tokens';
import logo from '../../assets/LOGO_ATO_small.webp';

const TABS: Array<[string, string, (path: string) => boolean]> = [
    ['/',           'Guild Hall', (p) => p === '/' || p.startsWith('/deck')],
    ['/deckbuilder','Forge',      (p) => p.startsWith('/deckbuilder') || p.startsWith('/deckeditor')],
    ['/cards-wiki', 'Library',    (p) => p.startsWith('/cards-wiki')],
    ['/perks',      'Tomes',      (p) => p.startsWith('/perks')],
];

export default function NavC() {
    const state = useContext(AppState);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const theme = useTheme();
    const isCompact = useMediaQuery(theme.breakpoints.down('md'));

    const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
    const accountOpen = Boolean(accountAnchor);

    useEffect(() => {
        auth.clearStaleState().catch((err) => console.error('[auth] clearStaleState failed', err));
    }, []);

    useEffect(() => {
        if (auth.error) {
            console.error('[auth] error', auth.error);
            enqueueSnackbar(`Login error: ${auth.error.message}`, {variant: 'error'});
        }
    }, [auth.error]);

    const openHamburger = () => { state.appMenuOpen.value = true; };
    const openAccount = (e: JSX.TargetedMouseEvent<HTMLDivElement>) => setAccountAnchor(e.currentTarget);
    const closeAccount = () => setAccountAnchor(null);

    const doSigninRedirect = () => {
        auth.signinRedirect().catch((err) => {
            console.error('[auth] signinRedirect failed', err);
            enqueueSnackbar(`Login redirect failed: ${err?.message ?? err}`, {variant: 'error'});
        });
    };
    const doSignoutSilent = () => {
        auth.signoutSilent().catch((err) => {
            console.error('[auth] signoutSilent failed', err);
            enqueueSnackbar(`Logout failed: ${err?.message ?? err}`, {variant: 'error'});
        });
    };

    const onSearchInput = (e: JSX.TargetedEvent<HTMLInputElement>) => {
        state.searchText.value = (e.currentTarget as HTMLInputElement).value;
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            height: 56,
            padding: '0 16px',
            background: `linear-gradient(${C.wood}, ${C.woodDark})`,
            borderBottom: `2px solid ${C.ink}`,
            boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.4), inset 0 1px 0 rgba(255,220,170,.15), 0 2px 8px rgba(0,0,0,.25)',
            position: 'sticky',
            top: 0,
            zIndex: 1100,
        }}>
            {isCompact && (
                <button
                    onClick={openHamburger}
                    aria-label="open drawer"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: C.creamShade,
                        cursor: 'pointer',
                        padding: 8,
                        marginRight: 4,
                        fontSize: 22,
                        lineHeight: 1,
                    }}
                >☰</button>
            )}

            {/* Brand mark */}
            <div
                onClick={() => navigate('/')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexShrink: 0,
                    cursor: 'pointer',
                }}
            >
                <img src={logo} alt="ATO Deckbuilder" width={36} height={36} style={{display: 'block', flexShrink: 0}} />
                <div style={{whiteSpace: 'nowrap'}}>
                    <div style={{
                        fontFamily: C.display,
                        fontWeight: 700,
                        fontSize: 14,
                        color: C.creamHi,
                        letterSpacing: '0.16em',
                        lineHeight: 1.1,
                    }}>ATO DECKBUILDER</div>
                    {!isCompact && (
                        <div style={{
                            fontFamily: C.serif,
                            fontStyle: 'italic',
                            fontSize: 10,
                            color: C.creamShade,
                            marginTop: 1,
                            opacity: 0.7,
                        }}>est. the Guild of Adventurers</div>
                    )}
                </div>
            </div>

            {/* Primary tabs (desktop only) */}
            {!isCompact && (
                <div style={{display: 'flex', gap: 2, marginLeft: 36}}>
                    {TABS.map(([path, label, matcher]) => {
                        const active = matcher(location.pathname);
                        return (
                            <div
                                key={path}
                                onClick={() => navigate(path)}
                                style={{
                                    padding: '8px 14px',
                                    fontFamily: C.display,
                                    fontSize: 12,
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: active ? C.amber : C.creamShade,
                                    borderBottom: active ? `2px solid ${C.amber}` : '2px solid transparent',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    userSelect: 'none',
                                }}
                            >{label}</div>
                        );
                    })}
                </div>
            )}

            <div style={{flex: 1}} />

            {/* Search */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 12px',
                background: 'rgba(0,0,0,.25)',
                border: `1px solid ${C.woodDark}`,
                borderRadius: 3,
                width: isCompact ? 160 : 260,
                marginRight: 12,
            }}>
                <span style={{color: C.inkMute, fontSize: 14, lineHeight: 1}}>⌕</span>
                <input
                    placeholder={isCompact ? 'Seek a deck…' : 'Seek a deck, card or scribe…'}
                    onInput={onSearchInput}
                    value={state.searchText.value}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: C.creamHi,
                        fontFamily: C.serif,
                        fontStyle: 'italic',
                        fontSize: 13,
                        flex: 1,
                        minWidth: 0,
                        padding: 0,
                    }}
                />
            </div>

            {/* Version chip */}
            {!isCompact && (
                <div style={{
                    padding: '4px 10px',
                    borderRadius: 3,
                    fontSize: 10,
                    fontFamily: C.mono,
                    color: C.green,
                    border: `1px solid ${C.greenDeep}`,
                    background: 'rgba(0,0,0,.25)',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                }}>Game Version v1.7.5</div>
            )}

            {/* Account avatar */}
            <div
                onClick={openAccount}
                aria-haspopup="true"
                aria-expanded={accountOpen}
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: C.cream,
                    marginLeft: 12,
                    border: `2px solid ${C.ink}`,
                    fontFamily: C.display,
                    fontWeight: 700,
                    fontSize: 13,
                    color: C.ink,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                }}
            >
                {auth.user?.profile?.preferred_username?.[0]?.toUpperCase() ?? '?'}
            </div>

            <Menu
                anchorEl={accountAnchor}
                open={accountOpen}
                onClose={closeAccount}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <RenderOnAuthenticated>
                    <MenuItem onClick={() => {
                        closeAccount();
                        window.open('https://account.ato-deckbuilder.com/realms/ATO-Deckbuilder/account');
                    }}>Profile</MenuItem>
                    <MenuItem onClick={() => {
                        closeAccount();
                        doSignoutSilent();
                    }}>Log out</MenuItem>
                </RenderOnAuthenticated>
                <RenderOnAnonymous>
                    <MenuItem onClick={() => {
                        closeAccount();
                        doSigninRedirect();
                    }}>Login/Register</MenuItem>
                </RenderOnAnonymous>
            </Menu>
        </div>
    );
}

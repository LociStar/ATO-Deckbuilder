import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {useContext} from "preact/hooks";
import {AppState} from "../screens/ViewController.tsx"
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "react-oidc-context";
import {C} from './directionC/tokens';
import {PRIMARY_TABS, attemptNavigate} from './directionC/navItems';
import logo from '../assets/LOGO_ATO_small.webp';

type DrawerItem = {
    label: string;
    onClick?: () => void;
    href?: string;
    external?: boolean;
    active?: boolean;
};

export default function TemporaryDrawer() {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const state = useContext(AppState);

    const close = () => { state.appMenuOpen.value = false; };

    const primaryItems: DrawerItem[] = PRIMARY_TABS.map((tab) => ({
        label: tab.label,
        active: tab.matcher(location.pathname),
        onClick: () => attemptNavigate(tab, auth.isAuthenticated, navigate),
    }));

    const sections: Array<{title: string; items: DrawerItem[]}> = [
        {title: 'Navigate', items: primaryItems},
        {
            title: 'More',
            items: [
                {label: 'Perk Builder', onClick: () => navigate('/perks/-')},
                {label: 'Support', href: 'https://github.com/LociStar/ATO-Deckbuilder', external: true},
            ],
        },
    ];

    function renderItem(item: DrawerItem) {
        const baseStyle = {
            display: 'block',
            padding: '10px 22px',
            fontFamily: C.display,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase' as const,
            color: item.active ? C.amberDeep : C.ink,
            textDecoration: 'none',
            cursor: 'pointer',
            borderLeft: item.active ? `3px solid ${C.amber}` : '3px solid transparent',
            background: item.active ? C.parchment : 'transparent',
        };
        const handleHover = (e: any, on: boolean) => {
            if (item.active) return;
            (e.currentTarget as HTMLElement).style.background = on ? C.parchment : 'transparent';
            (e.currentTarget as HTMLElement).style.borderLeftColor = on ? C.amber : 'transparent';
            (e.currentTarget as HTMLElement).style.color = on ? C.amberDeep : C.ink;
        };

        if (item.external) {
            return (
                <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    onMouseEnter={(e) => handleHover(e, true)}
                    onMouseLeave={(e) => handleHover(e, false)}
                    style={baseStyle}
                >{item.label}</a>
            );
        }
        return (
            <div
                key={item.label}
                style={baseStyle}
                onClick={() => { item.onClick?.(); close(); }}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
            >{item.label}</div>
        );
    }

    return (
        <Drawer
            open={state.appMenuOpen.value}
            onClose={close}
            PaperProps={{
                sx: {
                    background: C.cream,
                    borderRight: `2px solid ${C.ink}`,
                    width: 280,
                },
            }}
        >
            <Box role="presentation" sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                {/* Wooden header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 18px',
                    background: `linear-gradient(${C.wood}, ${C.woodDark})`,
                    borderBottom: `2px solid ${C.ink}`,
                    boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.4), inset 0 1px 0 rgba(255,220,170,.15)',
                }}>
                    <img src={logo} alt="ATO Deckbuilder" width={40} height={40} style={{display: 'block', flexShrink: 0}} />
                    <div>
                        <div style={{
                            fontFamily: C.display,
                            fontWeight: 700,
                            fontSize: 14,
                            color: C.creamHi,
                            letterSpacing: '0.16em',
                            lineHeight: 1.1,
                        }}>ATO DECKBUILDER</div>
                        <div style={{
                            fontFamily: C.serif,
                            fontStyle: 'italic',
                            fontSize: 10,
                            color: C.creamShade,
                            marginTop: 2,
                            opacity: 0.75,
                        }}>est. the Guild of Adventurers</div>
                    </div>
                </div>

                <div style={{flex: 1, overflowY: 'auto', padding: '12px 0'}}>
                    {sections.map((sec, i) => (
                        <div key={i} style={{marginBottom: 8}}>
                            {sec.title && (
                                <div style={{
                                    padding: '6px 22px 4px',
                                    fontFamily: C.display,
                                    fontSize: 9.5,
                                    color: C.inkDim,
                                    letterSpacing: '0.22em',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                }}>{sec.title}</div>
                            )}
                            {sec.items.map(renderItem)}
                            {i < sections.length - 1 && (
                                <div style={{
                                    height: 1,
                                    background: `repeating-linear-gradient(90deg, ${C.inkMute} 0 4px, transparent 4px 7px)`,
                                    margin: '10px 18px',
                                    opacity: 0.5,
                                }} />
                            )}
                        </div>
                    ))}
                </div>
            </Box>
        </Drawer>
    );
}

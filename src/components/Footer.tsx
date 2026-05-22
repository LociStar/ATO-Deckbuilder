import {C} from './directionC/tokens';

export default function Footer() {
    const linkStyle = {
        color: C.creamHi,
        textDecoration: 'none',
        fontFamily: C.serif,
        fontStyle: 'italic' as const,
        fontSize: 14,
        padding: '4px 10px',
        borderRadius: 2,
        transition: 'color 120ms ease, background 120ms ease',
    };

    const onHover = (e: any, on: boolean) => {
        (e.currentTarget as HTMLElement).style.color = on ? C.amber : C.creamHi;
        (e.currentTarget as HTMLElement).style.background = on ? 'rgba(0,0,0,.25)' : 'transparent';
    };

    return (
        <footer style={{
            background: `linear-gradient(${C.woodMid}, ${C.woodDark})`,
            borderTop: `2px solid ${C.ink}`,
            boxShadow: 'inset 0 1px 0 rgba(255,220,170,.15)',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexWrap: 'wrap',
        }}>
            <a
                href="https://github.com/LociStar/ATO-Deckbuilder"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseEnter={(e) => onHover(e, true)}
                onMouseLeave={(e) => onHover(e, false)}
            >GitHub</a>
            <span style={{color: C.inkMute, opacity: 0.6}}>·</span>
            <a
                href="/terms-of-service"
                style={linkStyle}
                onMouseEnter={(e) => onHover(e, true)}
                onMouseLeave={(e) => onHover(e, false)}
            >Terms of Service</a>
            <span style={{color: C.inkMute, opacity: 0.6}}>·</span>
            <a
                href="/privacy-policy"
                style={linkStyle}
                onMouseEnter={(e) => onHover(e, true)}
                onMouseLeave={(e) => onHover(e, false)}
            >Privacy Policy</a>
        </footer>
    );
}

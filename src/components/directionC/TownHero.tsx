import {ComponentChildren} from 'preact';
import townImage from '../../assets/extended-town_.webp';
import {C} from './tokens';
import {Cartouche} from './primitives';

// Town painting as page hero — sharp image fading into cream parchment
// so the cartouche title plate reads clearly on top.
export default function TownHero({
    height = 340,
    eyebrow,
    title,
    sub,
    position = 'center 38%',
}: {
    height?: number;
    eyebrow?: ComponentChildren;
    title: ComponentChildren;
    sub?: ComponentChildren;
    position?: string;
}) {
    return (
        <div style={{position: 'relative', height, overflow: 'hidden'}}>
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${townImage})`,
                backgroundSize: 'cover',
                backgroundPosition: position,
                imageRendering: 'auto',
            }} />
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(168,200,218,0) 0%, rgba(168,200,218,0) 30%, rgba(245,234,208,.55) 75%, rgba(245,234,208,1) 100%)',
            }} />
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at 50% 55%, rgba(30,15,5,.18) 0%, transparent 55%)',
            }} />
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '46%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                maxWidth: 720,
                width: '90%',
            }}>
                <Cartouche eyebrow={eyebrow} title={title} sub={sub} />
            </div>
        </div>
    );
}

export {C};

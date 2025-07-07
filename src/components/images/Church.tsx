import {useState} from "preact/hooks";
import Iglesia from '../../assets/Iglesia3.png';

function Church() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <svg
            // Instead of transform in `style`, specify width with VW, and let the SVG scale.
            width={820 / 3552 * 101 + "vw"}
            viewBox="0 0 820 1376"  // match this to the image’s actual pixel width & height
            preserveAspectRatio="xMinYMin meet"
            style={{
                position: 'relative',
                overflow: 'visible',
                transform: 'translate(-24.3vw, -0.5vh)',
            }}
        >
            <image
                xlinkHref={Iglesia}
                width="820"       // match these to the same numbers used in viewBox
                height="1376"
                style={{
                    transition: 'filter 0.3s ease',
                    filter: isHovered ? 'drop-shadow(0 0 10px lightblue)' : 'none',
                }}
            />
            <polygon
                points="47 1339,13 1013,86 750,154 726,134 504,110 279,263 37,400 284,344 624,672 599,786 1012,808 1200,786 1341"
                fill="transparent"
                stroke="none"
                style={{cursor: 'pointer'}}
                onClick={() => console.log('Polygon clicked!')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
        </svg>
    );
}


export default Church;
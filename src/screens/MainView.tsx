import {useEffect} from "preact/hooks";
import {useRef} from "react";
import Parallax from 'parallax-js';
import {Box} from "@mui/material";
import City from '../assets/Pueblo.png';
import Ground from '../assets/Suelo.png';
import Mountain from '../assets/Mountain.png';
import Heaven from '../assets/Cielo.png';
import Trees from '../assets/Bosque.png';
import Stairs from '../assets/Arbol_aqu.png'; // smaller image
import Cloud3 from '../assets/Nube3.png'; // smaller image
import Cloud1 from '../assets/Nube1.png'; // smaller image
import Church from '../components/images/Church.tsx' // smaller image


export default function MainView() {

    const sceneRef = useRef<HTMLDivElement>(null);
    const width = 101;

    useEffect(() => {
        if (!sceneRef.current) return;
        const parallaxInstance = new Parallax(sceneRef.current, {
            relativeInput: false,
            pointerEvents: true,
            limitX: 50,
            limitY: 100,
        });

        return () => parallaxInstance.destroy();
    }, []);

    return (
        <Box
            sx={{
                position: 'fixed', // Or relative, but absolute is common for “full coverage”
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, #87CEEB, #FFFFFF)',
            }}
        >
            <Box
                ref={sceneRef}
                sx={{
                    position: 'relative',
                }}
                className="responsive-image"
            >
                <div data-depth="0">
                    <img src={Heaven} className="responsive-image"/>
                </div>
                <div data-depth="0.05">
                    <img
                        src={Cloud3}
                        style={{
                            transform: 'translate(22vw, 27vh)',
                            position: 'relative',
                            width: 1080 / 3552 * width + 'vw',
                            height: 'auto'
                        }}
                    />
                </div>
                <div data-depth="0.05">
                    <img
                        src={Cloud1}
                        style={{
                            transform: 'translate(-4.2vw, 15svh)',
                            position: 'relative',
                            width: 960 / 3552 * width + 'vw',
                            height: 'auto'
                        }}
                    />
                </div>
                <div data-depth="0.1">
                    <img src={Mountain} className="responsive-image"/>
                </div>
                {/*<div data-depth="0.15">*/}
                {/*    <img*/}
                {/*        src={Obelisk}*/}
                {/*        style={{transform: 'translate(3000px, 520px)', position: 'relative'}}*/}
                {/*    />*/}
                {/*</div>*/}
                <div data-depth="0.2">
                    <img src={Trees} className="responsive-image"/>
                </div>
                <div data-depth="0.3">
                    <img src={Ground} className="responsive-image"/>
                </div>
                <div data-depth="0.3">
                    <img src={City} className="responsive-image"/>
                </div>
                <div data-depth="0.3">
                    <Church/>
                </div>
                <div data-depth="0.3" style={{pointerEvents: 'none'}}>
                    <img
                        src={Stairs}
                        style={{
                            transform: 'translate(-22.7vw, 63.2vh)', position: 'relative',
                            width: 680 / 3552 * width + 'vw', height: 'auto'
                        }}
                    />
                </div>
                {/*<div data-depth="0.3">*/}
                {/*    <img*/}
                {/*        src={Gitana}*/}
                {/*        style={{*/}
                {/*            transform: 'translate(1910px, 810px)',*/}
                {/*            position: 'relative',*/}
                {/*            transition: 'filter 0.3s ease', // Smooth transition for hover effect*/}
                {/*        }}*/}
                {/*        onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 10px lightblue)'}*/}
                {/*        onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}*/}
                {/*        onClick={() => console.log('Forja clicked!')}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div data-depth="0.3">*/}
                {/*    <img*/}
                {/*        src={Wrought}*/}
                {/*        style={{*/}
                {/*            transform: 'translate(2330px, 990px)',*/}
                {/*            position: 'relative',*/}
                {/*            transition: 'filter 0.3s ease',*/}
                {/*        }}*/}
                {/*        onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 10px lightblue)'}*/}
                {/*        onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}*/}
                {/*        onClick={() => console.log('Forja clicked!')}*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div data-depth="0.3">*/}
                {/*    <img*/}
                {/*        src={Forja}*/}
                {/*        style={{*/}
                {/*            transform: 'translate(160px, 870px)',*/}
                {/*            position: 'relative',*/}
                {/*            transition: 'filter 0.3s ease', // Smooth transition for hover effect*/}
                {/*        }}*/}
                {/*        onMouseEnter={(e) => e.currentTarget.style.filter = 'drop-shadow(0 0 10px lightblue)'}*/}
                {/*        onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}*/}
                {/*        onClick={() => console.log('Forja clicked!')}*/}
                {/*    />*/}
                {/*</div>*/}
            </Box>
        </Box>
    );
}
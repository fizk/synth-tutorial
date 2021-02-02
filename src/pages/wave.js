import '../elements/article.js';
import validator, {record} from '../database/db.js';

class PageWave extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #speaker {
                    transform-origin: bottom;
                    animation: bounce 4s infinite ease-in-out;
                }
                #shadow {
                    transform-origin: bottom right ;
                    /* animation: streach 1.4s infinite ease-in-out; */
                }

                .waves_5 {
                    opacity: 0;
                    animation-name: fade;
                    animation-iteration-count: infinite;
                    animation-duration: 1.4s;
                }
                .waves_4 {
                    opacity: 0;
                    animation-delay: 0.2s;
                    animation-name: fade;
                    animation-iteration-count: infinite;
                    animation-duration: 1.4s;
                }
                .waves_3 {
                    opacity: 0;
                    animation-delay: 0.3s;
                    animation-name: fade;
                    animation-iteration-count: infinite;
                    animation-duration: 1.4s;
                }
                .waves_2 {
                    opacity: 0;
                    animation-delay: 0.4s;
                    animation-name: fade;
                    animation-iteration-count: infinite;
                    animation-duration: 1.4s;
                }
                .waves_1 {
                    opacity: 0;
                    animation-delay: 0.5s;
                    animation-name: fade;
                    animation-iteration-count: infinite;
                    animation-duration: 1.4s;
                }

                @keyframes fade {
                    0% { opacity: 0;}
                    20% { opacity: .3;}
                    30% { opacity: 0;}
                }

                @keyframes bounce {
                    0%, 75%, 100% {
                        transform: scaleY(1);
                    }
                    94% {
                        transform: scaleY(0.98);
                    }
                    98% {
                        transform: scaleY(0.9);
                    }
                    96% {
                        transform: scaleY(1.05);
                    }
                    97% {
                        transform: scaleY(0.95);
                    }
                    98% {
                        transform: scaleY(1.02);
                    }
                    99% {
                        transform: scaleY(0.98);
                    }
                }
                @keyframes streach {
                    0% 75%, 100% {
                        transform: scaleX(1);
                    }
                }
            </style>
            <element-article>
                <h2 slot="header">The Wave</h2>
                <p>
                    In physics, sound is a <strong>vibration</strong> that propagates as an
                    acoustic wave, through a transmission medium such as a gas, liquid or solid.
                </p>
                <p>
                    In computers, we generate this vibration by feeding the sound-card with a
                    mathematical curve that describes a <strong>smooth periodic oscillation</strong>.
                </p>
                <p>
                    The periodic curve is produced by the <strong>sine wave</strong> or
                    <strong>sinusoid</strong>.
                </p>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 482 291.33" slot="aside">
                    <defs>
                        <style>.cls-1,.cls-13{fill:none;stroke:#bab6b6;stroke-miterlimit:10;}.cls-2{fill:#e8e5e5;}.cls-3{fill:#353434;}.cls-4{fill:#444443;}.cls-5{fill:#636261;}.cls-6{fill:#353535;}.cls-7{fill:#474646;}.cls-8{fill:#918f8e;}.cls-9{fill:#444;}.cls-10{fill:#605f5f;}.cls-11{fill:#4f4f4f;}.cls-12{fill:#a09f9f;}.cls-13{stroke-width:7px;}</style>
                    </defs>
                    <g id="shadow">
                        <ellipse class="cls-2" cx="206.5" cy="339.58" rx="111.44" ry="28.95" transform="translate(-86.07 -92.58) rotate(-3.01)" />
                    </g>
                    <g id="speaker">
                        <polygon class="cls-3" points="237.14 240.02 130.76 254.49 130.76 41.73 236.42 53.31 237.14 240.02" />
                        <polygon class="cls-4" points="130.76 254.49 84.44 224.1 83 71.4 130.76 41.73 130.76 254.49" />

                        <ellipse class="cls-5" cx="186.84" cy="83.34" rx="26.41" ry="30.03" />
                        <ellipse class="cls-6" cx="259.69" cy="197.38" rx="8.32" ry="5.43" transform="translate(-127.55 24.19) rotate(-24.97)" />
                        <ellipse class="cls-7" cx="186.84" cy="83.34" rx="11.77" ry="13.39" />
                        <ellipse class="cls-8" cx="250.28" cy="182.91" rx="5.43" ry="3.26" transform="translate(-114.73 169.42) rotate(-53.12)" />

                        <ellipse class="cls-9" cx="185.4" cy="169.82" rx="45.23" ry="50.66" />
                        <ellipse class="cls-3" cx="185.4" cy="169.82" rx="36.55" ry="40.93" />
                        <ellipse class="cls-9" cx="185.4" cy="169.82" rx="29.72" ry="33.29" />
                        <path class="cls-10" d="M276.11,295.84a36.31,36.31,0,0,0,.24-43.91l-22.81,21.8Z" transform="translate(-68.5 -103.9)" />
                        <path class="cls-10" d="M224.18,273.73c0,11.17,4.92,21.06,12.46,27.1l16.17-30.72-23.24-15.5A35.88,35.88,0,0,0,224.18,273.73Z" transform="translate(-68.5 -103.9)" />
                        <ellipse class="cls-3" cx="181.06" cy="169.1" rx="11.22" ry="12.56" />
                        <path class="cls-11" d="M249.19,273l1.89-12.43a9.64,9.64,0,0,0-1.52-.13c-6.09,0-11,5.44-11.21,12.21Z" transform="translate(-68.5 -103.9)" />
                        <path class="cls-12" d="M249.19,273l8.14-9a10.55,10.55,0,0,0-7.65-3.51Z" transform="translate(-68.5 -103.9)" />
                    </g>
                    <g id="waves" data-name="Layer 7">
                        <path class="waves_1 cls-13" d="M416.58,393c27.92-33,45.34-79.76,45.34-131.6,0-65.49-27.81-122.86-69.47-154.68" transform="translate(-68.5 -103.9)" />
                        <path class="waves_2 cls-13" d="M364.87,163.23C391.31,183.42,409,219.82,409,261.37c0,32.89-11.05,62.55-28.77,83.5" transform="translate(-68.5 -103.9)" />
                        <path class="waves_3 cls-13" d="M356.14,313.09c11-13,17.83-31.34,17.83-51.72,0-25.74-10.94-48.29-27.31-60.8" transform="translate(-68.5 -103.9)" />
                        <path class="waves_4 cls-13" d="M330,234.7c7.18,5.49,12,15.38,12,26.67a35.19,35.19,0,0,1-7.82,22.69" transform="translate(-68.5 -103.9)" />
                        <path class="waves_5 cls-13" d="M330,234.7" transform="translate(-68.5 -103.9)" />
                    </g>
                </svg>

                <a href="/" rel="prev" slot="footer">Home</a>
                <a href="#wave/sequence-of-numbers" rel="next" slot="footer">Sequence of numbers</a>
            </element-article>
        `;
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: {},
        };
    }

    async onBeforeLeave(location, commands, router) {
        try {
            const result = await record({
                ...this.properties,
                to: Date.now(),
            }, validator(location.route.parent.children.length - 1));

            if (result) {
                this.dispatchEvent(new CustomEvent('update-score', {
                    composed: true,
                    detail: result,
                }));
            }

        } catch (e) {
            console.warn(e);
        }
    }
}
const componentName = 'page-wave';
window.customElements.define(componentName, PageWave);
export default PageWave;
export {componentName as name};
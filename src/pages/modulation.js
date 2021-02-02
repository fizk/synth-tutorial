import '../elements/article.js';
import validator, { record } from '../database/db.js';

class PageModulation extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .diagram {
                    background-color: var(--screen-background-color);
                }
                .diagram__selection {
                    fill: var(--screen-selection);
                    stroke: none;
                }
                .diagram__path {
                    fill: none;
                    stroke-width: var(--screen-line-width);
                    stroke: var(--screen-line-color);
                }
                .diagram__text {
                    fill: var(--screen-line-color);
                    stroke: none;
                }
                .diagram__path--fill {
                    fill: var(--screen-line-color);
                    stroke-width: var(--screen-line-width);
                    stroke: none;
                }
            </style>
            <element-article>
                <h2 slot="header">Modulation</h2>
                <p>
                    Modulation is the process of using one sinusoid to modify another sinusoid, or to blend them together.
                </p>

                <p>
                    In the Oscillator examples there were two sliders to control. The amount and the frequency. We had to
                    manually control them by hand. Is there a way we could automate this? Yes there is: Remember that the
                    Gain unit expected <em>an amount</em> that was some number. Do we know of anything that can generate
                    number automatically? Yes, the Oscillator. Can we somehow connect an Oscillator to the Gain and have
                    in control the volume? Yes, we can modulate the Gain with a modulator.
                </p>

                <p>
                    Modulation is always composed out of two parts: The <strong>Carrier</strong>, that is the
                    Oscillator that we will hear, it carries the sound. And the <strong>Modulation Unit</strong>. Inside
                    the Modulation Unit we will have one Oscillator, that one will be called the <strong>Modulator</strong>
                    and then we could have some additional modules like Gain or Envelope.
                </p>
                <img slot="aside" src="https://www.taitradioacademy.com/wp-content/uploads/2014/10/Image-8.png" style="width: 100%;" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 559 440" class="diagram" slot="aside">
                    <g fill="none" fill-rule="evenodd">
                        <path class="diagram__selection" d="M289 19h246v232H289z"/>
                        <path class="diagram__path" d="M95 350h197v71H95z"/>
                        <text class="diagram__text" transform="translate(95 350)">
                            <tspan x="19" y="41">Master</tspan>
                        </text>
                        <path class="diagram__path" d="M24 196h197v71H24z"/>
                        <path class="diagram__path" d="M153 232c3.3333-6.6667
                            6.6667-10 10-10 3.3333 0 6.6667 3.3333 10 10 3.3333 6.6667 6.6667
                            10 10 10 3.3333 0 6.6667-3.3333 10-10"/>
                        <text class="diagram__text" transform="translate(24 196)">
                            <tspan x="19" y="41">Carrier</tspan>
                        </text>
                        <path class="diagram__path" d="M314 48h197v71H314z"/>
                        <path class="diagram__path" d="M443 84c3.3333-6.6667 6.6667-10 10-10
                            3.3333 0 6.6667 3.3333 10 10 3.3333 6.6667 6.6667 10 10 10
                            3.3333 0 6.6667-3.3333 10-10"/>
                        <text class="diagram__text" transform="translate(333 74)">
                            <tspan x="0" y="15">Modulator</tspan>
                        </text>
                        <path class="diagram__path" d="M314 156h197v71H314z"/>
                        <g transform="translate(435 186)" class="diagram__path">
                            <path d="M.5 6.5h20m16 0h20" stroke-linecap="square"/>
                            <circle cx="28" cy="6" r="6"/>
                        </g>
                        <text class="diagram__text" transform="translate(333 182)">
                            <tspan x="0" y="15">Gain</tspan>
                        </text>
                        <path class="diagram__path--fill" d="M403.0292 117.9712l3.9996.058-.029
                            1.9998-.1528 10.502 9.9995.1454L404.5 154.5l-11.651-24.1714
                            9.999.1444.1522-10.502.029-1.9998zM169.2564 268.7436l4 .0128-.0064
                            2-.174 54.2496 10.0006.0325L171 349l-11.9233-24.0382
                            10.0003.0312.173-54.2494.0064-2zM246 202v9.999l70 .001v4l-70-.001V226l-24-12 24-12z"/>
                    </g>
                    </svg>
                <a href="#envelope/epilogue" slop="footer" rel="prev">Envelope's epilogue</a>
                <a href="#modulation/lfo" slop="footer" rel="next">LFO</a>
            </element-article>
            <article>
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

window.customElements.define('page-modulation', PageModulation);
export default PageModulation;
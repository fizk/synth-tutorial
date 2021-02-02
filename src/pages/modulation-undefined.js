import '../elements/article.js'
import validator, { record } from '../database/db.js';

class PageModulationUndefined extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .diagram {
                    background-color: var(--screen-background-color);
                    width: 50%;
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
                <h2 slot="header">Undefined</h2>
                <p>
                    Let's explore a different kind of modulation. In the LFO example, we had control over the <strong>rate</strong>.
                    What if we would have the carrier be in control of the modulation rate?
                </p>
                <p>
                    So let's say that the carrier was producing frequency of 440Hz and the modulator would be modulating at 880Hz, or
                    twice the rate of the carrier. If the carrier would then move its frequency up to 880Hz, the modulator would
                    move its frequency up to 1760Hz.
                </p>
                <p>
                    Keeping the ratio between the modulator and the carrier produces some interesting side effects.
                </p>
                <p>
                    The new unit's inner workings will be as followed. An input (from the carrier) of say, 440Hz will enter the first gain. Let's say that
                    it is tuned to <code>2</code>, converting the input into 880Hz. We will call that the <strong>index</strong>.
                    It constructs the Modulator to modulate at 880Hz. This signal will then be sent to the second Gain, it will control how much of the
                    modulation is sent out. <code>1</code> being full modulation. <code>0.5</code> being half of the modulation.
                </p>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 252 468" slot="aside" class="diagram">
                    <g>
                        <path class="diagram__path" d="M29,218h197v71H29V218z"/>
                        <path class="diagram__path" d="M158,254c3.3-6.7,6.7-10,10-10s6.7,3.3,10,10c3.3,6.7,6.7,10,10,10s6.7-3.3,10-10"/>
                        <text transform="matrix(1 0 0 1 46.6699 257.3214)" class="diagram__text">Modulator</text>
                    </g>
                    <g>
                        <path class="diagram__path" d="M29,372h197v71H29V372z"/>
                        <path class="diagram__path" d="M150.5,408.5h20 M186.5,408.5h20"/>
                        <circle class="diagram__path" cx="178" cy="408" r="6"/>
                        <text transform="matrix(1 0 0 1 46.6699 413.1793)" class="diagram__text">Gain</text>
                    </g>
                    <g>
                        <path class="diagram__path" d="M29,82h197v71H29V82z"/>
                        <path class="diagram__path" d="M150.5,118.5h20 M186.5,118.5h20"/>
                        <circle class="diagram__path" cx="178" cy="118" r="6"/>
                        <text transform="matrix(1 0 0 1 46.6699 120.8521)" class="diagram__text">Gain</text>
                    </g>
                    <path class="diagram__path--fill" d="M122.5,153v42h10l-12,24l-12-24h10v-42H122.5z"/>
                    <path class="diagram__path--fill" d="M122,288v59h10l-12,24l-12-24h10v-59H122z"/>
                    <path class="diagram__path--fill" d="M122.5,17v42h10l-12,24l-12-24h10V17H122.5z"/>
                </svg>

                <a href="#modulation/am" rel="prev" slot="footer">Amplitude modulation</a>
                <a href="#modulation/am-synth" rel="next" slot="footer">AM Synth</a>
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

window.customElements.define('page-modulation-undefined', PageModulationUndefined);
export default PageModulationUndefined;
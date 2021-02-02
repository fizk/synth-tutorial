import '../pads/envelope-frequency.js';
import '../elements/article.js';
import validator, { record } from '../database/db.js';

class PageEnvelope extends HTMLElement {
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

                figure {
                    margin: 2rem 0;
                    display: flex;
                    flex-direction: row;
                }
                figure svg {
                    height: 100%;
                    width: 100%;
                    flex-grow: 1;
                    flex-basis: 0;
                }
                figure h4 {
                    margin-top: 0;
                    margin-bottom: 0.8rem;
                }
                figcaption {
                    flex-grow: 1;
                    flex-basis: 0;
                    padding: 0 0.8rem;
                    font-size: 0.8rem;
                }
            </style>
            <element-article>
                <h2 slot="header">Envelope</h2>
                <p>
                    Another gadget in our toolbox is the <strong>Envelope</strong>. Think of it as the verb
                </p>
                <blockquote>
                    wrap up, cover, or surround completely.
                </blockquote>
                <p>
                    Noting in the physical wold can go from full stop to full speed in no time at all. It has to ramp up to
                    its target velocity and ramp down before it comes to a complete stop. To mimic this organic behavior we wrap
                    our source with an Envelope and use it to define its lifecycle or the journey.
                </p>
                <p>
                    There are many types of Envelopes<a href="https://en.wikipedia.org/wiki/Envelope_(music)" target="_blank"><sup>[1]</sup></a>,
                    but the one most used one is the <strong>ADSR</strong> Envelope. It is a little bit
                    similar to the Gain, as it takes in an input and adds a multiplier to it before returning. The Envelope
                    will have many multipliers that are applied one after the other through the lifecycle of the Envelope.
                </p>
                <p>
                    This can have may practical applications. One is to control gain or volume. Another one
                    would be to open and close filters as we will see later.
                </p>
                <p slot="aside">
                    In the example below, the ADSR Envelope is used to control pitch. Press the Spacebar and hold it in to
                    see the <strong>ADS</strong> part, release it to see the <strong>R</strong> part.
                </p>
                <p slot="aside">
                    Change the sliders to see how different configuration will produce different effects.
                </p>

                <pad-envelope-frequency slot="aside"></pad-envelope-frequency>

                <figure>
                    <svg class="diagram" viewBox="0 0 403 105" xmlns="http://www.w3.org/2000/svg">
                        <path class="diagram__selection" d="M52 53l50-50v100H2z"/>
                        <path class="diagram__path" d="M2 103L102 3l100 50h100l100 50"/>
                    </svg>
                    <figcaption>
                        <h4>A is for attack</h4>
                        The attack controlls how long it takes for the Envelope to reach its maximmum amplitude.
                    </figcaption>
                </figure>

                <figure>
                    <svg class="diagram" viewBox="0 0 403 105" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <path class="diagram__selection" d="M102 3l100 50v50H102z"/>
                            <path class="diagram__path" d="M2 103L102 3l100 50h100l100 50"/>
                        </g>
                    </svg>
                    <figcaption>
                        <h4>D is for decay</h4>
                        Once the attack has reach it's maximum amplitude, the decay will take over and control
                        how long its takes for the Envelope to reach its target or desired amplitude.
                    </figcaption>
                </figure>
                <figure>
                    <svg class="diagram" viewBox="0 0 403 105" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <path class="diagram__selection" d="M202 53h100v50H202z"/>
                            <path class="diagram__path" d="M2 103L102 3l100 50h100l100 50"/>
                        </g>
                    </svg>
                    <figcaption>
                        <h4>S is for sustain</h4>
                        The sustain is the desired amplitude, and it will sustain that amplitude until it is
                        released.
                    </figcaption>
                </figure>

                <figure>
                    <svg class="diagram" viewBox="0 0 403 105" xmlns="http://www.w3.org/2000/svg">
                        <g fill="none" fill-rule="evenodd">
                            <path class="diagram__selection" d="M302 53l58.627 29.7832L402 103H302z"/>
                            <path class="diagram__path" d="M2 103L102 3l100 50h100l100 50"/>
                        </g>
                    </svg>
                    <figcaption>
                        <h4>R is for release</h4>
                        Finally, the release will control long it will take for the Envelope to go to its
                        minimum amplitude.
                    </figcaption>
                </figure>

                <a href="#oscillator/epilogue" slot="footer" rel="prev">Oscillator's Epilogue</a>
                <a href="#envelope/adsr" slot="footer" rel="next">ADSR</a>
            </element-article>
        `;
    }

    connectedCallback() {
        this.addEventListener('a-change', () => this.properties.object.tweek = true);
        this.addEventListener('d-change', () => this.properties.object.tweek = true);
        this.addEventListener('s-change', () => this.properties.object.tweek = true);
        this.addEventListener('r-change', () => this.properties.object.tweek = true);
        this.addEventListener('start', () => this.properties.object.toggle = true);
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: { tweek: false, toggle: false },
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

window.customElements.define('page-envelope', PageEnvelope);
export default PageEnvelope;
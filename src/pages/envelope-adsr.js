import '../elements/article.js';
import '../pads/envelope-synth.js'
import validator, { record } from '../database/db.js';

class PageEnvelopeAdsr extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Control the gain</h2>
                <p>
                    Here we put the ADSR to a good use. We will connect it to a Gain and used it to control the volume
                    of a sine-wave over time.
                </p>
                <p>
                    Have a play with the sliders of the Envelope for different effect. There are also some presets at the
                    top.
                </p>
                <p>
                    Use can use either the keys on your computer keyboard or click the little keys on the mini-keyboard in
                    the workstation to produce different notes. Hold in the note or key to see the full lifecycle of the ADSR
                </p>
                <div slot="aside">
                    <button data-button-preset-bell>Bell</button>
                    <button data-button-preset-strings>String</button>
                    <button data-button-preset-reset>Reset</button>
                </div>

                <pad-envelope-synth slot="aside"></pad-envelope-synth>

                <a href="#envelope" slot="footer" rel="prev">Envelope</a>
                <a href="#envelope/epilogue" slot="footer" rel="next">Epilogue</a>
            </element-article>
        `;
    }

    connectedCallback() {
        this.addEventListener('start', () => this.properties.object.toggle = true);
        this.addEventListener('a-change', () => this.properties.object.tweek = true);
        this.addEventListener('d-change', () => this.properties.object.tweek = true);
        this.addEventListener('s-change', () => this.properties.object.tweek = true);
        this.addEventListener('r-change', () => this.properties.object.tweek = true);

        //presets
        this.shadowRoot.querySelector('[data-button-preset-bell]').addEventListener('click', () => {
            const envelopeElement = this.shadowRoot.querySelector('pad-envelope-synth');
            envelopeElement.setAttribute('a', '1');
            envelopeElement.setAttribute('d', '10');
            envelopeElement.setAttribute('s', '20');
            envelopeElement.setAttribute('r', '100');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-button-preset-strings]').addEventListener('click', () => {
            const envelopeElement = this.shadowRoot.querySelector('pad-envelope-synth');
            envelopeElement.setAttribute('a', '100');
            envelopeElement.setAttribute('d', '90');
            envelopeElement.setAttribute('s', '90');
            envelopeElement.setAttribute('r', '50');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-button-preset-reset]').addEventListener('click', () => {
            const envelopeElement = this.shadowRoot.querySelector('pad-envelope-synth');
            envelopeElement.setAttribute('a', '100');
            envelopeElement.setAttribute('d', '100');
            envelopeElement.setAttribute('s', '50');
            envelopeElement.setAttribute('r', '100');
            this.properties.object.preset = true;
        });
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: { tweek: false, toggle: false, preset: false },
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

window.customElements.define('page-envelope-adsr', PageEnvelopeAdsr);
export default PageEnvelopeAdsr;
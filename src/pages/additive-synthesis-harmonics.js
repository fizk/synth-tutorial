import '../elements/article.js';
import '../pads/harmonic-synth.js';
import validator, { record } from '../database/db.js';

class PageAdditiveSynthesisHarmonics extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Harmonics</h2>
                <p>
                    But how does this sound? Here are 9 harmonically related oscillators routed through a Gain before they go into the Master.
                    The harmonic relation goes 440Hz, 880Hz, 1320Hz, 1760Hz...
                    Have a play with the sliders which control the amplitude to produce different sound.
                    Additionally there are presets at the top to produce each of the significant wave-type.
                </p>
                <p>
                    Notice how the Master's frequency-scope now has many peeks depending on the wave-type you are producing.
                </p>
                <div slot="aside">
                    <button data-preset-sine>sine</button>
                    <button data-preset-square>square</button>
                    <button data-preset-saw>saw</button>
                    <button data-preset-tri>tri</button>
                </div>
                <pad-harmonic-synth slot="aside"></pad-harmonic-synth>
                <a href="#additive-synthesis/builder" slot="footer" rel="prev">Wave Builder</a>
                <a href="#additive-synthesis/adsr" slot="footer" rel="next">ADSR</a>
            </element-article>
        `;
    }

    connectedCallback() {
        this.addEventListener('change', () => this.properties.object.tweek = true);
        this.addEventListener('toggle', () => this.properties.object.toggle = true);

        const harmonicSynthElement = this.shadowRoot.querySelector('pad-harmonic-synth');
        this.shadowRoot.querySelector('[data-preset-sine]').addEventListener('click', () => {
            harmonicSynthElement.setAttribute('type', 'sine');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-square]').addEventListener('click', () => {
            harmonicSynthElement.setAttribute('type', 'square');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-saw]').addEventListener('click', () => {
            harmonicSynthElement.setAttribute('type', 'saw');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-tri]').addEventListener('click', () => {
            harmonicSynthElement.setAttribute('type', 'tri');
            this.properties.object.preset = true;
        });
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: { toggle: false, tweek: false, preset: false },
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

window.customElements.define('page-additive-synthesis-harmonics', PageAdditiveSynthesisHarmonics);
export default PageAdditiveSynthesisHarmonics;
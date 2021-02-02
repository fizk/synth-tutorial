import '../elements/article.js';
import '../pads/additive-adsr-synth.js';
import validator, { record } from '../database/db.js';

class PageAdditiveSynthesisAdsr extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Additive synthesis and ADSR</h2>
                <p>
                    Where it becomes interesting is when we manipulate the amplitude of the harmonics over time. To active this
                    we employee our trusty ADSR.
                </p>
                <p>
					We will set the attach and release time to zero. We will set our sustain level to
                    zero as well, but then we vary our decay time: least amount for the highest harmonic and then work our
                    way backwards, ending up with the most amount for the lowest harmonic.
                </p>
                <p>
                    We should see the amplitude role off from right to left as the tone sustains.
                </p>
                <p>
                    Let's try it out with a few different harmonics.
                </p>
                <div slot="aside">
                    <button data-preset-1>1</button>
                    <button data-preset-2>2</button>
                    <button data-preset-3>3</button>
                </div>
                <pad-additive-adsr-synth slot="aside"></pad-additive-adsr-synth>
                <a href="#additive-synthesis/harmonics" slot="footer" rel="prev">Harmonics</a>
                <a href="#additive-synthesis/epilogue" slot="footer" rel="next">Epilogue</a>
            </element-article>
        `;
    }

    connectedCallback() {
        this.addEventListener('start', () => this.properties.object.toggle = true);

        const additiveSynthElement = this.shadowRoot.querySelector('pad-additive-adsr-synth');
        this.shadowRoot.querySelector('[data-preset-1]').addEventListener('click', () => {
            additiveSynthElement.setAttribute('harmonic', '1');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-2]').addEventListener('click', () => {
            additiveSynthElement.setAttribute('harmonic', '2');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-3]').addEventListener('click', () => {
            additiveSynthElement.setAttribute('harmonic', '3');
            this.properties.object.preset = true;
        });
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: { toggle: false, preset: false },
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

window.customElements.define('page-additive-synthesis-adsr', PageAdditiveSynthesisAdsr);
export default PageAdditiveSynthesisAdsr;
import '../elements/article.js';
import '../pads/oscillator-one.js'
import validator, { record } from '../database/db.js';

class PageOscillator extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">The Oscillator</h2>
                <p>
                    The <strong>Oscillator</strong> is an object that can generate a sequence of
                    numbers over time. It will be our sine wave generator. The names comes from
                    the fact that it oscillates from one number to the other.
                </p>
                <p>
                    We have seen previously how to manipulate the <strong>frequency</strong> of a sine
                    wave and said that it controlls the <strong>pich</strong>. We have also seen how
                    we can route the output of a sine wave generator into a <strong>gain</strong> to
                    control the <strong>volume</strong>.
                </p>
                <p>
                    Turn on the workstation to the right and play with the sliders,
                    producing different piches and amplitudes. Monitor how the final wave is outputted through
                    the <strong>Master</strong> which represents the final output.
                </p>

                <pad-oscillator-one slot="aside"></pad-oscillator-one>

                <a href="#wave/epilogue" slot="footer" rel="prev">Wave's Epilogue</a>
                <a href="#oscillator/theremin" slot="footer" rel="next">Theremin</a>
            </element-article>
        `;
    }

    connectedCallback() {
        this.addEventListener('frequency-change', () => this.properties.object.tweek = true);
        this.addEventListener('amount-change', () => this.properties.object.tweek = true);
        this.addEventListener('toggle', () => this.properties.object.toggle = true);
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

window.customElements.define('page-oscillator', PageOscillator);
export default PageOscillator;
import '../elements/sine-wave.js';
import '../elements/workstation.js';
import '../machines/gain.js';
import '../elements/article.js';
import validator, { record } from '../database/db.js';

class PageWaveGainAmplitude extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Gain and Amplitude</h2>
                <p>
                    Rather that having the wave's domain being <code>[-1, 1]</code>, it is often required
                    to change it be for example: <code>[-0.5, 0.5]</code>.
                </p>
                <p>
                    For this we have the <strong>Gain</strong> function. It's a little module that
                    takes as its input, a source. It then multiplies it with some factor
                    <strong>amount</strong> before it returns the result through its output.
                </p>
                <p>
                    An amount of <code>1</code> will not change the input. Amount of <code>0.5</code>
                    will half the wave, while an amount of <code>2</code> will double it.
                </p>
                <p>
                	In digital processors this is as easy as adding a few circuits or in a computer,
                	to program a simple function.
                </p>
                <pre>output = (input, gain) => input × gain</pre>
                <p>
                    The simplest use-case for this is to increase or decrease volume or amplitude.
                </p>
                <p slot="aside">
                    Change the Gain's amount with the slider and see the effect on the output wave.
                </p>

                <element-workstation slot="aside">
                    <sine-wave frequency="440" amplitude="20"></sine-wave>
                    <machine-gain min="0" max="2" amount="1"></machine-gain>
                    <sine-wave data-sine frequency="440" amplitude="20"></sine-wave>
                </element-workstation>

                <a href="#wave/measure-the-wave" rel="prev" slot="footer">Measure the wave</a>
                <a href="#wave/epilogue" rel="next" slot="footer">Epilogue</a>
            </element-article>
        `;
    }

    connectedCallback() {
        const gainElement = this.shadowRoot.querySelector('machine-gain');
        const sineWaveElement = this.shadowRoot.querySelector('[data-sine]');
        gainElement.addEventListener('amount-change', (event) => {
            sineWaveElement.setAttribute('amplitude', String(event.detail) * 20);
            this.properties.object.gain = true;
        });
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: { gain: false }
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

window.customElements.define('page-wave-gain-amplitude', PageWaveGainAmplitude);
export default PageWaveGainAmplitude;
import '../elements/wave-builder.js';
import '../elements/article.js';
import validator, { record } from '../database/db.js';

class PageAdditiveSynthesisBuilder extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">Wave builder</h2>
                <blockquote>
                    Baron Jean Baptiste Joseph Fourier (1768−1830) introduced the idea that any periodic function can be
                    represented by a series of sines and cosines which are harmonically
                    related<sup><a href="https://www.math24.net/fourier-series-definition-typical-examples/" target="_blank">[1]</a></sup>.
                </blockquote>
                <p>
                    To the right is a series of 12 harmonically related sine-waves, (Each of harmonics is <em>two times</em> the previous one)
                    each with an amplitude slider. The top wave is the Fourier-sum of all the harmonics. Have a play with the slider and see what
                    strange shape you can produce.
                </p>
                <p>
                    There are a few configurations that are more harmonic than others. You can produce them by clicking on of the preset buttons at the
                    top of the wave-builder.
                </p>
                <dl>
                    <dt>Sine</dt>
                    <dd>
                        <p>The sine-wave contains only the fundamental. It is the purest wave and is used to build other wave types.</p>
                    </dd>

                    <dt>Sawtooth</dt>
                    <dd>
                        <p>The sawtooth-wave contains all the harmonics with amplitude: one divided by the harmonics' frequency.</p>
                        <pre>amp := 1 / harmonic</pre>
                    </dd>

                    <dt>Square</dt>
                    <dd>
                        <p>The square-wave contains only the odd harmonics with amplitude: one divided by the harmonics' frequency.</p>
                        <pre>amp := (if odd) 1 / harmonic (else) 0</pre>
                    </dd>


                    <dt>Triangular</dt>
                    <dd>
                        <p>The square-wave contains only the odd harmonics with amplitude: one divided by the harmonics' frequency squared.</p>
                        <pre>amp := (if odd) 1 / harmonic<sup>2</sup> (else) 0</pre>
                    </dd>
                </dl>

                <button data-preset-sine slot="aside">sine</button>
                <button data-preset-sawtooth slot="aside">sawtooth</button>
                <button data-preset-square slot="aside">square</button>
                <button data-preset-tri slot="aside">tri</button>
                <element-wave-builder slot="aside"></element-wave-builder>

                <a href="#additive-synthesis" rel="prev" slot="footer">Additive Synthesis</a>
                <a href="#additive-synthesis/harmonics" rel="next" slot="footer">Harmonics</a>
            </element-article>
        `;
    }

    connectedCallback() {
        this.addEventListener('change', () => this.properties.object.tweek = true);

        const series = this.shadowRoot.querySelector('element-wave-builder');
        this.shadowRoot.querySelector('[data-preset-sine]').addEventListener('click', () => {
            series.setAttribute('type', 'sine');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-sawtooth]').addEventListener('click', () => {
            series.setAttribute('type', 'saw');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-square]').addEventListener('click', () => {
            series.setAttribute('type', 'square');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-tri]').addEventListener('click', () => {
            series.setAttribute('type', 'tri');
            this.properties.object.preset = true;
        });
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: { tweek: false, preset: false },
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

window.customElements.define('page-additive-synthesis-builder', PageAdditiveSynthesisBuilder);
export default PageAdditiveSynthesisBuilder;
import '../elements/article.js';
import '../pads/amplitude-synth.js';
import validator, { record } from '../database/db.js';

class PageModulationAmSynth extends HTMLElement {
    constructor() {
        super();
        this.properties = {};
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <element-article>
                <h2 slot="header">AM Synth</h2>
                <p>
                    Building off of what we have discussed, let's build a patch.
                </p>
                <p>
                    First we have the Carrier. It is connected to a Gain which is in turn connected to the Master. The carrier is here
                    represented as a keyboard but it is just as the Oscillators we have seen previously. Each note on the keyboard is
                    assign a frequency in the "equal tempered scale" and when it is pressed, it will fire of an Oscillator with that frequency.
                </p>
                <p>
                    The keyboard is also connected to the Undefined unit. The frequency that is picked by the keyboard is therefor
                    also sent there. The Undefined unit has a <strong>index</strong> slider. It will control how much the carrier frequency
                    will be multiplied by.
                </p>
                <p>
                    Finally, the Undefined unit is connected to the Gain unit that is to be modulated.
                </p>
                <p> So, the note we strike is 440Hz, the Undefined's index is <code>2</code> and the amount is <code>0.5</code>
                    When a note is struck on the keyboard, the carrier will play the 440Hz note, but the Gain will
                    go from 0 to 0.5 to 0 again, 880 times per second.
                </p>
                <p>
                    One might think that the result would be an fast tremolo effect, but something else happens. We get an interesting
                    <a href="https://en.wikipedia.org/wiki/Timbre">timbre</a>.  One thing to notice though. When the <strong>index</strong>
                    maintains a relationship with the carrier: say, <code>0.5</code> for half the carrier frequency or <strong>2</strong>
                    for twice the carrier frequency we get a harmonic sound. But if there is no relation, say <strong>index</strong> is at
                    <code>2.7</code> we get inharmonicity.
                </p>

                <div slot="aside">
                    <button data-preset-1 >Preset 1</button>
                    <button data-preset-2>Preset 2</button>
                    <button data-preset-3>Preset 3</button>
                </div>
                <pad-amplitude-synth slot="aside"></pad-amplitude-synth>

                <p slot="aside">
                    The reason this is happening, while not complicated, involves a little bit of math and a little
                    bit of theory <a href="https://www.soundonsound.com/techniques/amplitude-modulation"><sup>[1]</sup></a>.
                    For our purposes, it's sufficient to hear the impact amplitude modulation has.
                </p>
                <p slot="aside">
                    Have a play with the sliders, or try out the presets.
                </p>
                <a href="#modulation/undefined" slot="footer" rel="prev">undefined</a>
                <a href="#modulation/fm-synth" slot="footer" rel="next">FM Synth</a>
            </element-article>
        `;
    }

    connectedCallback() {
        this.addEventListener('index-change', () => this.properties.object.tweek = true);
        this.addEventListener('amount-change', () => this.properties.object.tweek = true);
        this.addEventListener('frequency-change', () => this.properties.object.tweek = true);
        this.addEventListener('start', () => this.properties.object.toggle = true);

        this.shadowRoot.querySelector('[data-preset-1]').addEventListener('click', () => {
            const synthElement = this.shadowRoot.querySelector('pad-amplitude-synth');
            synthElement.setAttribute('index', '0.5');
            synthElement.setAttribute('amount', '0.5');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-2]').addEventListener('click', () => {
            const synthElement = this.shadowRoot.querySelector('pad-amplitude-synth');
            synthElement.setAttribute('index', '4');
            synthElement.setAttribute('amount', '0.5');
            this.properties.object.preset = true;
        });
        this.shadowRoot.querySelector('[data-preset-3]').addEventListener('click', () => {
            const synthElement = this.shadowRoot.querySelector('pad-amplitude-synth');
            synthElement.setAttribute('index', '2.3');
            synthElement.setAttribute('amount', '1');
            this.properties.object.preset = true;
        });
    }

    onAfterEnter(location) {
        this.properties = {
            from: Date.now(),
            path: location.pathname,
            relm: location.pathname.split('/').filter(Boolean)[0],
            object: { tweek: false, toggle: false, preset: false }
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

window.customElements.define('page-modulation-am-synth', PageModulationAmSynth);
export default PageModulationAmSynth;
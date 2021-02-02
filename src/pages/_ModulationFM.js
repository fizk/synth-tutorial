import '../elements/workstation.js';
import '../machines/gain.js';
import '../machines/lfo.js';
import '../machines/oscillator.js';
import '../machines/master.js';
import '../machines/keyboard.js';
import '../machines/toggle.js';

const template = document.createElement('template');
template.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                article {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-template-areas:
                        "header header"
                        "main aside"
                        "footer aside";
                    grid-gap: 1rem;
                    max-width: 860px;
                }
                header{
                    grid-area: header;
                }
                main{
                    grid-area: main;
                }
                aside{
                    grid-area: aside;
                }
                footer{
                    grid-area: footer;
                    text-align: end;
                }

                svg {
                    background-color: var(--screen-background-color);
                }

                figure {
                    text-align: center;
                }
                figcaption {
                    font-size: .8rem;
                }
            </style>
            <article>
                <header>
                    <h2>FM synth</h2>
                </header>
                <main>
                    <p>Let start by controlling the frequency of a carrier with an LFO</p>
                    <p>
                        Let's create a patch where we emplyee an Oscillator, that will be our carrier (our sound source).
                        We will need an LFO that will be our modulator. For good mesure, we we also include a Gain to control
                        the overall volume of our patch.
                    </p>
                    <p>
                        What we want to do is to use the LFO vary the frequency of the carrier a little bit in each direction.
                    </p>
                    <p>
                        The Oscillator inside our LFO will create a wave with a domain of <code>[-1, 1]</code>. Inside the LFO
                        is also a Gain that can amply the signal to widen the domain of the signal coming out. We need this
                        amplification because a change of 1Hz is not going to be audable to the human ear.
                    </p>
                    <p>
                        In the western music system, the middle A is 440Hz. The note before it (A♭) is 415.30Hz and the note
                        above it (A♯) is 466.16Hz. For our LFO to be able to create range of at least 25 units in eather direction
                        we need to change its amount's min/max configuration so it can vary in an auditable way.
                    </p>

                    </p>
                        <figure>
                            <svg xmlns="http://www.w3.org/2000/svg" width="340" height="99">
                                <g fill="none" fill-rule="evenodd">
                                    <g stroke="#FAEBD7" stroke-linecap="square">
                                        <path stroke-dasharray="2 2" d="M12.5.4219v80.1562M44.5.4219v80.1562M76.5.4219v80.1562M108.5.4219v80.1562M140.5.4219v80.1562" />
                                        <path d="M172.5.4219v80.1562" />
                                        <path stroke-dasharray="2 2" d="M204.5.4219v80.1562M236.5.4219v80.1562M268.5.4219v80.1562M300.5.4219v80.1562M332.5.4219v80.1562" />
                                    </g>
                                    <path fill="#B14A4A" opacity=".4341" d="M108 0h128v80H108z" />
                                    <g fill="#FAEBD7" font-size="9">
                                        <text transform="translate(37 86)">
                                            <tspan x="126" y="8">100Hz</tspan>
                                        </text>
                                        <text transform="translate(37 86)">
                                            <tspan x="190" y="8">120Hz</tspan>
                                        </text>
                                        <text transform="translate(37 86)">
                                            <tspan x="254" y="8">140Hz</tspan>
                                        </text>
                                        <text transform="translate(37 86)">
                                            <tspan x="0" y="8">60Hz</tspan>
                                        </text>
                                        <text transform="translate(37 86)">
                                            <tspan x="65" y="8">80Hz</tspan>
                                        </text>
                                    </g>
                                </g>
                            </svg>
                            <figcaption>
                                Sound produced is at 100Hz, the LFO's <strong>amount</strong> is set to 20Hz.
                                The sound heard will be a fluctuation between 80Hz and 120Hz. How fast this
                                happens is controlled by the LFO's <strong>rate</strong>.
                            </figcaption>
                        </figure>

                    <p>
                        NOw let's connect the LFO directly into our Oscillator/carrier.
                        The LFO's frequency slider is controlling how fast the deviation is going, The amount slider
                        is controlling how wide the deviation is.
                    </p>
                    <p>
                        Turn on the the workstation and hear it action. Preset 1 sents the sound to some 50s Space movie
                        effect. Preset 3 turns off the LFO. On Preset 2 you can see how the wave in the Master is contracting
                        and expanding in accordance to the wave generated in the LFO
                    </p>
                    <p></p>
                </main>
                <aside>
                    <button data-fm-preset-1>Preset 1</button>
                    <button data-fm-preset-2>Preset 2</button>
                    <button data-fm-preset-3>Preset 3</button>
                    <element-workstation data-worstation-fm>
                        <machine-toggle></machine-toggle>
                        <machine-oscillator data-oscillator-fm frequency="440"></machine-oscillator>
                        <machine-lfo data-lfo-fm min="0" max="880" amount="440"></machine-lfo>
                        <machine-gain data-gain-fm amount="0.3"></machine-gain>
                        <machine-master data-master-fm></machine-master>
                    </element-workstation>
                </aside>
                <footer>
                    <a href="/modulation/lfo">LFO</a>
                    <a href="/modulation/fm-synth">FM synth</a>
                </footer>
            </article>
`;

export default class ModulationFM extends HTMLElement {


    constructor() {
        super();

        this.context;
        this.carrier;
        this.modulator;
        this.mainGain;
        this.masterGain;
        this.lfoGain;

        this.masterMonitor;
        this.lfoMonitor;
        this.carrierMonitor;

        this.animationFrame;
        this.fmDraw = this.fmDraw.bind(this);

        this.initFM = this.initFM.bind(this);


        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {

        this.shadowRoot.querySelector('machine-toggle').addEventListener('toggle', this.initFM);

        //LFO
        [

            this.shadowRoot.querySelector('[data-lfo-fm]'),
        ].forEach(element => element.addEventListener('frequency-change', (event) => {
            this.modulator && (this.modulator.frequency.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        [

            this.shadowRoot.querySelector('[data-lfo-fm]'),
        ].forEach(element => element.addEventListener('amount-change', (event) => {
            this.lfoGain && (this.lfoGain.gain.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        [

            this.shadowRoot.querySelector('[data-lfo-fm]'),
        ].forEach(element => element.addEventListener('type-change', (event) => {
            this.modulator && (this.modulator.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        //Carries
        [

            this.shadowRoot.querySelector('[data-oscillator-fm]'),
        ].forEach(element => element.addEventListener('frequency-change', (event) => {
            this.carrier && (this.carrier.frequency.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        [

            this.shadowRoot.querySelector('[data-oscillator-fm]'),
        ].forEach(element => element.addEventListener('type-change', (event) => {
            this.carrier && (this.carrier.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));

        //Gain
        [

            this.shadowRoot.querySelector('[data-gain-fm]'),
        ].forEach(element => element.addEventListener('amount-change', (event) => {
            this.mainGain && (this.mainGain.gain.linearRampToValueAtTime(event.detail, this.context.currentTime + 0.1));
        }));



        //FM presets
        this.shadowRoot.querySelector('[data-fm-preset-1]').addEventListener('click', () => {
            this.shadowRoot.querySelector('[data-oscillator-fm]').setAttribute('frequency', '440');
            this.carrier && (this.carrier.frequency.value = 440);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('frequency', '10');
            this.modulator && (this.modulator.frequency.value = 10);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('amount', '440');
            this.lfoGain && (this.lfoGain.gain.value = 440);
        });
        this.shadowRoot.querySelector('[data-fm-preset-2]').addEventListener('click', () => {
            this.shadowRoot.querySelector('[data-oscillator-fm]').setAttribute('frequency', '440');
            this.carrier && (this.carrier.frequency.value = 440);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('frequency', '1');
            this.modulator && (this.modulator.frequency.value = 1);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('amount', '880');
            this.lfoGain && (this.lfoGain.gain.value = 880);
        });
        this.shadowRoot.querySelector('[data-fm-preset-3]').addEventListener('click', () => {

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('frequency', '0');
            this.modulator && (this.modulator.frequency.value = 0);

            this.shadowRoot.querySelector('[data-lfo-fm]').setAttribute('amount', '0');
            this.lfoGain && (this.lfoGain.gain.value = 0);
        });

    }

    disconnectedCallback() {
        this.carrier && this.carrier.stop(this.context.currentTime)
        this.modulator && this.modulator.stop(this.context.currentTime);
        cancelAnimationFrame(this.animationFrame);
    }

    initFM(event) {
        if (event.detail) {

            const carrierElement = this.shadowRoot.querySelector('[data-oscillator-fm]');
            const lfoElement = this.shadowRoot.querySelector('[data-lfo-fm]');
            const gainElement = this.shadowRoot.querySelector('[data-gain-fm]');

            this.context = new AudioContext();

            this.masterMonitor = this.context.createAnalyser();
            this.lfoMonitor = this.context.createAnalyser();
            this.carrierMonitor = this.context.createAnalyser();

            this.carrier = this.context.createOscillator();
            this.carrier.frequency.value = Number(carrierElement.getAttribute('frequency'));
            this.modulator = this.context.createOscillator();
            this.modulator.frequency.value = Number(lfoElement.getAttribute('frequency'));

            this.mainGain = this.context.createGain();
            this.mainGain.gain.value = Number(gainElement.getAttribute('amount'));
            this.lfoGain = this.context.createGain();
            this.lfoGain.gain.value = Number(lfoElement.getAttribute('amount'));


            this.modulator.connect(this.lfoGain);
            this.lfoGain.connect(this.lfoMonitor);
            this.lfoMonitor.connect(this.carrier.detune);

            this.carrier.connect(this.carrierMonitor)
            this.carrierMonitor.connect(this.mainGain);

            this.mainGain.connect(this.masterMonitor);
            this.masterMonitor.connect(this.context.destination);

            this.carrier.start(this.context.currentTime)
            this.modulator.start(this.context.currentTime);

            cancelAnimationFrame(this.animationFrame);
            this.fmDraw();

        } else {
            this.carrier.stop(this.context.currentTime)
            this.modulator.stop(this.context.currentTime);
            this.carrier = undefined;
            this.modulator = undefined;
            cancelAnimationFrame(this.animationFrame);
        }
    }

    fmDraw() {
        // master monitor
        this.masterMonitor.fftSize = 2048;
        const amMasterMonitorDataArray = new Uint8Array(this.masterMonitor.frequencyBinCount);
        this.masterMonitor.getByteTimeDomainData(amMasterMonitorDataArray);

        this.masterMonitor.fftSize = 512;
        this.masterMonitor.minDecibels = -140;
        this.masterMonitor.maxDecibels = 0;
        const amMasterMonitorByteArray = new Uint8Array(this.masterMonitor.frequencyBinCount);
        this.masterMonitor.getByteFrequencyData(amMasterMonitorByteArray);

        // lfo monitor
        this.lfoMonitor.fftSize = 2048;
        const amLFOMonitorDataArray = new Uint8Array(this.lfoMonitor.frequencyBinCount);
        this.lfoMonitor.getByteTimeDomainData(amLFOMonitorDataArray);

        // oscillator monitor
        this.carrierMonitor.fftSize = 2048;
        const amCarrierMonitorDataArray = new Uint8Array(this.carrierMonitor.frequencyBinCount);
        this.carrierMonitor.getByteTimeDomainData(amCarrierMonitorDataArray);

        this.shadowRoot.querySelector('[data-lfo-fm]').frequencyData = amLFOMonitorDataArray;
        this.shadowRoot.querySelector('[data-oscillator-fm]').frequencyData = amCarrierMonitorDataArray;
        this.shadowRoot.querySelector('[data-master-fm]').frequencyData = amMasterMonitorDataArray;
        this.shadowRoot.querySelector('[data-master-fm]').byteData = amMasterMonitorByteArray;


        this.animationFrame = requestAnimationFrame(this.fmDraw);
    }

}

window.customElements.define('page-modulation-fm', ModulationFM);
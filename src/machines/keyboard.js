window.customElements.define('machine-keyboard', class extends HTMLElement {
    constructor() {
        super();
        this.isKeyDown = false;
        this.map = {
            'KeyZ': 130.81,     // C3
            'KeyS': 138.59,     // C#3/Db3
            'KeyX': 146.83,     // D3
            'KeyD': 155.56,     // D#3/Eb3
            'KeyC': 164.81,     // E3
            'KeyV': 174.61,     // F3
            'KeyG': 185.00,     // F#3/Gb3
            'KeyB': 196.00,     // G3
            'KeyH': 207.65,     // G#3/Ab3
            'KeyN': 220.00,     // A3
            'KeyJ': 233.08,     // A#3/Bb3
            'KeyM': 246.94,     // B3
            'KeyQ': 261.63,     // C4
            'Digit2': 277.18,   // C#4/Db4
            'KeyW': 293.66,     // D4
            'Digit3': 311.13,   // D#4/Eb4
            'KeyE': 329.63,     // E4
            'KeyR': 349.23,     // F4
            'Digit5': 369.99,   // F#4/Gb4
            'KeyT': 392.00,     // G4
            'Digit6': 415.30,   // G#4/Ab4
            'KeyY': 440.00,     // A4
            'Digit7': 466.16,   // A#4/Bb4
            'KeyU': 493.88,     // B4
        };

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    padding: 1rem;
                    background-color: #F0F4C3;
                }
                .whole-tone {
                    fill: var(--whole-tone-fill-color, white);
                    stroke: var(--whole-tone-stroke-color, #979797);
                }
                .half-tone {
                    fill: var(--half-tone-color, black);
                    stroke: var(--half-tone-stroke-color, none);
                }
            </style>
            <select>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <svg width="248px" height="65px" viewBox="0 0 248 65" xmlns="http://www.w3.org/2000/svg">
                <g id="Group" transform="translate(-1, 0)">
                    <rect class="whole-tone" id="KeyU" x="231.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyY" x="214.5" y="0.5" width="16" height="64"></rect>
                    <rect class="whole-tone" id="KeyT" x="196.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyR" x="178.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyE" x="160.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyW" x="143.5" y="0.5" width="16" height="64"></rect>
                    <rect class="whole-tone" id="KeyQ" x="125.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyM" x="107.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyN" x="90.5" y="0.5" width="16" height="64"></rect>
                    <rect class="whole-tone" id="KeyB"  x="72.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyV"  x="54.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyC"  x="36.5" y="0.5" width="17" height="64"></rect>
                    <rect class="whole-tone" id="KeyX"  x="19.5" y="0.5" width="16" height="64"></rect>
                    <rect class="whole-tone" id="KeyZ"  x="2.5" y="0.5" width="16" height="64"></rect>


                    <rect class="half-tone" id="Digit7" x="225" y="0" width="13" height="43"></rect>
                    <rect class="half-tone" id="Digit6" x="207" y="0" width="13" height="43"></rect>
                    <rect class="half-tone" id="Digit5" x="189" y="0" width="14" height="43"></rect>
                    <rect class="half-tone" id="Digit3" x="154" y="0" width="13" height="43"></rect>
                    <rect class="half-tone" id="Digit2" x="136" y="0" width="14" height="43"></rect>
                    <rect class="half-tone" id="KeyJ" x="101" y="0" width="13" height="43"></rect>
                    <rect class="half-tone" id="KeyH"  x="83" y="0" width="13" height="43"></rect>
                    <rect class="half-tone" id="KeyG"  x="65" y="0" width="14" height="43"></rect>
                    <rect class="half-tone" id="KeyD"  x="30" y="0" width="13" height="43"></rect>
                    <rect class="half-tone" id="KeyS"  x="12" y="0" width="13" height="43"></rect>
                </g>
            </svg>
        `;
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.setupKeypad = this.setupKeypad.bind(this);
        this.teardownKeypad = this.teardownKeypad.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    static get observedAttributes() {
        return ['keys', 'octave'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'keys':
                newValue === null ? this.teardownKeypad() : this.setupKeypad();
                break;
            case 'octave':
                this.shadowRoot.querySelector('select').value = newValue;
                break;
        }
    }

    connectedCallback() {
        if (this.hasAttribute('keys')) {
            this.setupKeypad();
        }

        !this.hasAttribute('octave') && this.setAttribute('octave', '2');
        this.shadowRoot.querySelector('select').addEventListener('change', (event) => {
            this.setAttribute('octave', event.target.value);
        });

        Array.from(this.shadowRoot.querySelectorAll('rect')).forEach(item => {
            item.addEventListener('mousedown', this.onMouseDown);
            item.addEventListener('mouseup', this.onMouseUp);
        });
    }

    disconnectedCallback() {
        this.teardownKeypad();
    }

    onMouseDown(event) {
        this.dispatchEvent(new CustomEvent('start', {
            detail: this.noteToFrequency(event.target.getAttribute('id')),
            composed: true,
        }));
    }

    onMouseUp() {
        this.dispatchEvent(new CustomEvent('stop', {
            detail: undefined,
            composed: true,
        }));
    }

    onKeyDown(event) {
        if (this.isKeyDown) {
            return;
        }

        if (event.metaKey || event.shiftKey || event.ctrlKey || event.altKey) {
            return;
        }

        if (this.map[event.code] !== undefined) {
            event.preventDefault();
            this.dispatchEvent(new CustomEvent('start', {
                detail: this.noteToFrequency(event.code),
                bubbles: true,
                composed: true,
            }));
            this.isKeyDown = true;
        }
    }

    onKeyUp(event) {
        if (event.metaKey || event.shiftKey || event.ctrlKey || event.altKey || !this.isKeyDown) {
            return;
        }

        this.isKeyDown = false;

        this.dispatchEvent(new CustomEvent('stop', {
            detail: undefined,
            bubbles: true,
            composed: true,
        }));
    }

    transposeNote(noteOffset, baseFrequency = 440) {
        return baseFrequency * Math.pow(2, noteOffset / 12);
    }

    setupKeypad() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    teardownKeypad() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    noteToFrequency(note) {
        return this.map[note] * Number(this.getAttribute('octave'));
    }
});
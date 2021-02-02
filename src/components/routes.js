export default [
    [
        /^\/$/,
        async (route, current) => {
            const module = await import('../pages/home.js');
            return new module.default();
        }
    ],
    [
        /^\/wave$/, async (route, current) => {
            const module = await import('../pages/wave.js');
            return new module.default();
        }
    ],
    [
        /^\/wave\/sequence-of-numbers$/,
        async (route, current) => {
            const module = await import('../pages/wave-number-sequence.js');
            return new module.default();
        }
    ],
    [
        /^\/wave\/measure-the-wave$/,
        async (route, current) => {
            const module = await import('../pages/wave-measure.js');
            return new module.default();
        }
    ],
    [
        /^\/wave\/gain-and-amplitude$/,
        async (route, current) => {
            const module = await import('../pages/wave-gain-amplitude.js');
            return new module.default();
        }
    ],
    [
        /^\/wave\/epilogue$/,
        async (route, current) => {
            const module = await import('../pages/wave-epilogue.js');
            return new module.default();
        }
    ],
    [
        /^\/oscillator$/,
        async (route, current) => {
            const module = await import('../pages/oscillator.js');
            return new module.default();
        }
    ],
    [
        /^\/oscillator\/theremin$/,
        async (route, current) => {
            const module = await import('../pages/oscillator-theremin.js');
            return new module.default();
        }
    ],
    [
        /^\/oscillator\/epilogue$/,
        async (route, current) => {
            const module = await import('../pages/oscillator-epilogue.js');
            return new module.default();
        }
    ],
    [
        /^\/envelope$/,
        async (route, current) => {
            const module = await import('../pages/envelope.js');
            return new module.default();
        }
    ],
    [
        /^\/envelope\/adsr$/,
        async (route, current) => {
            const module = await import('../pages/envelope-adsr.js');
            return new module.default();
        }
    ],
    [
        /^\/envelope\/epilogue$/,
        async (route, current) => {
            const module = await import('../pages/envelope-epilogue.js');
            return new module.default();
        }
    ],
    [
        /^\/modulation$/,
        async (route, current) => {
            const module = await import('../pages/modulation.js');
            return new module.default();
        }
    ],
    [
        /^\/modulation\/lfo$/,
        async (route, current) => {
            const module = await import('../pages/modulation-lfo.js');
            return new module.default();
        }
    ],
    [
        /^\/modulation\/am$/,
        async (route, current) => {
            const module = await import('../pages/modulation-am.js');
            return new module.default();
        }
    ],
    [
        /^\/modulation\/undefined$/,
        async (route, current) => {
            const module = await import('../pages/modulation-undefined.js');
            return new module.default();
        }
    ],
    [
        /^\/modulation\/am-synth$/,
        async (route, current) => {
            const module = await import('../pages/modulation-am-synth.js');
            return new module.default();
        }
    ],
    [
        /^\/modulation\/fm-synth$/,
        async (route, current) => {
            const module = await import('../pages/modulation-fm-synth.js');
            return new module.default();
        }
    ],
    [
        /^\/modulation\/epilogue$/,
        async (route, current) => {
            const module = await import('../pages/modulation-epilogue.js');
            return new module.default();
        }
    ],
    [
        /^\/additive-synthesis$/,
        async (route, current) => {
            const module = await import('../pages/additive-synthesis.js');
            return new module.default();
        }
    ],
    [
        /^\/additive-synthesis\/builder$/,
        async (route, current) => {
            const module = await import('../pages/additive-synthesis-builder.js');
            return new module.default();
        }
    ],
    [
        /^\/additive-synthesis\/harmonics$/,
        async (route, current) => {
            const module = await import('../pages/additive-synthesis-harmonics.js');
            return new module.default();
        }
    ],
    [
        /^\/additive-synthesis\/adsr$/,
        async (route, current) => {
            const module = await import('../pages/additive-synthesis-adsr.js');
            return new module.default();
        }
    ],
    [
        /^\/additive-synthesis\/epilogue$/,
        async (route, current) => {
            const module = await import('../pages/additive-synthesis-epilogue.js');
            return new module.default();
        }
    ]
]
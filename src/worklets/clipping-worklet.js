export default (context) => {
    const js = `
            class ClippingWorklet extends AudioWorkletProcessor {
                process (inputs, outputs, parameters) {

                    const input = inputs[0];
                    const output = outputs[0];

                    for (let channel = 0; channel < input.length; ++channel) {
                        for (let i = 0; i <= input[channel].length; i++) {
                            let value = Math.abs(input[channel][i]);
                            if (value > 1) {
                                this.port.postMessage(input[channel][i]);
                                break;
                            }
                        }
                    }

                    for (let channel = 0; channel < output.length; channel++) {
                        output[channel].set(input[channel]);
                    }

                    return true;
                }
            }
            registerProcessor('clipping-worklet', ClippingWorklet)
        `;

    const blobUrl = URL.createObjectURL(new Blob([js], { type: "text/javascript" }));
    return context.audioWorklet.addModule(blobUrl).then(() => 'clipping-worklet');
}
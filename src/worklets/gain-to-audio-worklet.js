export default (context) => {
    const js = `
            class GainToAudioWorklet extends AudioWorkletProcessor {
                process (inputs, outputs, parameters) {
                    const input = inputs[0];
                    const output = outputs[0];
                    if (input && output && input.length === output.length) {
                        const bits = parameters.bits;
                        for (let channelNum = 0; channelNum < input.length; channelNum++) {
                            const inputChannel = input[channelNum];
                            for (let index = 0; index < inputChannel.length; index++) {
                                const value = inputChannel[index];
                                output[channelNum][index] = (value + 1) / 2;
                            }
                        }
                    }
                    return true;
                }
            }
            registerProcessor('gain-to-audio-worklet', GainToAudioWorklet)
        `;

    const blobUrl = URL.createObjectURL(new Blob([js], { type: "text/javascript" }));
    return context.audioWorklet.addModule(blobUrl).then(() => 'gain-to-audio-worklet');
}
export function getValues(emitters, emitterIndex) {
    const emitter = emitters[emitterIndex];

    const [message, payload, ack] = [
        emitter.emitterMessage.value,
        emitter.editorPayload.getValue(),
        emitter.editorAck.getValue()
    ];

    return { message, payload, ack };
}

export function getEmitterButtonName(emitterIndex) {
    return `emitter-${emitterIndex}`;
}

export function getEmitterMessageName(emitterIndex) {
    return `emitter-message-${emitterIndex}`;
}

export function getEmitterPayloadName(emitterIndex) {
    return `emitter-payload-${emitterIndex}`;
}

export function getEmitterAckName(emitterIndex) {
    return `emitter-ack-${emitterIndex}`;
}

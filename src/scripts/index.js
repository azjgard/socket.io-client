import '../styles/index.scss';
import { connect } from './socket.io';
import { ackEditor, payloadEditor } from './editor';
import { save, load } from './storage';
import {
    getValues,
    getEmitterAckName,
    getEmitterButtonName,
    getEmitterMessageName,
    getEmitterPayloadName
} from './utils';

const app = document.getElementById('app');

let EMITTERS = load();

let socket;

function connectToSocket(url) {
    if (url) {
        try {
            socket = connect(url);
        } catch (e) {
            alert('Invalid URL');
        }
    } else {
        alert('Please provide a valid socket URL');
    }
}

function emit(emitterIndex) {
    if (!socket) {
        alert('Please connect first');
    }

    let { message, payload, ack } = getValues(EMITTERS, emitterIndex);

    try {
        payload = JSON.parse(payload);
    } catch (e) {
        alert('Invalid payload JSON');
        return;
    }

    try {
        ack = eval(ack);

        if (!(ack && {}.toString.call(ack) === '[object Function]')) {
            throw '';
        }
    } catch (e) {
        alert('Ack is not a function');
        return;
    }

    socket.emit(message || '', payload, ack);
}

function render() {
    app.innerHTML = `
        <div class="emitter-add">
            <button id="save">Save</button> 
        </div>

        <input type="text" id="url" /> <button id="connect">Connect</button>

        <div class="emitter-block">
            ${EMITTERS.map(
                (emitter, emitterIndex) =>
                    `
                Message: <input type="text" id="${getEmitterMessageName(
                    emitterIndex
                )}" value="${emitter.message || ''}"/> 
                <button id="${getEmitterButtonName(emitterIndex)}">Emit</button>

                <div class="editor-container">
                    <div class="emitter-editor">
                        <div class="title">Payload</div>
                        <div id="${getEmitterPayloadName(emitterIndex)}"></div>
                    </div>
                    <div class="emitter-editor">
                        <div class="title">Ack</div>
                        <div id="${getEmitterAckName(emitterIndex)}"></div>
                    </div>
                </div>
                `
            )}
        </div>`;

    document
        .getElementById('save')
        .addEventListener('click', () => save(EMITTERS));

    let urlInput = document.getElementById('url');

    if (!urlInput.value) {
        urlInput.value = localStorage.getItem('url');
    }

    document
        .getElementById('connect')
        .addEventListener('click', () => connectToSocket(urlInput.value));

    EMITTERS.forEach((emitter, emitterIndex) => {
        console.log('emitter:', emitter);

        let editorPayload = payloadEditor(
            getEmitterPayloadName(emitterIndex),
            emitter.payload || undefined
        );

        let editorAck = ackEditor(
            getEmitterAckName(emitterIndex),
            emitter.ack || undefined
        );

        let emitterMessage = document.getElementById(
            getEmitterMessageName(emitterIndex)
        );

        EMITTERS[emitterIndex] = { emitterMessage, editorPayload, editorAck };

        document
            .getElementById(getEmitterButtonName(emitterIndex))
            .addEventListener('click', () => emit(emitterIndex));
    });
}

render();

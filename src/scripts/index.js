import '../styles/index.scss';
import { connect } from './socket.io';
import { javascriptEditor, jsonEditor } from './editor';

const app = document.getElementById('app');

const DEFAULT_URL = 'http://localhost:4000';
const EMITTERS = [{}];

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

function emit(message, payloadEditor, ackEditor) {
    if (!socket) {
        connectToSocket(document.getElementById('connect').value);
    }

    let payload;
    let ack;

    try {
        payload = JSON.parse(payloadEditor.getValue());
    } catch (e) {
        alert('Invalid payload JSON');
        return;
    }

    try {
        ack = eval(ackEditor.getValue());

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
            <button id="add">Add Emitter</button> 
        </div>

        <input type="text" id="url" value="${DEFAULT_URL}"/> <button id="connect">Connect</button>

        <div class="emitter-block">
            ${EMITTERS.map(
                (emitter, emitterIndex) =>
                    `
                Message: <input type="text" id="${getEmitterMessageName(
                    emitterIndex
                )}" /> 
                <button id="${getEmitterButtonName(emitterIndex)}">Emit</button>

                <div class="editor-container">
                    <div class="emitter-editor">
                        Payload: 
                        <div id="${getEmitterPayloadName(emitterIndex)}"></div>
                    </div>
                    <div class="emitter-editor">
                        Ack: 
                        <div id="${getEmitterAckName(emitterIndex)}"></div>
                    </div>
                </div>
                `
            )}
        </div>`;

    let urlInput = document.getElementById('url');

    document
        .getElementById('connect')
        .addEventListener('click', () => connectToSocket(urlInput.value));

    EMITTERS.forEach((emitter, emitterIndex) => {
        let payloadEditor = jsonEditor(getEmitterPayloadName(emitterIndex));
        let ackEditor = javascriptEditor(getEmitterAckName(emitterIndex));

        let emitterMessage = document.getElementById(
            getEmitterMessageName(emitterIndex)
        );

        document
            .getElementById(getEmitterButtonName(emitterIndex))
            .addEventListener('click', () => {
                emit(emitterMessage.value, payloadEditor, ackEditor);
            });
    });
}

render();

function getEmitterButtonName(emitterIndex) {
    return `emitter-${emitterIndex}`;
}

function getEmitterMessageName(emitterIndex) {
    return `emitter-message-${emitterIndex}`;
}

function getEmitterPayloadName(emitterIndex) {
    return `emitter-payload-${emitterIndex}`;
}

function getEmitterAckName(emitterIndex) {
    return `emitter-ack-${emitterIndex}`;
}

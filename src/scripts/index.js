import '../styles/index.scss';
import { connect } from './socket.io';

const app = document.getElementById('app');

const DEFAULT_URL = 'http://localhost:4000';
const EMITTERS = [
    {
        message: 'authenticate',
        username: 'Jordin',
        // replace ack with code editor
        ack({ user, rooms }) {
            console.log('acknowledged');

            console.log(user);
            console.log(rooms);
        }
    }
];

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

function emit(emitterIndex = 0) {
    if (socket && EMITTERS[emitterIndex]) {
        const emitter = EMITTERS[emitterIndex];

        if (emitter.message) {
            socket.emit(
                emitter.message,
                emitter.payload || {},
                emitter.ack || (() => {})
            );
        }
    }
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
                Message: <input type="text" id="message-${emitterIndex}" /> 
                <button id="emit-${emitterIndex}">Emit</button>
                `
            )}
        </div>`;

    let urlInput = document.getElementById('url');

    document
        .getElementById('connect')
        .addEventListener('click', () => connectToSocket(urlInput.value));

    EMITTERS.forEach((emitter, emitterIndex) => {
        document
            .getElementById(`emit-${emitterIndex}`)
            .addEventListener('click', () => emit(emitterIndex));
    });
}

render();

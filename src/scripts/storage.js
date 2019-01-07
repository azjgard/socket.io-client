import { getValues } from './utils';

export function save(emitters) {
    let obj = {};

    emitters.forEach((e, emitterIndex) => {
        obj[`emitter-${emitterIndex}`] = JSON.stringify(
            getValues(emitters, emitterIndex)
        );
    });

    console.log(document.getElementById('url').value);

    localStorage.setItem('url', document.getElementById('url').value);
    localStorage.setItem('emitter', JSON.stringify(obj));
}

export function load() {
    let emitters = [];
    let emitterStorage = localStorage.getItem('emitter');

    if (emitterStorage) {
        try {
            emitterStorage = JSON.parse(emitterStorage);

            Object.keys(emitterStorage).forEach(emitterKey => {
                emitters.push(JSON.parse(emitterStorage[emitterKey]));
            });
        } catch (e) {
            return;
        }
    }

    return emitters;
}

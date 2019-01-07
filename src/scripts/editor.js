import * as monaco from 'monaco-editor';

export function ackEditor(
    containerId,
    value = ['() => {', '\t', '}'].join('\n'),
    size = { width: 500, height: 500 }
) {
    return createEditor(containerId, size, 'javascript', value);
}

export function payloadEditor(
    containerId,
    value = ['{', '\t', '}'].join('\n'),
    size = { width: 500, height: 500 }
) {
    return createEditor(containerId, size, '', value);
}

export default function createEditor(
    containerId,
    size,
    language = 'javascript',
    value = ''
) {
    const container = document.getElementById(containerId);
    const editor = monaco.editor.create(container, {
        value,
        language,
        minimap: { enabled: false }
    });

    editor.layout(size);

    return editor;
}

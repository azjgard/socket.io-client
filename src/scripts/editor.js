import * as monaco from 'monaco-editor';

export function javascriptEditor(
    containerId,
    size = { width: 500, height: 500 }
) {
    return createEditor(
        containerId,
        size,
        'javascript',
        ['() => {', '\t', '}'].join('\n')
    );
}

export function jsonEditor(containerId, size = { width: 500, height: 500 }) {
    return createEditor(containerId, size, 'json', ['{', '\t', '}'].join('\n'));
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
        language
    });

    editor.layout(size);

    return editor;
}

self.MonacoEnvironment = {
    getWorkerUrl: function(moduleId, label) {
        if (label === 'json') {
            return './json.worker.bundle.js';
        }
        if (label === 'css') {
            return './css.worker.bundle.js';
        }
        if (label === 'html') {
            return './html.worker.bundle.js';
        }
        if (label === 'typescript' || label === 'javascript') {
            return './ts.worker.bundle.js';
        }
        return './editor.worker.bundle.js';
    }
};

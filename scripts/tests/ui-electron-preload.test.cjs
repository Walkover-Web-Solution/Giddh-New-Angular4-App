const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

function loadBridge() {
    const exposed = {};
    const calls = [];
    const listeners = [];
    const logs = [];
    const ipcRenderer = {
        send: (...args) => calls.push(['send', ...args]),
        on: (channel, listener) => listeners.push({ kind: 'on', channel, listener }),
        once: (channel, listener) => listeners.push({ kind: 'once', channel, listener }),
        removeAllListeners: (...args) => calls.push(['removeAllListeners', ...args])
    };
    vm.runInNewContext(readFileSync(path.resolve(__dirname, '../../apps/electron-giddh/src/preload.js'), 'utf8'), {
        require: (name) => {
            assert.equal(name, 'electron');
            return { contextBridge: { exposeInMainWorld: (name, value) => exposed[name] = value }, ipcRenderer };
        },
        process: { platform: 'test-platform' },
        console: { log: (...args) => logs.push(args) }
    });
    return { exposed, calls, listeners, logs };
}

const sendChannels = ['open-url', 'authenticate', 'authenticate-send-email', 'take-server-environment', 'has-unsaved-changes', 'log.error'];
const receiveChannels = ['take-your-gmail-token', 'maybeUrlChanged'];

for (const kind of ['modern', 'legacy']) {
    test(`${kind} bridge permits exactly the existing send channels and preserves payload identity`, () => {
        const { exposed, calls } = loadBridge();
        const bridge = kind === 'modern' ? exposed.electronAPI : exposed.require('electron').ipcRenderer;
        const payload = { provider: 'google' };
        for (const channel of sendChannels) {
            assert.equal(bridge.send(channel, payload), undefined);
        }
        for (const channel of [...receiveChannels, 'unknown', '', null, undefined]) {
            bridge.send(channel, payload);
        }
        assert.deepEqual(calls, sendChannels.map(channel => ['send', channel, payload]));
        assert.ok(calls.every(call => call[2] === payload));
    });

    test(`${kind} bridge filters listeners and keeps callback argument conventions`, () => {
        const { exposed, listeners, logs } = loadBridge();
        const bridge = kind === 'modern' ? exposed.electronAPI : exposed.require('electron').ipcRenderer;
        const delivered = [];
        for (const method of ['on', 'once']) {
            for (const channel of [...receiveChannels, 'open-url', 'take-your-gmail-token-send-email', 'unknown']) {
                assert.equal(bridge[method](channel, (...args) => delivered.push({ method, channel, args })), undefined);
            }
        }
        assert.deepEqual(listeners.map(({ kind, channel }) => [kind, channel]), [
            ['on', 'take-your-gmail-token'], ['on', 'maybeUrlChanged'],
            ['once', 'take-your-gmail-token'], ['once', 'maybeUrlChanged']
        ]);
        const event = { sender: 'main' };
        const token = { access_token: 'fixture-token' };
        for (const { listener } of listeners) listener(event, token, 3);
        for (const call of delivered) {
            assert.deepEqual(call.args, kind === 'legacy' && call.method === 'once' ? [event, token, 3] : [token, 3]);
        }
        assert.equal(logs.length, 2);
        assert.equal(logs[0][0], kind === 'legacy' ? 'Preload: IPC once event received:' : 'Preload: electronAPI once event received:');
    });

    test(`${kind} listener removal retains existing forwarding behavior`, () => {
        const { exposed, calls } = loadBridge();
        const bridge = kind === 'modern' ? exposed.electronAPI : exposed.require('electron').ipcRenderer;
        assert.equal(bridge.removeAllListeners('unknown'), undefined);
        assert.deepEqual(calls, [['removeAllListeners', 'unknown']]);
    });
}

test('bridge exposure keeps environment information and the legacy module boundary', () => {
    const { exposed } = loadBridge();
    assert.equal(exposed.electronAPI.isElectron, true);
    assert.equal(exposed.electronAPI.platform, 'test-platform');
    assert.equal(exposed.require('fs'), null);
    assert.equal(exposed.require('child_process'), null);
    assert.notEqual(exposed.require('electron'), exposed.require('electron'));
});

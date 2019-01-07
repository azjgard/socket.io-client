import io from 'socket.io-client';

export function connect(url) {
    const socket = io(url);

    socket.on('connect', () => {
        console.log('connected successfully');
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    return socket;
}

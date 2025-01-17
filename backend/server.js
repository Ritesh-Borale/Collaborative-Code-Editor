import http, { createServer } from 'http'
import dotenv from 'dotenv'
import app from './app.js';
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', socket => {
    console.log('socket connected', socket.id)

    socket.on('join', ({ roomId, username }) => {
        if (!roomId || !username) {
            console.error('Room ID or username is missing');
            return;
        }
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        console.log(clients);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });


    socket.on('chat-message', ({ roomId, username, message }) => {
        if (!roomId || !username || !message) {
            console.error('Invalid message data');
            return;
        }
        const msgData = { username, message };
        socket.to(roomId).emit('chat-message', msgData);
        console.log(`Message from ${username} in room ${roomId}: ${message}`);
    });

    socket.on('disconnect', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            io.in(roomId).emit('user-disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
    });


})

server.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`)
})
import http, { createServer } from 'http'
import dotenv from 'dotenv'
import app from './app.js';
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { generateResult } from './services/ai.service.js';


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

const userSocketMap = {};
const roomUserMap = {};

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

        if (!roomUserMap[roomId]) {
            roomUserMap[roomId] = new Set();
        }
        roomUserMap[roomId].add(socket.id);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit('joined', {
                clients,
                username,
                socketId: socket.id,
                connectedUsers: roomUserMap[roomId].size
            });
        });
    });


    socket.on('code-change',({roomId,value,currentFile,allFiles})=>{
        socket.in(roomId).emit('code-change',{value,currentFile,allFiles});
    })

    socket.on('sync-code',({value,currentFile,allFiles})=>{
        io.to(roomId).emit('code-change',{value,currentFile,allFiles})
    })

    socket.on('chat-message',async ({ roomId, username, message }) => {
        if (!roomId || !username || !message) {
            console.error('Invalid message data');
            return;
        }
        
        const msgData = { username, message };
        const aiIsPresentInMessage = message.includes('@ai');

        socket.to(roomId).emit('chat-message', msgData);

        if(aiIsPresentInMessage){
            const prompt = message.replace('@ai','');
            const result = await generateResult(prompt);

            io.to(roomId).emit('chat-message',{
                username:'ai',
                message:result,
                by : username
            })

            return ;

        }

        console.log(`Message from ${username} in room ${roomId}: ${message}`);
    });

    socket.on('disconnect', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            // Remove user from room count
            if (roomUserMap[roomId]) {
                roomUserMap[roomId].delete(socket.id);
                // Clean up empty rooms
                if (roomUserMap[roomId].size === 0) {
                    delete roomUserMap[roomId];
                }
            }

            io.in(roomId).emit('user-disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id],
                connectedUsers: roomUserMap[roomId] ? roomUserMap[roomId].size : 0
            });
        });
        delete userSocketMap[socket.id];
    });


})

server.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`)
})
import http, { createServer } from 'http'
import app from './app.js';
import { Server } from 'socket.io'
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
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            const user = userSocketMap[socketId] || {};
            return {
                socketId,
                username: user.username,
                isAdmin: user.isAdmin || false,
            };
        }
    );
}

io.on('connection', socket => {
    console.log('socket connected', socket.id)

    socket.on('join', ({ roomId, username, isAdmin, currentPage }) => {
        if (!roomId || !username) {
            console.error('Room ID or username is missing');
            return;
        }
        userSocketMap[socket.id] = { username, isAdmin: !!isAdmin, currentPage };
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

    socket.on('typing', ({ roomId, username, isTyping }) => {
        socket.to(roomId).emit('user-typing', { username, isTyping });
    });

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

        // Emit chat message to everyone in the room
        io.in(roomId).emit('chat-message', msgData);

        // Emit chat notification only to users in the editor page
        const clientsInRoom = getAllConnectedClients(roomId);
        clientsInRoom.forEach(client => {
            if (client.socketId !== socket.id && userSocketMap[client.socketId]?.currentPage === 'editor') {
                io.to(client.socketId).emit('chat-notification', { username, message });
            }
        });

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
                username: userSocketMap[socket.id]?.username,
                connectedUsers: roomUserMap[roomId] ? roomUserMap[roomId].size : 0,
                clients: getAllConnectedClients(roomId)
            });
        });
        delete userSocketMap[socket.id];
    });


})

server.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`)
})

// import http, { createServer } from 'http'
// import app from './app.js';
// import { Server } from 'socket.io'
// import { generateResult } from './services/ai.service.js';

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: '*'
//     }
// });

// const userSocketMap = {};
// const roomUserMap = {};
// // Add whiteboard state storage
// const whiteboardStates = new Map();

// function getAllConnectedClients(roomId) {
//     // Map
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
//         (socketId) => {
//             return {
//                 socketId,
//                 username: userSocketMap[socketId],
//             };
//         }
//     );
// }

// io.on('connection', socket => {
//     console.log('socket connected', socket.id)

//     socket.on('join', ({ roomId, username }) => {
//         if (!roomId || !username) {
//             console.error('Room ID or username is missing');
//             return;
//         }
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);

//         if (!roomUserMap[roomId]) {
//             roomUserMap[roomId] = new Set();
//         }
//         roomUserMap[roomId].add(socket.id);

//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit('joined', {
//                 clients,
//                 username,
//                 socketId: socket.id,
//                 connectedUsers: roomUserMap[roomId].size
//             });
//         });

//         // Send current whiteboard state to the new user if it exists
//         if (whiteboardStates.has(roomId)) {
//             socket.emit('whiteboard-state', whiteboardStates.get(roomId));
//         }
//     });

//     socket.on('code-change', ({ roomId, value, currentFile, allFiles }) => {
//         socket.in(roomId).emit('code-change', { value, currentFile, allFiles });
//     })

//     socket.on('sync-code', ({ value, currentFile, allFiles }) => {
//         io.to(roomId).emit('code-change', { value, currentFile, allFiles })
//     })

//     socket.on('chat-message', async ({ roomId, username, message }) => {
//         if (!roomId || !username || !message) {
//             console.error('Invalid message data');
//             return;
//         }

//         const msgData = { username, message };
//         const aiIsPresentInMessage = message.includes('@ai');

//         socket.to(roomId).emit('chat-message', msgData);

//         if (aiIsPresentInMessage) {
//             const prompt = message.replace('@ai', '');
//             const result = await generateResult(prompt);

//             io.to(roomId).emit('chat-message', {
//                 username: 'ai',
//                 message: result,
//                 by: username
//             })

//             return;
//         }

//         console.log(`Message from ${username} in room ${roomId}: ${message}`);
//     });

//     // ADD THESE WHITEBOARD EVENTS:
    
//     // Handle whiteboard drawing changes
//     socket.on('whiteboard-change', (data) => {
//         const { roomId, elements, appState } = data;
        
//         if (!roomId) {
//             console.error('Room ID is missing for whiteboard change');
//             return;
//         }
        
//         // Update stored state
//         whiteboardStates.set(roomId, { 
//             elements, 
//             appState,
//             lastUpdate: Date.now()
//         });
        
//         // Broadcast to all other users in the room
//         socket.to(roomId).emit('whiteboard-update', {
//             elements,
//             appState,
//             userId: socket.id,
//             username: userSocketMap[socket.id]
//         });
        
//         console.log(`Whiteboard updated in room ${roomId} by ${userSocketMap[socket.id]}`);
//     });

//     // Handle whiteboard clear
//     socket.on('whiteboard-clear', (data) => {
//         const { roomId } = data;
        
//         if (!roomId) {
//             console.error('Room ID is missing for whiteboard clear');
//             return;
//         }
        
//         // Clear stored state
//         whiteboardStates.set(roomId, { 
//             elements: [], 
//             appState: {},
//             lastUpdate: Date.now()
//         });
        
//         // Broadcast clear to all users in the room
//         io.to(roomId).emit('whiteboard-cleared', {
//             clearedBy: userSocketMap[socket.id]
//         });
        
//         console.log(`Whiteboard cleared in room ${roomId} by ${userSocketMap[socket.id]}`);
//     });

//     // Handle whiteboard cursor movement (optional)
//     socket.on('whiteboard-cursor', (data) => {
//         const { roomId, x, y, color } = data;
        
//         if (!roomId) return;
        
//         socket.to(roomId).emit('whiteboard-cursor-update', {
//             userId: socket.id,
//             username: userSocketMap[socket.id],
//             x, y, color
//         });
//     });

//     // Handle getting whiteboard state (for users joining later)
//     socket.on('get-whiteboard-state', ({ roomId }) => {
//         if (whiteboardStates.has(roomId)) {
//             socket.emit('whiteboard-state', whiteboardStates.get(roomId));
//         }
//     });

//     socket.on('disconnect', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             // Remove user from room count
//             if (roomUserMap[roomId]) {
//                 roomUserMap[roomId].delete(socket.id);
//                 // Clean up empty rooms
//                 if (roomUserMap[roomId].size === 0) {
//                     delete roomUserMap[roomId];
//                     // Also clean up whiteboard state for empty rooms
//                     whiteboardStates.delete(roomId);
//                     console.log(`Cleaned up empty room: ${roomId}`);
//                 }
//             }

//             io.in(roomId).emit('user-disconnected', {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//                 connectedUsers: roomUserMap[roomId] ? roomUserMap[roomId].size : 0
//             });
//         });
//         delete userSocketMap[socket.id];
//         console.log(`User disconnected: ${socket.id}`);
//     });
// })

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server Running on port ${PORT}`)
// })
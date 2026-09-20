const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// PostgreSQL Connection Setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Initialize database schema (Creates table if it doesn't exist)
pool.query(`
  CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    score INT DEFAULT 0
  )
`).catch(err => console.log("DB init note:", err.message));

// Health Check Route (For Render)
app.get('/', (req, res) => {
  res.send('Bonk Clone Back-End Running');
});

// In-Memory Lobby Manager
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create or Join Room
  socket.on('join_room', ({ roomId, username }) => {
    socket.join(roomId);
    
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [] };
    }
    
    rooms[roomId].players.push({ id: socket.id, username, x: 100, y: 100 });
    console.log(`${username} joined room ${roomId}`);

    // Notify room of updated player list
    io.to(roomId).emit('room_state', rooms[roomId]);
  });

  // Relay Movement Inputs
  socket.on('player_input', ({ roomId, input }) => {
    // Broadcast player movement/physics payload to other clients in room
    socket.to(roomId).emit('player_moved', { id: socket.id, input });
  });

  // Handle Disconnect
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(p => p.id !== socket.id);
      io.to(roomId).emit('room_state', rooms[roomId]);
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

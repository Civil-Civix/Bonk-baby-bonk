// Replace this URL with your actual Render URL after deploying the back-end
const BACKEND_URL = "https://your-app-name.onrender.com"; 

let socket;
let currentRoom = "";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = { players: [] };

function connectToGame() {
  const username = document.getElementById("username").value;
  currentRoom = document.getElementById("roomId").value;

  socket = io(BACKEND_URL);

  socket.on("connect", () => {
    console.log("Connected to server!");
    socket.emit("join_room", { roomId: currentRoom, username });
  });

  socket.on("room_state", (state) => {
    gameState = state;
    render();
  });

  socket.on("player_moved", ({ id, input }) => {
    // Process input/movement updates from other players
  });
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Render players as spheres/circles
  gameState.players.forEach((player, index) => {
    ctx.beginPath();
    ctx.arc(player.x + (index * 40), player.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = index === 0 ? "#ff4757" : "#2ed573";
    ctx.fill();
    ctx.closePath();
    
    // Draw Username
    ctx.fillStyle = "white";
    ctx.font = "12px sans-serif";
    ctx.fillText(player.username, player.x + (index * 40) - 15, player.y - 30);
  });
}

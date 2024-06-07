import express from 'express'
import cors from "cors";
import rootRouter from "./routes/index.routes";
import http from "http";
import { Server } from "socket.io";
import prisma from './client';
import { SettlementStatus } from './utils/Globals';

export const app = express()
app.use(cors({origin: '*',optionsSuccessStatus: 200}));
app.use(express.json());
const PORT: number = 4000;

const server = http.createServer(app);
export const io = new Server(server,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
});


app.use('/api', rootRouter);

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("update_settlement", async (data) => {
        console.log('update settlement called');
        
      const settled = await prisma?.settlements.findMany({
          where:{
              status: SettlementStatus.SETTLED
          }
      });
      const not_settled = await prisma?.settlements.findMany({
          where:{
              OR: [
                  {status: SettlementStatus.DISPUTED},
                  {status: SettlementStatus.SUBMITTED}
              ]   
          }
      });
      io.emit("get_settlement", {settled,not_settled});
    });
});
  
server.listen(4001, () => {
    console.log("Socket server is running @ http://localhost:4001");
});
app.listen(PORT, () => console.log(`Server is up and running @ http://localhost:${PORT}`));
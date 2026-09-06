import "dotenv/config";
import express from "express";
import cors from "cors";
import observationsRouter from "./routes/observations";
import identifyRouter from "./routes/identify";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/flowers", observationsRouter);
app.use("/identify", identifyRouter);

app.listen(PORT, () => {
  console.log(`PLATea server running on http://localhost:${PORT}`);
});
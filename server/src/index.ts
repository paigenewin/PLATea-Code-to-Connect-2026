import express from "express";
import cors from "cors";
import observationsRouter from "./routes/observations";

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

app.listen(PORT, () => {
  console.log(`PLATea server running on http://localhost:${PORT}`);
});
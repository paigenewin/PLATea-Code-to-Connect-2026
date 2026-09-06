import "dotenv/config";
import express from "express";
import cors from "cors";

import observationsRouter from "./routes/observations";
import identifyRouter from "./routes/identify";
import reportsRouter from "./commroutes/reports";

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

/*
 * Community reports
 */
app.use(reportsRouter);

app.listen(PORT, () => {
  console.log(`PLATea server running on http://localhost:${PORT}`);
});
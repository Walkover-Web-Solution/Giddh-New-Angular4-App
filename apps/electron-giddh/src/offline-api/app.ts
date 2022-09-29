import express from "express";
import electron from "electron";
import { defineRoutes } from "./routes/index";

export function startServer() {
    const app = express();
    app.use(express.json());
    app.listen(59448, () => console.log(`Express server listening on port 59448`));

    const electronApp = electron?.app || electron?.remote?.app;
    electronApp.getPath('userData');
    
    defineRoutes(app);
}
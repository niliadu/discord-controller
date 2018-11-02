import { api } from "./api";

const express = require("express"); //import was not working [err:  express is not a function]

const app = express();
let server = null;

app.use("/", api);

export function setup() {
    return new Promise(async resolve => {
        const port = process.env.PORT || 3000;
        server = await app.listen(port, () => console.log(`[SERVER] Listening on port ${port}`));
        resolve();
    });
}

export function close() {
    return new Promise(async resolve => {
        if (server) await server.close(() => console.log("[SERVER] Stopped"));
        resolve();
    });
}
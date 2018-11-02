import "@babel/polyfill";
import * as dotenv from "dotenv";
import * as server from "./server";
import * as discord from "./discord";

dotenv.config(); // loads the .env file into proccess.env

server.setup()
    .then(discord.setupBot)
    .catch(err => {
        console.log(err);
        process.exit(1);
    });

function shutDown() {
    server.close()
        .then(discord.destroyBot)
        .catch(err => {
            console.error("Error when trying to shut down!")
            console.error(err)
        });
}

process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);
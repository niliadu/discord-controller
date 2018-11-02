import * as bodyParser from "body-parser";
import * as express from "express";
import { notAllowed } from "../middleware/notAllowed";
import { keyAuth } from "../middleware/keyAuth";
import { errorHandler } from "../middleware/errorHandler";
import { users } from "./users"
import { channels } from "./channels"

const router = express.Router();

//router.use(keyAuth);
router.use(bodyParser.json());

router.use("/users", users);
router.use("/channels", channels);

router.route("/")
    .all(notAllowed);

router.use((req, res) => res.status(404).send());
router.use(errorHandler);

export { router as api }

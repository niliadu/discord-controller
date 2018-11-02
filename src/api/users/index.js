import * as express from "express";
import { notAllowed } from "./../../middleware/notAllowed";
import { getUserStatus } from "./getUserStatus";

const router = express.Router();

router.route("/")
    .all(notAllowed);

router.route("/:id/status")
    .get(getUserStatus)
    .all(notAllowed);

export { router as users }

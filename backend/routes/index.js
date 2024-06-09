import express from "express"
import gameRouter from "./gameRoutes.js"

const router = express.Router();

router.use('/game', gameRouter);

export default router;
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resetRouter from "./reset";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resetRouter);

export default router;
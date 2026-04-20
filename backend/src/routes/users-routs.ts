import express from "express";
import * as usersController from "../controllers/users-controllers";

const router = express.Router();

router.post("/addUser", usersController.addUser);
router.post("/targets", usersController.getTargets);
router.post("/addTargets", usersController.addTargets);
router.post("/getTargetScans", usersController.getTargetScans);
router.delete("/deleteTargets", usersController.deleteTargets);

export default router;
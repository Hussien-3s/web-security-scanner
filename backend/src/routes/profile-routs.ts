import express from "express";
import * as profileController from "../controllers/profile-controller";

const profileRouter = express.Router();

profileRouter.post("/startScan", profileController.startScan);
profileRouter.post("/addScan", profileController.addScan);
profileRouter.post("/getScans", profileController.getScans);
profileRouter.post("/getTargetScans", profileController.getTargetScans);
profileRouter.delete("/deleteScan/:id", profileController.deleteScan);
profileRouter.delete("/deleteScanGroup/:groupId", profileController.deleteScanGroup);
profileRouter.get("/profiles", profileController.getProfiles);

export default profileRouter;
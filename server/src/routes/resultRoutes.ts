import { Router } from "express";
import { getResultByAssignment } from "../controllers/resultController";

const router = Router();

router.get("/:assignmentId", getResultByAssignment);

export default router;

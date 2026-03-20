import { Router } from "express";
import {
  createAssignment,
  getAssignment,
  getAllAssignments,
} from "../controllers/assignmentController";

const router = Router();

router.post("/", createAssignment);
router.get("/", getAllAssignments);
router.get("/:id", getAssignment);

export default router;

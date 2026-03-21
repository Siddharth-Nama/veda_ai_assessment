import { Router } from "express";
import {
  createAssignment,
  getAssignment,
  getAllAssignments,
  regenerateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController";

const router = Router();

router.post("/", createAssignment);
router.get("/", getAllAssignments);
router.get("/:id", getAssignment);
router.post("/:id/regenerate", regenerateAssignment);
router.delete("/:id", deleteAssignment);

export default router;

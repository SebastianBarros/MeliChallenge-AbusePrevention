import { Router } from "express";
import {
  preConfirmationController,
  submitPreConfirmationController,
} from "./controllers/pre-confirmation";
import { confirmationController } from "./controllers/confirmation";

const router = Router();

router.get("/pre-confirmation", preConfirmationController);
router.post("/submit-pre-confirmation", submitPreConfirmationController);
router.get("/confirmation", confirmationController)

export default router;

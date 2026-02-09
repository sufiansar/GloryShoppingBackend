import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/checkAuth";

const router = Router();

router.get("/", ReviewController.getAllReviews);
router.get("/:productId", auth(), ReviewController.getReviewsByProductId);
router.post("/", auth(), ReviewController.createReview);
router.patch("/:id", auth(), ReviewController.updateReview);
router.delete("/:id", auth(), ReviewController.deleteReview);

export const ReviewRoute = router;

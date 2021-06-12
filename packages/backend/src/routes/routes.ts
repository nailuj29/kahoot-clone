import { json, Router } from "express";
import { authorized_get, login_post, signup_post } from "../controllers/auth";
import { quizzes_get } from "../controllers/data";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(json())

router.get('/quizzes', quizzes_get);

router.get("/authorized", requireAuth, authorized_get);

router.post("/signup", signup_post);

router.post("/login", login_post);

export default router;

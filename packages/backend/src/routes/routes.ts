import { json, Router } from "express";
import { me_get, login_post, signup_post } from "../controllers/auth";
import { quizzes_get, quizzes_post, quiz_get } from "../controllers/data";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(json())

router.get('/quizzes', quizzes_get);

router.post('/quizzes', quizzes_post);

router.get("/quizzes/:id", quiz_get);

router.get("/me", requireAuth, me_get);

router.post("/signup", signup_post);

router.post("/login", login_post);

export default router;

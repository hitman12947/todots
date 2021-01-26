import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";

const router = Router();

new TodoController(router).buildRoutes();

export default router;

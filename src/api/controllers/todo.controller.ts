import { Router, Request, Response } from "express";
import { connection } from "../../common/db.connection";
import { Todo } from "../models/todo.entity";

export class TodoController {
  constructor(private readonly router: Router) {}

  createTodo = async (req: Request, res: Response) => {
    const { title, body }: Todo = req.body;

    const todo = new Todo();
    todo.title = title;
    todo.body = body;
    await todo.save();
    return res.json(todo);
  };

  updateTodo = async (req: Request, res: Response) => {
    const { title, body }: { title?: string; body?: string } = req.body;
    const id = req.params.id;
    const todo = await this._findOne(id);
    if (!todo) {
      return res.status(400).json({ error: "Not found!" });
    }
    if (title) {
      todo.title = title;
    }
    if (body) {
      todo.body = body;
    }
    const newTodo = await todo.save();
    res.json(newTodo);
  };

  deleteTodo = async (req: Request, res: Response) => {
    const id = req.params.id;
    const todo = await this._findOne(id);
    await todo.remove();
    res.send(null);
  };

  getTodos = async (req: Request, res: Response) => {
    const conn = await connection;
    const todos = await conn.manager.find(Todo);

    res.json(todos);
  };

  getTodoById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const todo = await this._findOne(id);
    if (!todo) {
      return res.status(400).json({ error: "Not found!" });
    }
    res.json(todo);
  };

  private async _findOne(id: string) {
    const conn = await connection;
    const todoRepo = await conn.getRepository(Todo);
    return await todoRepo.findOne(id);
  }

  buildRoutes() {
    this.router.get("/", this.getTodos);
    this.router.get("/:id", this.getTodoById);
    this.router.post("/", this.createTodo);
    this.router.patch("/:id", this.updateTodo);
    this.router.delete("/:id", this.deleteTodo);
  }
}

import { Router } from "express";
import { testController } from "./user.controller";


const router = Router();

router.get('/', testController)

export default router


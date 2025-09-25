import { Router } from "express";
import { AuthController } from "../Controllers/AuthController";
import { body } from "express-validator"
import { handleInputErrors } from "../middlewares/validation";

const router = Router();


router.post("/create-account",
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("password")
        .isLength({min:8}).withMessage("Password es muy corto, Minimo 8 caracteres"),
    body("email")
        .isEmail().withMessage("El email no es valido"),
    handleInputErrors,
    AuthController.createAccount)




export default router;
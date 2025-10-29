import { Router } from "express";
import { AuthController } from "../Controllers/AuthController";
import { body, param } from "express-validator"
import { handleInputErrors } from "../middlewares/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middlewares/auth";

const router = Router();

 //*Aplicacmos el limiter para limitar las petciones de esta ruta en especifico 0 
//*Aqui nosotros aplicamos el limiter y se aplica a todas las urls con la logia como esta
router.use(limiter);

router.post("/create-account",
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("password")
        .isLength({min:8}).withMessage("Password es muy corto, Minimo 8 caracteres"),
    body("email")
        .isEmail().withMessage("El email no es valido"),
    handleInputErrors,
    AuthController.createAccount)

   
router.post("/confirm-account",
    
    body("token")
        .notEmpty().isLength({min:6, max:6}).withMessage("El token no es valido"),
        handleInputErrors,
        AuthController.confirmAccount
    )

router.post("/login",
    body("email")
        .isEmail().withMessage("El email no es valido"),
        //*el password con que vaya no vacio es mas que suficiente ya que para ver la contraseña es en la bd
    body("password")
        .notEmpty().withMessage("El password no puede ir vacio"),
    handleInputErrors,
    AuthController.login
)
    
router.post("/forgot-password",
    body("email")
        .isEmail().withMessage("El email no es valido"),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post("/validate-token",
    body("token")
        .notEmpty().isLength({min:6, max:6}).withMessage("El token no es valido"),
    handleInputErrors,
    AuthController.validateToken
)

//*Tomamos como parametro el token que viene en la url por que es la forma que el sistema identifica de manera unica la solicitu del reestablecimiento
router.post("/reset-password/:token", 
    param("token")
        .notEmpty().isLength({min:6, max:6}).withMessage("El token no es valido"),
    body("password")
        .isLength({min:8}).withMessage("Password es muy corto, Minimo 8 caracteres"),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

//*Obtendra la informacion del usuario por medio del token
router.get("/user",
    authenticate,
    AuthController.User)

router.post("/update-password",
    authenticate,
    body("current_password")
        .notEmpty().withMessage("El password no debe ir vacio"),
    body("new_password")
        .isLength({min:8}).withMessage("El password es muy corto minimo 8 caracteres"),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

export default router;
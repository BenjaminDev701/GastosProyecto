import { Request, Response, NextFunction } from "express"
import {body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";


//TODO : Aqui lo que hacemos es que le agregamos una propiedad a request que seria nuestra varibale budget la cual tendra las caracteristicas de nuestro modelo y la mandamos para nuestro controlador
declare global{
    namespace Express{
        interface Request{
            budget?: Budget
        }
    }
}

//*Como aqui estamos haciendo un middleware personalizado tenemos que hacer que la funcion sea asincrona y colocar el run(req) para que se ejecute la validacion 

export const validateBudgetId = async(req : Request , res : Response, next: NextFunction) =>{

    //*Permite validar el parametro que nosotrs queremos en este caso es el id que es dinamico
    //*El isInt se asegura que es un numero entero
    await param("budgetId")
            .isInt().withMessage("El id no es valido")
            .custom(id => id > 0).withMessage("El id no es valido")
            .run(req);
    
    let errors = validationResult(req)
        if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
        }
        next();
}


//*Ahora aqui lo que haremos es que estamos ahorrando codigo para que se mas legible, nosotros enviaremos el budget como parametro
export const validateBudgetExists = async(req : Request , res : Response, next: NextFunction) =>{
    try {
      //*Asi nosotros recuperamos el id:dinamico que mandamos por la url
      //console.log(req.params.id);
    const { budgetId } = req.params;
      //*Asi es la manera de encontrar el id en squelize por findByPk
    const budget = await Budget.findByPk(budgetId);

      //* Si no existe el presupuesto sigue el flujo dando el codigo que si existe
    if (!budget) {
        const error = new Error("Presupuesto no encontrado");
        return res.status(404).json({ error: error.message });
    }

    req.budget = budget;

    next();
    } catch (error) {
    res.status(500).json({ error: "Error al extraer el id" });
    }
}


export const validateBudgetInput  = async(req : Request, res : Response, next:NextFunction) => {
      //* name es el campo que validamos en el cual esta en mi postman, notemty: que no este vacio , withmessage: el mensaje de error
      await body("name")
          .notEmpty().withMessage("El nombre es obligatorio").run(req)
      await body("amount")
          .notEmpty().withMessage("El monto es obligatorio")
          .isNumeric().withMessage("Cantidad debe ser un numero")
          //* custom nos permite hacer una validacion personalizada
          .custom(value => value > 0).withMessage("La cantidad debe ser mayor a 0").run(req)


            const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
  }
    next()
    
}
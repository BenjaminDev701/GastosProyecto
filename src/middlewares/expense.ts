import type { Request, Response, NextFunction } from "express"
import { body, param, validationResult } from "express-validator"
import Expense from "../models/Expense"

//TODO : Aqui lo que hacemos es que le agregamos una propiedad a request que seria nuestra varibale expense la cual tendra las caracteristicas de nuestro modelo y la mandamos para nuestro controlador
declare global{
    namespace Express{
        interface Request{
            expense?: Expense
        }
    }
}


export const valdiateExpenseInput = async(req : Request, res : Response, next : NextFunction) =>{

    await body("name")
        .notEmpty().withMessage("El nombre del gasto no puede ir vacio").run(req)

    await body("amount")
        .notEmpty().withMessage("La cantidad del gasto no puede ir vacio")
        .isNumeric().withMessage("Cantidad no valida")
        .custom(value => value > 0).withMessage("El gasto debe ser mayor a 0").run(req)

    next()
}

export const valdiateExpenseId = async(req : Request, res : Response, next: NextFunction) =>{
    
    await param("expenseId")
        .isInt().custom(value => value > 0).withMessage("El numero debe ser entero").run(req)

        let errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
    next()
}

//*Ahora aqui lo que haremos es que estamos ahorrando codigo para que se mas legible, nosotros enviaremos el budget como parametro
export const validateExpenseExist = async(req : Request , res : Response, next: NextFunction) =>{
    try {
      //*Asi nosotros recuperamos el id:dinamico que mandamos por la url
      //console.log(req.params.id);
    const { expenseId } = req.params;
      //*Asi es la manera de encontrar el id en squelize por findByPk
    const expense = await Expense.findByPk(expenseId);

      //* Si no existe el presupuesto sigue el flujo dando el codigo que si existe
    if (!expense) {
        const error = new Error("Presupuesto no encontrado");
        return res.status(404).json({ error: error.message });
    }

    req.expense = expense;

    next();
    } catch (error) {
    res.status(500).json({ error: "Error al extraer el id" });
    }
}
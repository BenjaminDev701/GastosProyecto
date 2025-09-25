import { Request, Response } from "express"
import Expense from "../models/Expense"
import { error } from "console";

export class ExpenseController{

    static getAll = async(req : Request , res : Response) =>{
     try {
        const expense = await Expense.findAll({
            order: [["createdAt", "DESC"]],
        })

        res.json(expense);


     } catch (error) {
        
        return res.status(500).json({error:"Hubo un error en la extraccion de los Gastos"})
     }
    }

    static create = async (req : Request , res : Response) =>{
       try {

        //*Aqui se crea un objeto de mi modelo con la informacion pasada de mi req.body
        const expense = new Expense(req.body)
        //*Este gasto tendra el valor en la columna BudgetID  = y le asiganmos el id del presupuesto se lo asignamos al budgetId ejemplo: si el budget.id = a 3 entonces el budgetId es = a 3 tambien
        expense.budgetId = req.budget.id;

        await expense.save()
        res.status(201).json("Creacion correcta del gasto")
       } catch (error) {
        //console.log(error);
        
        res.status(500).json({error:"Hubo un error al crear un gasto"})
       }
        
        
    }

    static getById = async(req : Request , res : Response) =>{
      res.json(req.expense)
    }

    static updateById = async (req : Request , res : Response) =>{
      //*Aqui lo que le pasamos es la informacion que trae del req, acutalizamos con update y tomamos el req.body que es la informacion que nos envia el cliente y la tomamos de actualizacion
      await req.expense.update(req.body)
      res.json("El gasto se actualizo correctamente")
    }

    static deleteById = async(req : Request , res : Response) =>{
      await req.expense.destroy()
      res.json("El gasto se elimino correctamente")
    }





}
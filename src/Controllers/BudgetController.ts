import { Request, Response } from "express";
import Budget from "../models/Budget";
import Expense from "../models/Expense";


export class BudgetController {
  static getAll = async (req: Request, res: Response) => {
    try {
      //*Como es una funcion asincrona usamos await ya que buscara los datos de la bd y utilizamos el metodo findAll para traer todos los registros
      //*En el objeto puedes aplicar algunos filtros con sql
      const budget = await Budget.findAll({
        order: [["createdAt", "DESC"]],
      });
      //TODO : Filtrar por usuario autenticado

      res.json(budget);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Hubo un error al extraer los presupuestos" });
    }
  };

  static create = async (req: Request, res: Response) => {
    try {
      //*Creamos una instancia(objeto) del modelo  de acuerdo a las caracteristicas del modelo y tambien nosotros mandamos en req.body para que los datos enviados los agrege en la bd del modelo
      const budget = new Budget(req.body);
      //*en nuestro budged.id le asginamos el id del usuario autenticado
      budget.userId = req.user.id
      await budget.save();
      res.status(201).json("Presupuesto creado");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error " });
    }
  };

  static getById = async (req: Request, res: Response) => {

    //*Lo buscamos por el id y colocamos el incluya el los expenses y los obtiene internamente comparando el id del budget con el budgetid de expense
    const budget = await Budget.findByPk(req.budget.id , {
      include:[Expense]
    })
    //todo: aqui recibimos lo que el controlador manda
      res.json(budget);
  };

  static update = async (req: Request, res: Response) => {
      await req.budget.update(req.body);
      res.json("Presupuesto actualizado");
  };

  static delete = async (req: Request, res: Response) => {
      await req.budget.destroy(req.body);
      res.json("Presupuesto eliminado");
  };
}

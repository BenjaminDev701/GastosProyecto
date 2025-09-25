import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../Controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInput } from "../middlewares/budget";
import { ExpenseController } from "../Controllers/ExpenseController";
import { valdiateExpenseId, valdiateExpenseInput, validateExpenseExist } from "../middlewares/expense";


const router = Router();

//*Esto hace que todos los que tengan como parametor budgetId ejecuten esas funciones
router.param("budgetId", validateBudgetId);
router.param("budgetId", validateBudgetExists);

//*Esto hace que todos los que tengan como parametor expenseId ejecuten esas funciones
router.param("expenseId",valdiateExpenseId )
router.param("expenseId", validateExpenseExist )


router.get("/",BudgetController.getAll
);

router.post("/",  
    validateBudgetInput,
    handleInputErrors,
    BudgetController.create
);

router.get("/:budgetId", BudgetController.getById);


//*Aqui validamos los datos que nos envia tanto los que actualizamos como id y los demas campos
router.put("/:budgetId",
    validateBudgetId,
    validateBudgetExists,
    validateBudgetInput,
    handleInputErrors,
    BudgetController.update);

router.delete("/:budgetId",
        validateBudgetId,
        validateBudgetExists,
    BudgetController.delete);


//! Routes for Expenses
//*El patrón ROA (Resource-Oriented Architecture) sirve para:
//*Patron ROA: es la base de cómo se diseñan las APIs RESTful. : GET /budgets/:id/expenses → Lista todos los gastos de un presupuesto específico.  SIRVE PARA CREAR URLS JERARQUICAS EN ESTE CASO DE BUDGETS A EXPENSE

//*Si el cliente hace una petición a /budgets/5/expenses,entonces req.params.budgetId será 5


router.post("/:budgetId/expenses", 
    valdiateExpenseInput,
    handleInputErrors,
    ExpenseController.create)

router.get("/:budgetId/expenses/:expenseId", ExpenseController.getById)

router.put("/:budgetId/expenses/:expenseId",
    valdiateExpenseInput,
    handleInputErrors,
    ExpenseController.updateById)

router.delete("/:budgetId/expenses/:expenseId", ExpenseController.deleteById)




export default router;

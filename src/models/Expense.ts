import {Table, Column, DataType, HasMany, BelongsTo, ForeignKey, Model, AllowNull} from "sequelize-typescript"
import Budget from "./Budget";

@Table({
    tableName:"expenses"
})

class Expense extends Model {
    //*Es para que no acepte valores nulos y sea obligatorio
    @AllowNull(false)
    @Column({
        type : DataType.STRING(100)
    })
    declare name:string;

    //*Es para que no acepte valores nulos y sea obligatorio
    @AllowNull(false)
    @Column({
        type : DataType.DECIMAL
    })
    declare amount:string;

    //*Foreingkei agrega una tabla budgetId haciendo referencia a budget
    @ForeignKey(() => Budget)
       //* declare sirve para colocar el nombre de la columna y el segundo parametro recibira el tipo de dato
    declare budgetId:number

    //*Cada expense pertenece a un budget, así que cuando consulte este expense, puedo traer también su budget relacionado
    @BelongsTo(() => Budget) 
       //* declare sirve para colocar el nombre de la columna y el segundo parametro recibira el tipo de dato
    declare budget : Budget
}

export default Expense;
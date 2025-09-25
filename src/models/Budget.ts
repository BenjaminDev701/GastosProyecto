
import {Table, Column, DataType, HasMany, BelongsTo, ForeignKey, Model, AllowNull} from "sequelize-typescript"
import Expense from "./Expense";
import User from "./User";

@Table({
    tableName:"budgets"
})

//*Colocamos el nombre del modelo
class Budget extends Model{
    
    //*Es para que no acepte valores nulos y sea obligatorio
    @AllowNull(false)
    @Column({
        //* Esta columna genera la columna con el tipo de dato,,, lo que esta dentro de column es sequelize
        type:DataType.STRING(100)
    })
    declare name:string

    //*Es para que no acepte valores nulos y sea obligatorio
    @AllowNull(false)
    @Column({
        type:DataType.DECIMAL
    })
    declare amount:number

    //*Quiere decir que un Presupuesto puede tener varios gastos(Expense)
    @HasMany(() => Expense,{

        //*Aqui lo que hacemos es que si se acutializa o elimina que afecte tambein a los demas tablas ya que si eliminamos el presupuesto no tienen caso tener los gastos de un presupuesto que ya no esta esto es llamado RESTRINCIIONES DE INTEGRIDAD
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    //* declare sirve para colocar el nombre de la columna y el segundo parametro recibira el tipo de dato
    //*Aqui se declara asi por que el tipo de dato que traera sera expenses pero en un array por que puede ser uno a muchos objetos
    declare expenses : Expense[]

    @ForeignKey(() => User)
    @Column
    declare userId : number

    @BelongsTo(()=> User)
    declare user : User
}

export default Budget;
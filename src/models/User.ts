
import { Table, Column, Model, DataType, HasMany, Default, Unique, AllowNull} from "sequelize-typescript"
import Budget from "./Budget"

@Table({
    tableName:"users"
})

class User extends Model{

    //*Es para que no acepte valores nulos y sea obligatorio
    @AllowNull(false)
    @Column({
        type:DataType.STRING(50)
    })
    //*Nombre del usuario
    declare name:string

    //*Es para que no acepte valores nulos y sea obligatorio
    @AllowNull(false)
    @Column({
        type:DataType.STRING(60)
    })
    declare password:string

    //*Por default siempre esta en false , debes de activar con true
    @Unique(true)
    @AllowNull(false)
    @Column({
        type:DataType.STRING(50)
    })
    declare email:string

    @Column({
        type:DataType.STRING(6)
    })
    declare token:string

    //* 0 Si no esta confirmado el usuario y un 1 si esta confirmado
    //*De defafault siempre esta en false hasta que cofirme el usuaeio
    @Default(false)
    @Column({
        type:DataType.BOOLEAN
    })
    declare confirmed:boolean

    //*Colocamos el callback y apuntamos hacia nuestro modelo(budget)
    @HasMany(()=> Budget,{
        onUpdate: "CASCADE",
        onDelete : "CASCADE"
    })
    declare budgets : Budget[]
}


export default User;
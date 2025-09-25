import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from "./routes/budgetRouter"
import authRouter from "./routes/authRouter"

async function connectDb() {
    try {
                //*Se asegura que las credenciales son correctas
        await db.authenticate()
                //*Crea y sincroniza tablas 
        db.sync()
        console.log(colors.blue.bold("Conexion exitosa a la bd"));
        
    } catch (error) {
        console.log(colors.red.bold("Error en la conexion a la bd"));
        
    }
}

connectDb()

const app = express()

app.use(morgan('dev'))

app.use(express.json())


//* Sirve para definir las rutas en las que vamos a usar dentro de budgetRouter
app.use("/api/budgets", budgetRouter)

app.use("/api/auth", authRouter)



export default app
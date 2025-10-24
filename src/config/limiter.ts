import { rateLimit } from "express-rate-limit"

export const limiter = rateLimit({
    //*CUANTO TIEMPO VA A LIMITAR LOS REQUEST
    windowMs: 60 * 1000, //minuto
    //*Cuantos request vamos a permitir x minuto
    limit: 5,
    message: {"error" : "Has alcanzado el limite de peticiones"}
})
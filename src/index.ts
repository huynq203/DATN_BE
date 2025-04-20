import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import { defaultErrorHanlder } from './middlewares/error.middlewares'
import customersRouter from './routes/customers.routes'
import usersRouter from './routes/users.routes'
import rolesRouter from './routes/roles.routes'
import addressesRouter from './routes/addresses.routes'
config()
databaseService.connect()
const app = express()
const port = process.env.PORT || 4000
app.use(cors())
app.use(express.json()) //chuyen json sang body

app.use('/api/customers', customersRouter)
app.use('/api/users', usersRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/addresses', addressesRouter)

app.use(defaultErrorHanlder) //default error handle errror.middlleware.ts
app.listen(port, () => {
  console.log(`Project run server: http://localhost:${port}`)
})

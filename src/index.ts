import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
config()
import databaseService from './services/database.services'
import { defaultErrorHanlder } from './middlewares/error.middlewares'
import customersRouter from './routes/customers.routes'
import usersRouter from './routes/users.routes'
import rolesRouter from './routes/roles.routes'
import addressesRouter from './routes/addresses.routes'
import categoriesRouter from './routes/categories.routes'
import productsRouter from './routes/products.routes'
import { initFolder } from './utils/file'
import ratingsRouter from './routes/ratings.routes'

databaseService.connect()
const app = express()
const port = process.env.PORT || 4000
app.use(cors())

initFolder()
app.use(express.json()) //chuyen json sang body

app.use('/api/customers', customersRouter)
app.use('/api/users', usersRouter)
app.use('/api/roles', rolesRouter)
app.use('/api/addresses', addressesRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/products', productsRouter)
app.use('/api/ratings', ratingsRouter)
app.use('/api/products', productsRouter)

app.use(defaultErrorHanlder) //default error handle errror.middlleware.ts
app.listen(port, () => {
  console.log(`Project run server: http://localhost:${port}`)
})

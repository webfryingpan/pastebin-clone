import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { connect, disconnect } from './helpers/database'
import authRoutes from './routes/authRoutes'
import cloudRoutes from './routes/cloudRoutes'
import validate from './validation/validate'

dotenv.config()

if (!process.env.PORT) throw new Error('Missing server port')
const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use(cloudRoutes)
app.use(authRoutes)

// Custom middleware
app.use(validate)

const start = async () => {
	await connect()
	app.listen(PORT, () => console.log(`Listening ${PORT}`))
}

start()

process.on('SIGINT', async () => {
	await disconnect()
	process.exit(0)
})
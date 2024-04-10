import express, { type Request, type Response } from 'express'

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world')
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})

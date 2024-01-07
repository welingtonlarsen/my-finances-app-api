const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const categoriesRoutes = require('./routes/categoryRoutes')
const paymentMethodRoutes = require('./routes/paymentMethodRoutes')

const app = express();
app.use(cors())
app.use(express.json());
app.use('/expenses', expenseRoutes);
app.use('/categories', categoriesRoutes)
app.use('/paymentmethods', paymentMethodRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
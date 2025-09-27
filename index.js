const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const carteleraRoutes = require('./routes/cartelera');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Cartelera. Visita /api-docs para ver la documentación.');
});

app.use('/api/cartelera', carteleraRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Documentación de la API disponible en http://localhost:${port}/api-docs`);
});

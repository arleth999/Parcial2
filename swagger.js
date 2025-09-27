const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Cartelera de Películas',
            version: '1.0.0',
            description: 'API para gestionar una cartelera de películas, permitiendo operaciones CRUD.',
        },

    },
    apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;

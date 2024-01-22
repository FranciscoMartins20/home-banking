
const Hapi = require('@hapi/hapi');
const routes = require('./server/routes');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        "routes": {
            "cors": {
                "origin": ["http://localhost:4200"],
                "headers": ["Accept", "Content-Type",'Authorization'],
                "additionalHeaders": ["X-Requested-With"]
            }
        }
    });

    // Registrar as rotas no servidor
    server.route(routes);

    await server.start();
    console.log(`Server running on: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();


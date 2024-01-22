const jwt = require('jsonwebtoken');
const {addUser, verifyUserCredentials, isEmailUnique} = require('./auth')

// Handler para a rota Hello World
const helloHandler = (request, h) => {
    return 'Hello World!';
};

// Handler para a rota de subscribe
const subscribeHandler = (request, h) => {
    const { name, email, password } = request.payload;

    if (isEmailUnique(email)) {
        return h.response({ error: 'Email em uso.' }).code(409); 
    }

    addUser(name, email, password);

    return h.response({ message: 'Registo com Sucesso.' }).code(201); 
};


const loginHandler = (request, h) => {
    const {email, password} = request.payload;

    const {isValid, fundos, name} = verifyUserCredentials(email, password);

    if (!isValid) {
        return h.response('Credenciais inválidas.').code(401);
    }

    // Gerar o token JWT
    const token = jwt.sign({
        name,
        email,
        fundos,
   
         
    }, 'sua_chave_secreta', {expiresIn: '1h'});

    return h.response({message: 'Login bem sucedido.', token}).code(200);
};



// Handler dos fundos
const fundsHandler = (request, h) => { 
    const tokenHeader = request.headers.authorization;

    if (!tokenHeader) {
        return h.response('Acesso não autorizado. Token não fornecido.').code(401);
    }

    const token = tokenHeader.replace('Bearer ', '');

    try {
        // Verificar e decodificar o token JWT
        const decoded = jwt.verify(token, 'sua_chave_secreta');
        const { email, fundos } = decoded;

        // Obter a ação (add ou withdraw) e o valor dos fundos da solicitação
        const { action, value } = request.payload;

        // Verificar a ação solicitada
        if (action === 'add') {
            const novoValor = fundos + value;
            if (novoValor < 0) {
                return h.response('Valor inválido para adição.').code(400);
            }
            decoded.fundos = novoValor; // Atualizar o valor dos fundos no token decodificado
        } else if (action === 'withdraw') {
            const novoValor = fundos - value;
            if (novoValor < 0) {
                return h.response('Fundos insuficientes.').code(400);
            }
            decoded.fundos = novoValor; // Atualizar o valor dos fundos no token decodificado
        } else if (action === 'delete') {
            decoded.fundos = 0; // Definir fundos para 0
        } else {
            return h.response('Ação inválida.').code(400);
        }

        // Gerar um novo token com os novos fundos atualizados para se manter com o login.
        const novoToken = jwt.sign(decoded, 'sua_chave_secreta', { expiresIn: '1h' });

        return h.response({ email, fundos: decoded.fundos, token: novoToken }).code(200);
    } catch (error) {
        return h.response('Acesso não autorizado. Token inválido ou expirado.').code(401);
    }

};

const logoutHandler = (request, h) => {
    try {



        // No exemplo abaixo, estou apenas retornando uma mensagem indicando que o logout foi bem-sucedido
        return h.response({ message: 'Logout bem-sucedido.' }).code(200);
    } catch (error) {
        console.error('Erro no logout:', error);
        return h.response('Ocorreu um erro durante o logout.').code(500);
    }
};




module.exports = {
    helloHandler,
    subscribeHandler,
    loginHandler,
    fundsHandler,
    logoutHandler,
};


const jwt = require('jsonwebtoken');


const authenticateToken = (request, h) => {
  const tokenHeader = request.headers.authorization;

  if (!tokenHeader) {
    return h.response('Acesso não autorizado. Token não fornecido.').code(401);
  }

  const token = tokenHeader.replace('Bearer ', '');

  console.log('Received token:', token); // Adicione este log para verificar o token recebido

  try {
    const decoded = jwt.verify(token, 'sua_chave_secreta');
    request.user = decoded;
    
    console.log('Decoded user:', decoded); // Adicione este log para verificar os dados do usuário decodificados

    return h.continue;
  } catch (error) {
    console.error('Token verification error:', error); // Adicione este log para erros de verificação de token
    return h.response('Acesso não autorizado. Token inválido ou expirado.').code(401);
  }
};

module.exports = {
  authenticateToken,
};

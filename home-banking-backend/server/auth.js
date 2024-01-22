const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');




// Diretório onde os arquivos JSON dos utilizadores são armazenados
const usersDirectory = path.join(__dirname, '../data');

console.log('Users Directory:', usersDirectory);

// Função para verificar se um utilizador com o mesmo email já existe no banco de dados (arquivos JSON)
const isEmailUnique = (email) => {
  const userFiles = fs.readdirSync(usersDirectory);
  return userFiles.some((file) => {
    const userData = JSON.parse(fs.readFileSync(path.join(usersDirectory, file)));
    return userData.email === email;
  });
};

// Função para adicionar um novo utilizador ao banco de dados (arquivos JSON)
const addUser = (name, email, password, fundos = 0) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const userData = {
    name,
    email,
    password: hashedPassword,
    fundos,
  };
  const fileName = `${email}.json`;
  fs.writeFileSync(path.join(usersDirectory, fileName), JSON.stringify(userData));
};

const verifyUserCredentials = (email, password) => {
  const userFiles = fs.readdirSync(usersDirectory);
  const userFile = userFiles.find((file) => {
    const userData = JSON.parse(fs.readFileSync(path.join(usersDirectory, file)));
    return userData.email === email;
  });

  if (!userFile) {
    return { isValid: false, fundos: 0 }; // Email não encontrado
  }

  const userData = JSON.parse(fs.readFileSync(path.join(usersDirectory, userFile)));
  const isValidPassword = bcrypt.compareSync(password, userData.password);
  if (!isValidPassword) {
    return { isValid: false, fundos: 0 }; // Senha inválida
  }

  // Retorna também os "fundos" ou o valor padrão de 0
  return { isValid: true, fundos: userData.fundos || 0, name : userData.name};
};


module.exports = {
  addUser,
  verifyUserCredentials,
  isEmailUnique
};

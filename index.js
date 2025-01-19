const https = require('https');

// Obtenemos el user
const args = process.argv.slice(2);

const params = {};

args.forEach((arg) => {
  const [key, value] = arg.split('=');
  params[key.replace('--', '')] = value;
});

const user = params.user;

// Consumimos el endpoint
const options = {
  hostname: 'api.github.com',
  path: `/users/${user}/events`,
  method: 'GET',
  headers: {
    'User-Agent': 'node.js',
  },
};

https.get(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      // Parsear y mostrar datos
      const events = JSON.parse(data);
      console.log(events);
    } else {
      (res.statusCode===404)? console.error(`${user} es un user invalido`): console.log(`Error: ${res.statusCode}`);
    }
  });
}).on('error', (err) => {
  console.error(`${err.message}`);
});

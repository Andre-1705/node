console.log("¡Entorno configurado correctamente!");

//Establecer la URL base de la API
const API_URL = 'https://fakestoreapi.com';

//Extraemos los argumentos de la línea de comandos
//El formato esperado es: npm run start <metodo> <recurso> <extraargs>
//saltamos los primeros dos (node y script) y colocamos los otros tres declarando las variables
const [,, method, resource, ...extraArgs] = process.argv;

//función asincrónica para realizar las peticiones a la API
async function request(endpoint, options = {}) {
    const baseConfig = {
      headers: { 'Content-Type': 'application/json' }
  };

//uso del fetch con desestructuración y posterior manejo de errores
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, { ...baseConfig, ...options });
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[ERROR] ${error.message}`);
  }
}

//Función principal con lógica de métodos y recursos
async function main() {
  if (!method || !resource) {
    console.log('  Uso incorrecto. Ejemplos:');
    console.log('  npm run start GET products');
    console.log('  npm run start GET products/15');
    console.log('  npm run start POST products "T-Shirt-Rex" 300 remeras');
    console.log('  npm run start DELETE products/7');
    return;
  }

//GET todos o GET id
//uso de mayúsculas por convención para los métodos HTTP
  switch (method.toUpperCase()) {
    case 'GET':
      if (resource === 'products') {
        const products = await request('products');
        console.log('Lista de productos:');
        console.log(products);
      } else if (resource.startsWith('products/')) {
        //Determinamos el inicio del recurso con products/ para identificar GET por id
        //Determinamos la segunda parte del recurso, asumiendo el formato products/id luego del split
        //Usando la posición 1 del array resultante de split para obtener el id
        const id = resource.split('/')[1]; 
        const product = await request(`products/${id}`);
        console.log(`Producto ${id}:`);
        console.log(product);
      } else {
        console.log('Recurso GET no reconocido.');
      }
      break;

    case 'POST':
      if (resource === 'products') {
        const [title, price, category] = extraArgs;
        if (!title || !price || !category) {
          console.log('Faltan datos para el POST. Formato: <title> <price> <category>');
          return;
        }
//Desestructuración de los argumentos para luego asignarlos al nuevo producto con la conversión 
//de price a number
        const newProduct = await request('products', {
          method: 'POST',
          body: JSON.stringify({ title, price: Number(price), category })
        });
        console.log('Producto creado exitosamente:');
        console.log(newProduct);
      } else {
        console.log('Recurso POST no reconocido.');
      }
      break;

    case 'DELETE':
      if (resource.startsWith('products/')) {
        const id = resource.split('/')[1]; 
        const result = await request(`products/${id}`, { method: 'DELETE' });
        console.log(`Producto ${id} eliminado. Respuesta del servidor:`);
        console.log(result);
      } else {
        console.log('Recurso DELETE no reconocido.');
      }
      break;

    default:
      console.log(`Método "${method}" no permitido. Usa GET, POST o DELETE.`);
  }
}

main();
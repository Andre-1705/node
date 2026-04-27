// Usamos Express para crear un servidor que actúe como intermediario 
// entre Thunder Client y la API de FakeStore
import express from 'express';

const app = express();
app.use(express.json()); 

const API_URL = 'https://fakestoreapi.com';

// Función request asincrónica (similar a la index)
async function request(endpoint, options = {}) {
    const baseConfig = {
      headers: { 'Content-Type': 'application/json' }
  };
  
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, { ...baseConfig, ...options });
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    return null; // Thunder Client maneja los errores visualmente
  }
}

//GET ID
//Pasamos dos argumentos la ruta/endpoint 
// y el segundo la función flecha asincrónica con req y res

app.get('/products/:id', async (req, res) => {
    // Params determina los parámetros de la ruta en este caso el id del producto
    const endpoint = `products/${req.params.id}`;
    const data = await request(endpoint);
    
    if (!data) return res.status(500).json({ error: "Fallo la conexión con FakeStore" });
    res.json(data);
});

//POST CREAR
app.post('/products', async (req, res) => {
    // Extraemos del Body que nos mande Thunder Client con la desestructuración 
    // las variables para crear el nuevo producto 
    const { title, price, category } = req.body; 
    
    if (!title || !price || !category) {
        return res.status(400).json({ error: "Faltan datos en el body" });
    }

    //Guardamos en newProducto el resultado transformando el json a string y parseando el price a number
    const newProduct = await request('products', {
        method: 'POST',
        body: JSON.stringify({ title, price: Number(price), category })
    });

    res.status(201).json(newProduct);
});

// 3. DELETE BORRAR
app.delete('/products/:id', async (req, res) => {
    const result = await request(`products/${req.params.id}`, { method: 'DELETE' });
    res.json(result);
});

// Encendemos el servidor función flecha para escuchar el puerto 4000
app.listen(4000, () => {
    console.log('Servidor de Thunder Client corriendo en: http://localhost:4000');
});



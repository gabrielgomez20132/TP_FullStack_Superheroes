import express from 'express';
import { connectDB } from './src/config/dbConfig.mjs';
import router from './src/routes/superHeroRoutes.mjs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';  
import methodOverride from 'method-override';
import expressEjsLayouts from 'express-ejs-layouts';

dotenv.config(); // Cargar variables de entorno

const app = express();

// Obtener la ruta base donde estarán las vistas
const __filename = fileURLToPath(import.meta.url);  
const __dirname = path.dirname(__filename);  

// Middleware para sobrescribir el método HTTP
app.use(methodOverride('_method')); 

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para procesar solicitudes JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos y manejar errores de conexión
connectDB().catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);  
});

// Rutas de superhéroes
app.use(router);

// Configurar express-ejs-layouts
app.use(expressEjsLayouts);
app.set('layout', 'layout'); // Indicar el layout que se va a usar

// Configurar la carpeta estática
app.use(express.static(path.join(__dirname, './public')));

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Mi Aplicación',
        navbarLinks: [
            { text: 'Inicio', href: '/', icon: '/icons/home.svg' },
            { text: 'Acerca de', href: '/about', icon: '/icons/info.svg' },
            { text: 'Contacto', href: '/contact', icon: '/icons/contact.svg' }
        ]
    });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
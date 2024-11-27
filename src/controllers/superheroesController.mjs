import { obtenerSuperHeroePorId, obtenerTodosLosSuperHeroes, 
    buscarSuperHeroesPorAtributo, obtenerSuperHeroesMayoresDe30, insertarSuperHeroes, actualizarSuperHeroes, deleteSuperHeroes , deleteByNameSuperHeroes } from '../services/SuperHeroService.mjs';
import { renderizarSuperHeroe, renderizarListaSuperheroes } from '../views/responseView.mjs';
import { validationResult } from 'express-validator';
import SuperHero from '../models/SuperHero.mjs';


export async function obtenerSuperHeroePorIdController(req, res){
    const { id } = req.params;
    const superheroe = await obtenerSuperHeroePorId(id);
    
    if(superheroe){
        res.send(renderizarSuperHeroe(superheroe));
    }
    else{
        res.status(404).send({mensaje: "Superheroe no encontradost"});
    }
}

export async function obtenerTodosLosSuperHeroesController(req, res){
    try {
        // Llamada a la función de servicio
        const superheroes = await obtenerTodosLosSuperHeroes();
       //console.log(superheroes);
        res.render('dashboard', { superheroes: superheroes });
    } catch (error) {
        console.error('Error al obtener los superhéroes:', error);
        res.status(500).send('Error al obtener los superhéroes');
    }
}

// Mostrar el formulario para agregar un superhéroe
export const mostrarFormularioAgregar = (req, res) => {
    res.render('addSuperhero');  // Renderiza el archivo addSuperhero.ejs
};

// Controlador para manejar la creación del superhéroe
export const agregarSuperHeroe = async (req, res) => {
    console.log(req.body)
    try {
        const { nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

        // Crear un nuevo documento en la base de datos
        const nuevoHeroe = new SuperHero({
            nombreSuperHeroe,
            nombreReal,
            edad,
            planetaOrigen,
            debilidad,
            poderes: poderes ? poderes.split(',').map(p => p.trim()) : [], // Convierte la lista en un array
            aliados: aliados ? aliados.split(',').map(a => a.trim()) : [],
            enemigos: enemigos ? enemigos.split(',').map(e => e.trim()) : [],
        });

        // Guardar el nuevo superhéroe en la base de datos
        await nuevoHeroe.save(); 

        // Redirige al dashboard después de agregar
        res.redirect('/heroes');
    } catch (error) {
        console.error('Error al agregar el superhéroe:', error);
        res.status(500).send('Error interno del servidor');
    }
};



export const mostrarFormularioEditar = async (req, res) => {
    try {
        const { id } = req.params;
        const superheroe = await SuperHero.findById(id);

        if (!superheroe) {
            return res.status(404).send({ mensaje: "Superhéroe no encontrado" });
        }

        // Renderiza el formulario y pasa los datos del superhéroe
        res.render('editSuperhero', { superheroe });
    } catch (error) {
        console.error('Error al buscar el superhéroe:', error);
        res.status(500).send('Error interno del servidor');
    }
};

export const actualizarSuperHeroe = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreSuperHeroe, nombreReal, edad, planetaOrigen, debilidad, poderes, aliados, enemigos } = req.body;

        // Actualiza el superhéroe en la base de datos
        const superheroeActualizado = await SuperHero.findByIdAndUpdate(
            id,
            {
                nombreSuperHeroe,
                nombreReal,
                edad,
                planetaOrigen,
                debilidad,
                poderes: poderes ? poderes.split(',').map(p => p.trim()) : [],
                aliados: aliados ? aliados.split(',').map(a => a.trim()) : [],
                enemigos: enemigos ? enemigos.split(',').map(e => e.trim()) : [],
            },
            { new: true } // Devuelve el documento actualizado
        );

        if (!superheroeActualizado) {
            return res.status(404).send({ mensaje: "Superhéroe no encontrado" });
        }

        // Redirige al dashboard o a otra página después de actualizar
        res.redirect('/heroes');
    } catch (error) {
        console.error('Error al actualizar el superhéroe:', error);
        res.status(500).send('Error interno del servidor');
    }
};


export async function buscarSuperheroesPorAtributoController(req, res){
    const {atributo, valor} = req.params;
    const superheroes = await buscarSuperHeroesPorAtributo(atributo, valor);

    if(superheroes.length > 0){
        res.send(renderizarListaSuperheroes(superheroes));
    }
    else{
        res.status(404).send({mensaje: "No se encontraron Superheroes con ese atributo"});
    }
}

export async function obtenerSuperHeroesMayoresDe30Controller(req, res){
    const superheroes = await obtenerSuperHeroesMayoresDe30();
    res.send(renderizarListaSuperheroes(superheroes));


}

export async function insertarSuperHeroesController(req, res){
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    
    try {
        const superhero = await insertarSuperHeroes(req, res);
        const renderizado = renderizarSuperHeroe(superhero); // Usamos renderizarSuperHeroe ya que es 1 solo SUPERHEROE
        res.status(201).send(renderizado); // Devuelve el objeto renderizado

    } catch (error) {
        console.error("Error en el controlador:", error.message);
        res.status(500).send({ error: "Error al insertar el superhéroe" });
    }
   
    
}

export async function editarSuperHeroesController(req, res){
    
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const superheroe = await actualizarSuperHeroes(req, res);

        // Verificamos si el superhéroe fue encontrado y actualizado
        if (!superheroe) {
            return res.status(404).send({ error: 'Superhéroe no encontrado' });
        }

        // Usamos renderizarSuperHeroe para un solo superhéroe
        const superheroeRenderizado = renderizarSuperHeroe(superheroe);

        // Retornamos la respuesta con el superhéroe actualizado
        res.status(200).send(superheroeRenderizado);

    } catch (error) {

        console.error("Error en el controlador:", error.message);
        res.status(500).send({ error: "Error al actualizar el superhéroe" });

    }
}

export async function eliminarSuperHeroesController(req, res){

    try {
        const superheroe = await deleteSuperHeroes(req, res);

        const superheroeRenderizado = renderizarSuperHeroe(superheroe);

        // Si la eliminación es exitosa, enviar respuesta
        res.status(200).send(superheroeRenderizado);
    } catch (error) {
        console.error("Error en el controlador:", error.message);
        res.status(500).send({ error: 'Error al eliminar el superhéroe' });
    }

}

export async function eliminarByNameSuperHeroesController(req, res){
    
    try {
        const {name} = req.params;
        const superheroe = await deleteByNameSuperHeroes(name);
        const superheroeRenderizado = renderizarSuperHeroe(superheroe)

        res.status(200).send(superheroeRenderizado);

    } catch (error) {
        console.error("Error en el controlador:", error.message);
        res.status(500).send({ error: 'Error al eliminar el superhéroe por su Nombre' });
    }
}



// Nuevo método de eliminación por ID
export async function eliminarSuperHeroePorId(id) {
    try {
        // Aquí se podría usar cualquier otra lógica de eliminación, como validaciones o relaciones
        const superheroe = await SuperHeroe.findById(id);  // Buscar el superhéroe por ID
        if (!superheroe) {
            throw new Error('Superhéroe no encontrado');
        }

        // Eliminar el superhéroe
        await superheroe.remove();  // Usamos el método de eliminación
        return superheroe;  // Retornamos el superhéroe eliminado para usarlo en el controlador si es necesario
    } catch (error) {
        throw new Error('Error al eliminar el superhéroe: ' + error.message);
    }
}
//eliminar mvc
export async function eliminarSuperHeroesControllerMvc(req, res) {

    const { id } = req.params;  // Accede al ID desde la URL
    console.log(`Eliminando superhéroe con ID: ${id}`);

    try {
        // busca y elimina con el modelo SuperHero
        const superheroe = await SuperHero.findByIdAndDelete(id);
        
        if (!superheroe) {
            // Si no se encuentra el superhéroe, lanzamos un error
            throw new Error('Superhéroe no encontrado');
        }


        // Redirigir al dashboard después de eliminar
        res.redirect('/heroes');  // Redirige al dashboard después de la eliminación

    } catch (error) {
        console.error("Error al eliminar el superhéroe:", error.message);
        // Si hay un error, enviar un mensaje de error adecuado
        res.status(500).send({ error: 'Error al eliminar el superhéroe' });
    }
}
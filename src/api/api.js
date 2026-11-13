import axios from "axios";

// Configuración de la instancia de Axios para realizar peticiones a la API
export const api = axios.create({
    baseURL: "http://localhost:5050" // Establece la URL base de la API
})

// Función para buscar datos en la API y actualizar el estado de un componente
export async function buscar(url) {
    try {
        const respuesta = await api.get(url); // Realiza una petición GET a la URL proporcionada
        return respuesta.data; // Retorna los datos obtenidos de la API
    } catch (error) {
        throw new Error(`Error al buscar datos: ${error.message}`);
    }
}

// Función para agregar una nueva categoría
export function agregarCategoria(newCategory) {
    const rutaAgregarCategoria = `/categorias/agregar`; // Ruta para agregar una nueva categoría
    return api.post(rutaAgregarCategoria, newCategory); // Realiza una petición POST para agregar la nueva categoría
}

// Función para editar una categoría existente
export function editarCategoria(categoryId, updatedVideoData) {
    const rutaEditarCategoria = `/categoria/${categoryId}/editar`; // Ruta para editar una categoría existente
    return api.put(rutaEditarCategoria, updatedVideoData); // Realiza una petición PUT para editar la categoría
}

// Función para eliminar una categoría
export function eliminarCategoria(categoryId) {
    const rutaEliminarCategoria = `/categoria/${categoryId}/eliminar`; // Ruta para eliminar una categoría
    return api.delete(rutaEliminarCategoria);  // Realiza una petición DELETE para eliminar la categoría
}

// Funcion para obtner videos por categoryId
export function obtnerVideos() {
    return api.get('/videos')
}

// Función para agregar un nuevo video a una categoría específica
export function agregarNuevoVideo(categoryId, newVideo) {
    const rutaParaAgregarVideo = `/categoria/${categoryId}/agregar_video`; // Ruta para agregar un nuevo video
    return api.post(rutaParaAgregarVideo, newVideo); // Realiza una petición POST para agregar el nuevo video
}
// Función para editar un video en una categoría específica
export function editarVideo(videoId, updatedVideoData) {
    const rutaEditarVideo = `/videos/${videoId}/editar`; // Ruta para editar el video
    return api.put(rutaEditarVideo, updatedVideoData); // Realiza una petición PUT para actualizar los datos del video
}

// Función para eliminar un video de una categoría específica
export function eliminarVideo(categoryId, id) {
    const rutaEliminarVid = `/categoria/${categoryId}/eliminar_video/${id}`; // Ruta para eliminar un video
    return api.delete(rutaEliminarVid); // Realiza una petición DELETE para eliminar el video
}

// Función para obtener el estado de "like" de un video
export function obtenerEstadoLike(videoId) {
    const rutaEstadoLike = `/video/${videoId}/liked`; // Ruta para obtener el estado de "like" de un video
    return api.get(rutaEstadoLike); // Realiza una petición GET para obtener el estado de "like"
}

// Función para dar "like" o "dislike" a un video
export function darLikeVideo(videoId, liked) {
    const rutaLikeVideo = `/video/${videoId}/like`;  // Ruta para dar "like" o "dislike" a un video
    return api.put(rutaLikeVideo, { liked }, { headers: { 'Content-Type': 'application/json' } }); // Realiza una petición PUT para dar "like" o "dislike"
}

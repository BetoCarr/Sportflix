// Importar los estilos y los componentes necesarios
import './NewCategoryFormStyle.css'; // Importa los estilos específicos para este componente
import React from "react"; // Importa React y el hook useState
import { useSelector, useDispatch } from 'react-redux';
import {Typography} from '@mui/material'; // Importa el componente Typography de Material-UI
import { Formik, Form } from 'formik'; // Importa los componentes Formik y Form de Formik
import { selectAllCategories, addCategory, updateCategory } from '../../categoriesSlice'
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate de React Router
import { useFeedback } from '../../../feedbackdialog/feedBackDialogContext';
import { calculateColorDifference } from '../ColorSelector/ColorSelector';
import TextInput from "../../../../Components/TextInput/TextInput"; // Importa el componente TextInput
import SwitchIsBanner from '../SwitchIsBanner/SwitchIsBanner'; // Importa el componente SwitchIsBanner
import ColorSelector from '../ColorSelector/ColorSelector'; // Importa el componente ColorSelector
import FormButtons from '../../../../Components/FormButtons/FormButtons'; // Importa el componente FormButtons

// Función del componente principal NewCategoryForm
function NewCategoryForm({ initialValuesForEdit, isEditing, categoryId }) {

    // Hook para navegar entre rutas
    const navigate = useNavigate(); 

    // Hook para despachar acciones de Redux
    const dispatch = useDispatch(); 

    // Hooks del contexto de feedback para abrir y cerrar diálogos
    const { openFeedback } = useFeedback()

    // Obtener las categorías y sus colores
    const categories = useSelector(selectAllCategories);
    const existingColors = categories.map(category => category.color);

    // Valores iniciales del formulario
    const initialValues = initialValuesForEdit || {
        nombre: '',
        color:'#FF0000', 
        isBanner: false,
    };

    // Función auxiliar para validar el color, utiliza la funcion importada de ColorSelector,
    // Recibe color a verificar, colores existentes, y el booleano isEditing para determinar si se está editando una categoria
    const validateColor = (value, existingColors, isEditing) => {
        
        let filteredColors = existingColors // Copia inicial de los colores existentes.
        // Si se va a editar la categoria...
        if(isEditing) {
            let categoryColor = initialValuesForEdit.color // Obtiene el color actual de la categoría que se está editando.
            filteredColors = existingColors.filter(color => color !== categoryColor); // Excluye el color de la categoría actual de la validación
        
        }
        
        const threshold = 50; // Define el umbral para colores similares
        
        // Verifica si el color seleccionado es demasiado similar a alguno ya existente.
        // Si la diferencia entre el valor actual y cualquier color existente es menor
        // que el umbral, se considera "demasiado similar".
        const isTooSimilar = filteredColors.some(color => 
            calculateColorDifference(value, color) < threshold
        )

        // Si se detecta un color demasiado similar, devuelve un mensaje de error.
        if (isTooSimilar) {
            return `El color es demasiado similar a uno existente`;
        }
        // Si no hay conflictos, retorna undefined (sin errores).
        return undefined; 
    }
    
    return(
        <>
            {/* Encabezado */}
            <Typography variant='h3' color='text.primary'>
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
            </Typography>
            {/* Formulario con Formik */}
            <Formik
                initialValues={initialValues}
                validateOnChange={true} // Activar la validación en cada cambio del campo

                // Validación del formulario
                validate={values => {
                    const { nombre, color, isBanner } = values;
                    const errors = {};
                    
                    //Validación del nombre de la categoria
                    if(!nombre) {
                        errors.nombre = 'El nombre de la categoria es requerido';
                    } else if(!/^[a-zA-Z0-9À-ÿ\s-]{3,50}$/.test(nombre)) {
                        errors.nombre = 'El nombre de la categoría solo puede incluir letras, números, espacios y guiones';
                    }

                    // Validación del color
                    const colorError = validateColor(color, existingColors, isEditing);
                    if (colorError) {
                        errors.color = colorError; // Asignar el mensaje de error devuelto por validateColor
                    }

                    // Validación de isBanner
                    if (typeof isBanner !== 'boolean') {
                        errors.isBanner = 'El valor de isBanner debe ser booleano';
                    }

                    return errors;
                }}
                    
                onSubmit={async (values, { resetForm }) => {
                    const action = isEditing
                        ? updateCategory({ categoryId, updatedCategory: values })
                        : addCategory(values);
                    
                    try {
                        await dispatch(action).unwrap();
                        openFeedback("InformativeFeedbackDialog", {
                            message: isEditing 
                                ? "Categoría editada exitosamente!" 
                                : "Categoría agregada exitosamente!",
                            onCloseCallback: () => {
                                resetForm();
                                navigate('/', { replace: true });
                            },
                        });
                    } catch (error) {
                        console.error("Error al procesar la acción:", error);
                    }
                }}
            >
                {({isSubmitting, resetForm}) => (
                    <Form className='form-container'>
                        {/* Componente para el nombre */}
                        <TextInput
                            label="Nombre"
                            name="nombre"
                            placeholder="Introduce el nombre de la nueva categoria"
                        />
                        {/* Componente para el banner */}
                        <SwitchIsBanner
                            name="isBanner"            
                        />
                        {/* Componente para seleccionar el color */}
                        <ColorSelector
                            name="color"
                            id="color" 
                            label="Selecciona un color"
                        />
                        {/* Componente para los botones del formulario */}                       
                        <FormButtons
                            isSubmitting={isSubmitting} 
                            resetForm={resetForm}
                        />
                    </Form>
                )}
            </Formik>
        </>
    );
}

// Exporta comoponente principal
export default NewCategoryForm;
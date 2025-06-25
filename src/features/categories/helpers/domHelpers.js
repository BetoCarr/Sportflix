import { screen } from '@testing-library/react';

export const domHelpers = {
    // Retorna el mensaje de loading, si está presente
    getLoadingMessage: () => screen.queryByText(/Loading.../i),

    // Retorna el nodo del mensaje de error mediante test-id
    getErrorMessage: () => screen.queryByTestId('error'),
    
    // Busca un nodo de categoría por nombre (texto exacto)
    getCategoryByName: (nombre) => screen.queryByText(nombre),
};
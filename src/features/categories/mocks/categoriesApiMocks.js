import { jest } from '@jest/globals';

export const mockBuscar = jest.fn();
export const mockAddCategory = jest.fn();
export const mockUpdateCategory = jest.fn();

export const mockCategoriesData = {
  // Categorías básicas para testing
  basic: [
    { id: 1, nombre: 'Fut-bol', color: '#FF5733', isBanner: true },
    { id: 2, nombre: 'Frontenis', color: '#33C4FF', isBanner: false },
    { id: 3, nombre: 'Longboarding', color: '#33FF57', isBanner: false }
  ],  
  // Nueva categoría para agregar en el test
  newCategory: {
    id: 4,
    nombre: 'Natacion',
    color: '#123456',
    isBanner: false
  }
}
// Funciones helper para configurar mocks
export const setupSuccessfulFetchMock = (data = mockCategoriesData.basic) => {
  mockBuscar.mockResolvedValue(data);
};

export const setupFailedFetchMock = (errorMessage = 'Error de red') => {
  mockBuscar.mockRejectedValue(new Error(errorMessage));
};

// Helper para simular un addCategory exitoso
export const setupSuccessfulAddCategoryMock = () => {
  const updatedList = [...mockCategoriesData.basic, mockCategoriesData.newCategory];
  // La API responde con el nuevo arreglo bajo el campo `categorias`
  mockAddCategory.mockResolvedValue({
    data: {
      categorias: updatedList
    }
  });
};

// Helper para simular un fallo en addCategory
export const setupFailedAddCategoryMock = (errorMessage = 'Error de red al agregar') => {
  mockAddCategory.mockRejectedValue(new Error(errorMessage));
};

// Helper para simular updateCategory exitoso
export const setupSuccessfulUpdateCategoryMock = () => {
  const updatedList = mockCategoriesData.basic.map(cat =>
    cat.id === 1 ? { ...cat, nombre: 'Futbol Editado' } : cat
  );

  mockUpdateCategory.mockResolvedValue({
    data: {
      categorias: updatedList
    }
  });
};

export const setupFailedUpdateCategoryMock = (message = 'Fallo al actualizar') => {
  mockUpdateCategory.mockRejectedValue({
    response: { data: message }
  });
};

export const clearAllMocks = () => {
  mockBuscar.mockClear()
  mockAddCategory.mockClear()
  mockUpdateCategory.mockClear()
};

// Función para resetear todos los mocks (incluyendo implementaciones)
export const resetAllMocks = () => {
  mockBuscar.mockReset()
  mockAddCategory.mockClear()
  mockUpdateCategory.mockClear();
};
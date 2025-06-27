// src/features/categories/__tests__/CategoriesTestComponent.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectAllCategories, addCategory, updateCategory, deleteCategory } from './categoriesSlice';
import { mockCategoriesData } from './mocks/categoriesApiMocks';

export default function CategoriesTestComponent() {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleAddCategory = () => {
    dispatch(addCategory(mockCategoriesData.newCategory));
  }
  const handleUpdateCategory = () => {
    dispatch(updateCategory({
      categoryId: 1,
      updatedCategory: { nombre: 'Futbol Editado' }
    }))
  }
  const handleDeleteCategory = () => {
    dispatch(deleteCategory(mockCategoriesData.basic[2].id))
  }

  
  return (
    <div>
      <div data-testid="status">{status}</div>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p data-testid="error">{error}</p>}
      {status === 'succeeded' && (
        <ul data-testid="category-list">
          {categories.map((cat) => (
            <li key={cat.id}>{cat.nombre}</li>
          ))}
        </ul>
      )}
      {/* 👉 Botón exclusivo para agregar categoria */}
      <button data-testid="add-category-btn" onClick={handleAddCategory}>
        Agregar categoría (test)
      </button>
      <button data-testid="update-category-btn" onClick={handleUpdateCategory}>
        Actualizar categoría (test)
      </button>
      <button data-testid="delete-category-btn" onClick={handleDeleteCategory}>
        Eliminar categoría (test)
      </button>
    </div>
  );
}
import { fireEvent, screen } from '@testing-library/react';

export const actionHelpers = {
  clickAddCategoryButton: () => {
    const button = screen.getByTestId('add-category-btn')
    fireEvent.click(button)
  },
  clickUpdateCategoryButton: () => {
    const button = screen.getByTestId('update-category-btn')
    fireEvent.click(button)
  },
  clickDeleteCategoryButton: () => {
    const button = screen.getByTestId('delete-category-btn')
    fireEvent.click(button)
  }
};

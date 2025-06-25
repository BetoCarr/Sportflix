import { waitFor } from '@testing-library/react';
import { domHelpers } from './domHelpers';

export const assertionHelpers = {
  async expectCategoriesToBeRendered(names = []) {
    await waitFor(() => {
        names.forEach(name => {
          expect(domHelpers.getCategoryByName(name)).toBeInTheDocument();
        });
    });
  },

  expectLoadingVisible() {
    expect(domHelpers.getLoadingMessage()).toBeInTheDocument();
  },

  async expectErrorVisible(expectedMessage) {
    await waitFor(() => {
      const errorElement = domHelpers.getErrorMessage();
      expect(errorElement).toBeInTheDocument();

      // Validación adicional si se espera un mensaje específico
      if (expectedMessage) {
        expect(errorElement.textContent).toBe(expectedMessage);
      }
    });
  }
};

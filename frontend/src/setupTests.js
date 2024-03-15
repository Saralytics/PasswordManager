// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  }));

// Mock window.alert globally
window.alert = jest.fn();

// jest.mock('./utils/AuthContext', () => ({
//   useAuth: () => ({
//     setIsAuthenticated: jest.fn(),
//     // Mock other context values and functions as needed
//   }),
// }));
  
  
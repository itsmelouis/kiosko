/* eslint-disable no-undef */
// Mock useColorScheme to avoid ReferenceError after Jest teardown
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(() => 'light'),
}));

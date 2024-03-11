import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import renderer from 'react-test-renderer';

// Mocks
jest.mock('../../Navigation/navigation', () => ({
  rootNavigate: jest.fn(),
}));
jest.mock('@realm/react', () => ({
  useRealm: jest.fn().mockReturnValue({
    write: jest.fn(),
    create: jest.fn(),
  }),
  useQuery: jest.fn(() => {
    return [];
  }),
}));
jest.mock('realm', () => ({
  BSON: {ObjectID: jest.fn().mockReturnValue('mocked-id')},
}));
jest.mock('../../components/common/InputBox', () => 'InputBox');
jest.mock('../../components/common/Button', () => 'Button');

describe('LoginScreen Tests', () => {
  const onContinuePressMock = jest.fn();
  //convert LoginScreen To object

  //   const onContinuePressSpy = jest.spyOn(
  //     LoginScreen.prototype,
  //     'onContinuePress',
  //   );

  //   beforeEach(() => {
  //     // Clear all information stored in the mock spy function before each test
  //     onContinuePressSpy.mockClear();
  //   });
  it('renders correctly when there is no user', () => {
    // Setup
    const {getByText, queryByText, getByPlaceholderText, getByTestId} = render(
      <LoginScreen />,
    );
    const loginScreen = renderer.create(<LoginScreen />).toJSON();
    expect(loginScreen).toMatchSnapshot();
    const element = getByTestId('nameInput');
    expect(element).toBeTruthy();

    expect(queryByText('Welcome')).toBeNull();
  });

  it('updates name state on input change', () => {
    // Setup
    const {getByPlaceholderText, getByTestId} = render(<LoginScreen />);
    const inputBox = getByTestId('nameInput');
    const enterButton = getByTestId('enterButton');
  });

  it('handles "Enter" button press correctly', () => {
    // Setup
    const {getByText, getByTestId} = render(<LoginScreen />);
    const enterButton = getByTestId('enterButton');

    // Act
    fireEvent.press(enterButton);

    // Assertions
    // Check if the realm write function was called, or if `onContinuePress` behaved as expected.
  });

  it('shows welcome message when user exists', () => {
    // Setup
    require('@realm/react').useQuery.mockReturnValue([{name: 'John Doe'}]);
    const {getByText} = render(<LoginScreen />);

    // Assertions
    expect(getByText('Welcome John Doe')).toBeTruthy();
  });

  //   it('calls `onContinuePress` on component mount', () => {
  //     render(<LoginScreen />);

  //     // Assertions
  //     expect(onContinuePressMock).toHaveBeenCalled();
  //   });
});

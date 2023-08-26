/**
 * @jest-environment jsdom
 */

// example test from react testing library readme

import * as React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';

const HiddenMessage: React.FC<{ children: React.ReactNode }> = props => {
  const { children } = props;
  const [showMessage, setShowMessage] = React.useState(false);
  return (
    <div>
      <label htmlFor="toggle">Show Message</label>
      <input
        id="toggle"
        type="checkbox"
        onChange={e => setShowMessage(e.target.checked)}
        checked={showMessage}
      />
      {showMessage ? children : null}
    </div>
  );
};

test('shows the children when the checkbox is checked', () => {
  const testMessage = 'Test Message';
  render(<HiddenMessage>{testMessage}</HiddenMessage>);

  expect(screen.queryByText(testMessage)).toBeNull();

  fireEvent.click(screen.getByLabelText(/show/i));

  expect(screen.getByText(testMessage)).toBeDefined();
});

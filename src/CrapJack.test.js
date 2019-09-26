import React from 'react';
import ReactDOM from 'react-dom';
import CrapJack from './CrapJack';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CrapJack />, div);
  ReactDOM.unmountComponentAtNode(div);
});

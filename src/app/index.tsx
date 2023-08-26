import * as React from 'react';
import Map from './map';

const App: React.FC = () => (
  <div className="content">
    <Map mapStyle="streets" />
  </div>
);

export default App;

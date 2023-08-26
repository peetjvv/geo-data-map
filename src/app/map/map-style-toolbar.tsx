import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faSatellite } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { throwIfNotNever } from '../../util/typescript';
import { MapStyleName } from '../../data/mapbox/types';

const MapStyleButton: React.FC<{
  name: MapStyleName;
  isSelected: boolean;
  onClick: (e?: React.MouseEvent) => void;
}> = props => {
  const { name, isSelected, onClick } = props;

  let icon: IconDefinition = faMap;
  switch (name) {
    case 'streets':
      icon = faMap;
      break;
    case 'satellite-streets':
      icon = faSatellite;
      break;

    default:
      throwIfNotNever(name);
      break;
  }

  return (
    <div
      className={`map-style-button ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
  );
};

const MapStyleToolbar: React.FC<{
  value: MapStyleName;
  onChange: (v: MapStyleName) => void;
}> = props => {
  const { value, onChange } = props;

  return (
    <div className="map-style-toolbar">
      <MapStyleButton
        name="streets"
        isSelected={value === 'streets'}
        onClick={() => onChange('streets')}
      />
      <MapStyleButton
        name="satellite-streets"
        isSelected={value === 'satellite-streets'}
        onClick={() => onChange('satellite-streets')}
      />
    </div>
  );
};

export default MapStyleToolbar;

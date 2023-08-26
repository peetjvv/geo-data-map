import {
  IconDefinition,
  faLocationArrow,
  faMinus,
  faPlus,
  faRoad,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { ViewState } from 'react-map-gl';

const MapControlButton: React.FC<{
  className?: string;
  disabled?: boolean;
  icon: IconDefinition;
  iconStyle?: React.CSSProperties;
  onClick: () => void;
  value?: number;
}> = props => {
  const {
    className = '',
    disabled = false,
    icon,
    iconStyle = {},
    onClick,
    value,
  } = props;

  return (
    <div
      className={`map-control-button ${
        disabled ? 'disabled' : ''
      } ${className}`}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      <FontAwesomeIcon style={iconStyle} icon={icon} />
      {value !== undefined ? <span>{value.toFixed(1)}</span> : null}
    </div>
  );
};

const MapControlsToolbar: React.FC<{
  viewState: ViewState;
  setViewState: (value: ViewState) => void;
}> = props => {
  const { viewState, setViewState } = props;

  return (
    <div className="map-controls-toolbar">
      <MapControlButton
        // disabled={viewState.zoom === viewState.maxZoom}
        icon={faPlus}
        onClick={() =>
          setViewState({
            ...viewState,
            zoom: viewState.zoom! + 1,
            // transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
          })
        }
        value={viewState.zoom}
      />
      <MapControlButton
        // disabled={viewState.zoom === viewState.minZoom}
        icon={faMinus}
        onClick={() =>
          setViewState({
            ...viewState,
            zoom: viewState.zoom! - 1,
            // transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
          })
        }
      />
      {viewState.bearing !== undefined ? (
        <MapControlButton
          disabled={viewState.bearing === 0}
          icon={faLocationArrow}
          iconStyle={{ transform: `rotate(${viewState.bearing - 45}deg)` }}
          onClick={() =>
            setViewState({
              ...viewState,
              bearing: 0,
              // transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
            })
          }
          value={viewState.bearing}
        />
      ) : null}
      {viewState.pitch !== undefined ? (
        <MapControlButton
          disabled={(viewState.pitch || 0) === 0}
          icon={faRoad}
          onClick={() =>
            setViewState({
              ...viewState,
              pitch: 0,
              // transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
            })
          }
          value={viewState.pitch}
        />
      ) : null}
    </div>
  );
};

export default MapControlsToolbar;

import * as React from 'react';
import { useRef, useState } from 'react';
import ReactMapGl, { MapRef, ScaleControl, ViewState } from 'react-map-gl';
import MapboxGeocoder from './mapbox-geocoder';
import MapControlsToolbar from './map-controls-toolbar';
import MapStyleToolbar from './map-style-toolbar';
import { MapStyleName } from '../../data/mapbox/types';
import { throwIfNotNever } from '../../util/typescript';

const Map: React.FC<{
  mapStyle: MapStyleName;
}> = props => {
  const { mapStyle } = props;

  const mapRef = useRef<MapRef | null>(null);
  const bottomCenterControlsContainerRef = useRef<HTMLDivElement | null>(null);

  let mapStyleUrl: string | undefined;
  switch (mapStyle) {
    case 'streets':
      mapStyleUrl = `mapbox://styles/mapbox/streets-v11`;
      break;
    case 'satellite-streets':
      mapStyleUrl = `mapbox://styles/mapbox/satellite-streets-v11`;
      break;

    default:
      throwIfNotNever(mapStyle);
      break;
  }

  const [viewState, setViewState] = useState<ViewState>({
    latitude: 0,
    longitude: 0,
    zoom: 5,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  });

  //   const setViewport = (vp: MyViewportProps) =>
  //     dispatch({ type: 'MAPBOX', subType: 'SET_VIEWPORT', payload: vp });

  //   useEffect(() => {
  //     const initialViewport: MyViewportProps = {
  //       ...viewport,
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     };
  //     setViewport(initialViewport);

  //     window.addEventListener('resize', () => {
  //       setViewport({
  //         ...viewport,
  //         width: window.innerWidth,
  //         height: window.innerHeight - 200,
  //       });
  //     });
  //   }, []);

  return (
    <div className="map-container">
      <ReactMapGl
        {...viewState}
        // TODO: setViewState
        style={{ width: '100%', height: '100%' }}
        mapboxAccessToken={process.env.MAPBOX_TOKEN}
        ref={mapRef}
        mapStyle={mapStyleUrl}
        doubleClickZoom={false}
        // clickRadius={5}
        // cursor={({ isHovering, isDragging }) =>
        //   isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default'
        // }
      >
        {/* <Layer
      {...{
        id: 'landuse_park',
        type: 'fill',
        source: 'mapbox',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'park'],
      }}
      paint={{ 'fill-color': '#ff0000' }}
    /> */}
        <div className="scale-controls-container">
          <ScaleControl maxWidth={100} unit={'metric'} />
          <ScaleControl maxWidth={100} unit={'imperial'} />
        </div>
      </ReactMapGl>
      <div className="map-controls-container top left">
        <MapboxGeocoder viewState={viewState} setViewState={setViewState} />
      </div>
      <div className="map-controls-container top right">
        <MapControlsToolbar viewState={viewState} setViewState={setViewState} />
      </div>
      <div className="map-controls-container bottom left">
        <MapStyleToolbar
          value={mapStyle}
          onChange={style => {
            // dispatch({
            //   type: 'MAPBOX',
            //   subType: 'SET_MAP_STYLE',
            //   payload: style,
            // });
          }}
        />
      </div>
      <div
        ref={bottomCenterControlsContainerRef}
        className="map-controls-container bottom center"
        style={{
          left:
            !!bottomCenterControlsContainerRef &&
            !!bottomCenterControlsContainerRef.current
              ? Math.ceil(
                  window.innerWidth / 2 -
                    bottomCenterControlsContainerRef.current.clientWidth / 2
                )
              : undefined,
        }}
      ></div>
    </div>
  );
};

export default Map;

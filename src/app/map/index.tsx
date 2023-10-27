import * as React from 'react';
import { useMemo, useRef, useState } from 'react';
import ReactMapGl, {
  Layer,
  LayerProps,
  MapRef,
  ScaleControl,
  Source,
  ViewState,
} from 'react-map-gl';
import GeoJSONTerminator from '@webgeodatavore/geojson.terminator';
import MapboxGeocoder from './mapbox-geocoder';
import MapControlsToolbar from './map-controls-toolbar';
import MapStyleToolbar from './map-style-toolbar';
import { MapStyleName } from '../../data/mapbox/types';
import { throwIfNotNever } from '../../util/typescript';
import { GeoJSONSourceOptions } from 'mapbox-gl';

const threeDeeBuildingsLayer: LayerProps = {
  // https://docs.mapbox.com/mapbox-gl-js/example/3d-buildings/
  // TODO: lights/accent colours on buildings - https://www.mapbox.com/blog/standard-core-style
  id: 'add-3d-buildings',
  source: 'composite',
  'source-layer': 'building',
  filter: ['==', 'extrude', 'true'],
  type: 'fill-extrusion',
  minzoom: 15,
  paint: {
    'fill-extrusion-color': '#aaa',

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    'fill-extrusion-height': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'height'],
    ],
    'fill-extrusion-base': [
      'interpolate',
      ['linear'],
      ['zoom'],
      15,
      0,
      15.05,
      ['get', 'min_height'],
    ],
    'fill-extrusion-opacity': 0.6,
  },
};

const createDayNightLayer = (
  geojson: GeoJSONSourceOptions['data']
): LayerProps => ({
  // https://gist.github.com/malwoodsantoro/3478cb346ffd8e42685be5dd56b518cd
  // TODO: why isn't this layer showing on the map?
  // TODO: add night lights in dark areas: https://www.mapbox.com/gallery - NASA's Black Marble
  id: 'dayNight',
  type: 'fill',
  source: {
    type: 'geojson',
    data: geojson,
  },
  layout: {},
  paint: {
    'fill-color': '#000',
    'fill-opacity': 0.2,
  },
});

const Map: React.FC = () => {
  const mapRef = useRef<MapRef | null>(null);
  const bottomCenterControlsContainerRef = useRef<HTMLDivElement | null>(null);

  const [mapStyle, setMapStyle] = useState<MapStyleName>('streets');
  const mapStyleUrl = useMemo(() => {
    switch (mapStyle) {
      case 'streets':
        return `mapbox://styles/mapbox/streets-v12`;
      case 'satellite-streets':
        return `mapbox://styles/mapbox/satellite-streets-v12`;

      default:
        throwIfNotNever(mapStyle);
        break;
    }

    return `mapbox://styles/mapbox/streets-v12`;
  }, [mapStyle]);

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

  const labelLayerId = useMemo(() => {
    const layers = mapRef.current?.getMap().getStyle().layers;

    const result = layers?.find(
      layer => layer.type === 'symbol' && (layer.layout || {})['text-field']
    )?.id;

    return result;
  }, [mapRef.current, mapStyle]);

  const dayNightLayer = useMemo(() => {
    const geojson = new GeoJSONTerminator();
    const result = createDayNightLayer(geojson);
    console.log('dayNightLayer', geojson, result);
    return result;
  }, []);

  return (
    <div className="map-container">
      <ReactMapGl
        {...viewState}
        onMove={({ viewState }) => setViewState(viewState)}
        style={{ width: '100%', height: '100%' }}
        mapboxAccessToken={process.env.MAPBOX_TOKEN}
        ref={mapRef}
        mapStyle={mapStyleUrl}
        // clickRadius={5}
        // cursor={({ isHovering, isDragging }) =>
        //   isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default'
        // }
        terrain={{ source: 'mapbox-dem', exaggeration: 1 }}
        projection={{ name: 'globe' }} // TODO: button to turn globe on/off and setting to pick non-globe projection
        fog={{
          // TODO: add setting to enable/disable/edit this
          // https://docs.mapbox.com/mapbox-gl-js/guides/globe/
          color: 'rgb(186, 210, 235)', // Lower atmosphere
          'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
          'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
          'space-color': 'rgb(11, 11, 25)', // Background color
          'star-intensity': 0.6, // Background star brightness (default 0.35 at low zooms )
        }}
        // light={{
        //   anchor: 'viewport',
        //   color: 'pink',
        //   intensity: 0.1,
        //   position: [1.5, 90, 80],
        // }}
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

        {/* TODO: add options to pick between day/night/dusk/day-night - https://www.mapbox.com/blog/standard-core-style */}
        <Layer {...dayNightLayer} />

        {/* TODO: add setting to enable/disable this */}
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={256}
          maxzoom={14} // TODO: make this max zoom a setting
        />

        {/* TODO: add setting to enable/disable this */}
        <Layer {...threeDeeBuildingsLayer} beforeId={labelLayerId} />

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
          onChange={style => setMapStyle(style)}
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

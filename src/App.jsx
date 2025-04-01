import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
  Marker,
  HeatmapLayer,
  MarkerClusterer,
  Polygon,
  DrawingManager,
  OverlayView,
} from "@react-google-maps/api";
import { useRef, useState, React } from "react";
import Modal from "@mui/material/Modal";

const center = { lat: 37.782, lng: -122.447 };
const dayMode = [];
const nightMode = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "water", stylers: [{ color: "#17263c" }] },
];

const library = ["places", "visualization", "drawing"];

function App() {
  console.log("fei");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_URL,
    libraries: library,
  });

  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(Date.now());
  const heatmapRef = useRef(null);
  const [visualizationType, setVisualizationType] = useState("markers");
  const [mapType, setMapType] = useState("roadmap");
  const [clustering, setClustering] = useState(true);
  const [markerSize, setMarkerSize] = useState(30);
  const [theme, setTheme] = useState("day");
  const [territories, setTerritories] = useState([
    {
      name: "territory1",
      path: [
        { lat: 37.77568419249668, lng: -122.44759223122664 },
        { lat: 37.77768550052012, lng: -122.4515833582408 },
        { lat: 37.7796867543651, lng: -122.45329997201033 },
        { lat: 37.779279724073874, lng: -122.44639060158796 },
        { lat: 37.779381481856795, lng: -122.44106909890242 },
        { lat: 37.77646436986452, lng: -122.44484564919539 },
      ],
    },
  ]);

  const [drawingMode, setDrawingMode] = useState(null);
  const [drawingKey, setDrawingKey] = useState(0);
  const drawingManagerRef = useRef(null);
  const [territorynum, setTerritorynum] = useState(2);
  const [hoveredTerritory, setHoveredTerritory] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!isLoaded) {
    return <p>loading...</p>;
  } else {
  }

  const markerdata = [
    {
      lat: 37.782,
      lng: -122.447,
    },
    {
      lat: 37.782,
      lng: -122.445,
    },
    {
      lat: 37.782,
      lng: -122.443,
    },
    {
      lat: 37.782,
      lng: -122.441,
    },
    {
      lat: 37.782,
      lng: -122.439,
    },
    {
      lat: 37.782,
      lng: -122.437,
    },
    {
      lat: 37.782,
      lng: -122.435,
    },
    {
      lat: 37.785,
      lng: -122.447,
    },
    {
      lat: 37.785,
      lng: -122.445,
    },
    {
      lat: 37.785,
      lng: -122.443,
    },
    {
      lat: 37.785,
      lng: -122.441,
    },
    {
      lat: 37.785,
      lng: -122.439,
    },
    {
      lat: 37.785,
      lng: -122.437,
    },
    {
      lat: 37.785,
      lng: -122.435,
    },
  ];

  const headMapToogle = () => {
    setVisualizationType((prev) =>
      prev === "heatmap" ? "markers" : "heatmap"
    );
    setKey((prev) => prev + 1);
    if (heatmapRef.current) {
      console.log("Unmounting heatmap...");
      heatmapRef.current.setMap(null); // Ensure the heatmap is removed from the map
      heatmapRef.current = null; // Reset the reference
    }
  };

  const handlePolygonComplete = (polygon) => {
    console.log(
      "🚀 ~ handlePolygonComplete ~ polygon:",
      polygon.getPath().getArray()
    );
    const path = polygon
      .getPath()
      .getArray()
      .map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));

    const territoryname = `territory${territorynum}`;

    setTerritories((prev) => [...prev, { name: territoryname, path }]);
    setTerritorynum((prev) => prev + 1);

    toggleDrawingMode();
    console.log("ON COMPLETE");
    polygon.setMap(null);
  };

  const toggleDrawingMode = () => {
    setDrawingMode((prevMode) =>
      prevMode === google.maps.drawing.OverlayType.POLYGON
        ? null
        : google.maps.drawing.OverlayType.POLYGON
    );
  };

  const handleMouseOver = (territoryName) => {
    setHoveredTerritory(territoryName);
  };

  const handleMouseOut = () => {
    setHoveredTerritory(null);
  };

  const calculateCentroid = (path) => {
    let latSum = 0,
      lngSum = 0;
    path.forEach((point) => {
      // console.log(point.lat, point.lng);
      latSum += point.lat;
      lngSum += point.lng;
    });
    return { lat: latSum / path.length, lng: lngSum / path.length };
  };

  // Force re-render

  return (
    <>
      <Autocomplete>
        <input
          type="text"
          placeholder="Enter your text..."
          className="absolute left-5 top-5 z-10 w-[60%] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </Autocomplete>
      {hoveredTerritory && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 10,
          }}
        >
          <strong>{hoveredTerritory}</strong>
        </div>
      )}

      <button
        onClick={toggleDrawingMode}
        className="z-10 absolute bottom-6 bg-purple-400 right-3 p-3 cursor-pointer"
      >
        {drawingMode ? "Disable Territory Creation" : "Create Territory"}
      </button>
      <div className="w-screen h-screen">
        <GoogleMap
          center={center}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          zoom={15}
          options={{
            zoomControl: false,
            fullscreenControl: false,
            mapTypeControl: false,
            cameraControl: false,
            styles: theme === "night" ? nightMode : dayMode,
          }}
          mapTypeId={mapType}
        >
          <DrawingManager
            ref={drawingManagerRef}
            key={drawingKey}
            options={{
              drawingMode: drawingMode === null ? null : "polygon",
              drawingControl: false,
              polygonOptions: {
                fillColor: "#ff0000",
                fillOpacity: 0.3,
                strokeWeight: 2,
                clickable: true,
                editable: true,
                draggable: false,
              },
            }}
            onPolygonComplete={handlePolygonComplete}
          />

          {territories.map((territory, index) => {
            const centroid = calculateCentroid(territory.path);
            return (
              <div className="border-2 ">
                <Polygon
                  key={index}
                  paths={territory.path}
                  options={{
                    fillColor: "#00FF00",
                    fillOpacity: 0.4,
                    strokeColor: "#000000",
                    strokeWeight: 2,
                  }}
                  onMouseOver={() => handleMouseOver(territory.name)} // Show the territory name on hover
                  onMouseOut={handleMouseOut} // Hide the territory name when mouse leaves
                />
                <Marker position={centroid}></Marker>
                {hoveredTerritory && (
                  <OverlayView
                    position={centroid}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "red",
                      }}
                    >
                      {territory.name}
                    </div>
                  </OverlayView>
                )}
              </div>
            );
          })}

          {visualizationType === "markers" ? (
            clustering ? (
              <MarkerClusterer>
                {(clusterer) =>
                  markerdata.map((data, index) => (
                    <Marker
                      key={index}
                      position={{ lat: data.lat, lng: data.lng }}
                      icon={{
                        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/edhrfEAAAAASUVORK5CYII=", // Transparent icon
                        scaledSize: new window.google.maps.Size(1, 1),
                      }}
                      label={{
                        text: "📍",
                        fontSize: `${markerSize}px`,
                        color: "#FF6347",
                        fontWeight: "bold",
                      }}
                      clusterer={clusterer}
                    />
                  ))
                }
              </MarkerClusterer>
            ) : (
              markerdata.map((data, index) => (
                <Marker
                  key={index}
                  position={{ lat: data.lat, lng: data.lng }}
                  icon={{
                    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/edhrfEAAAAASUVORK5CYII=", // Transparent icon
                    scaledSize: new window.google.maps.Size(1, 1),
                  }}
                  label={{
                    text: "📍",
                    fontSize: `${markerSize}px`,
                    color: "#FF6347",
                    fontWeight: "bold",
                  }}
                />
              ))
            )
          ) : null}

          {visualizationType === "heatmap" && (
            <HeatmapLayer
              ref={heatmapRef}
              key={key}
              data={markerdata.map(
                (data) => new window.google.maps.LatLng(data.lat, data.lng)
              )}
              onLoad={(heatmap) => (heatmapRef.current = heatmap)}
              onUnmount={() => {
                console.log("Heatmap unmounted");
                if (heatmapRef.current) {
                  heatmapRef.current.setMap(null);
                  heatmapRef.current = null;
                }
              }}
              // className={visualizationType === "markers" ? "hidden" : ""}
              options={{
                dissipating: 1,
                radius: 10, // Adjust as needed
                opacity: visualizationType === "heatmap" ? 0.6 : 0,
                zoom: 0,
              }}
            />
          )}
        </GoogleMap>
      </div>

      <button
        onClick={handleOpen}
        className="absolute right-5 top-5 z-20 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded "
      >
        Open modal
      </button>
      <Modal open={open} onClose={handleClose}>
        <div className="absolute right-5 top-5 flex items-center justify-center z-50 ">
          <div className="bg-white w-full max-w-md rounded-lg overflow-y-auto max-h-[90vh] scroll-smooth scrollbar-hide">
            {/* //header */}
            <div className="bg-teal-600 text-white flex justify-between items-center p-2">
              <h2 className="text-2xl font-bold">Map Settings</h2>
              <button
                onClick={handleClose}
                className="text-white text-3xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-2 space-y-8 bg-gray-50  overflow-y-auto scrollbar-hide">
              {/* Visualization Type */}
              <div className="space-y-4">
                <h3 className="text-xl text-teal-600 text-center font-medium">
                  Visualization Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <label className="bg-white rounded-lg border p-4 flex items-center justify-center gap-3 cursor-pointer">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        visualizationType === "heatmap"
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {visualizationType === "heatmap" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg">Heatmap</span>
                    <input
                      type="radio"
                      className="hidden"
                      checked={visualizationType === "heatmap"}
                      onChange={() => {
                        headMapToogle();
                      }}
                    />
                  </label>
                  <label className="bg-white rounded-lg border p-4 flex items-center justify-center gap-3 cursor-pointer">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        visualizationType === "markers"
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {visualizationType === "markers" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg">Markers</span>
                    <input
                      type="radio"
                      className="hidden"
                      checked={visualizationType === "markers"}
                      onChange={() => headMapToogle()}
                    />
                  </label>
                </div>
              </div>

              {/* Map Type */}
              <div className="space-y-4">
                <h3 className="text-xl text-teal-600 text-center font-medium">
                  Map Type
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="bg-white rounded-lg border p-4 flex items-center justify-start gap-3 cursor-pointer">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        mapType === "roadmap"
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {mapType === "roadmap" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="bg-gray-200 w-6 h-6 flex items-center justify-center mx-1">
                      <div className="w-4 h-4 bg-gray-600"></div>
                    </div>
                    <span className="text-lg">Roadmap</span>
                    <input
                      type="radio"
                      className="hidden"
                      checked={mapType === "roadmap"}
                      onChange={() => setMapType("roadmap")}
                    />
                  </label>
                  <label className="bg-white rounded-lg border p-4 flex items-center justify-start gap-3 cursor-pointer">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        mapType === "satellite"
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {mapType === "satellite" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-green-500 mx-1">🌳</div>
                    <span className="text-lg">Satellite</span>
                    <input
                      type="radio"
                      className="hidden"
                      checked={mapType === "satellite"}
                      onChange={() => setMapType("satellite")}
                    />
                  </label>
                  <label className="bg-white rounded-lg border p-4 flex items-center justify-start gap-3 cursor-pointer">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        mapType === "terrain"
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {mapType === "terrain" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-brown-500 mx-1">🏔️</div>
                    <span className="text-lg">Terrain</span>
                    <input
                      type="radio"
                      className="hidden"
                      checked={mapType === "terrain"}
                      onChange={() => setMapType("terrain")}
                    />
                  </label>
                  <label className="bg-white rounded-lg border p-4 flex items-center justify-start gap-3 cursor-pointer">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        mapType === "hybrid"
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {mapType === "hybrid" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-green-500 mx-1">🌳</div>
                    <span className="text-lg">Hybrid</span>
                    <input
                      type="radio"
                      className="hidden"
                      checked={mapType === "hybrid"}
                      onChange={() => setMapType("hybrid")}
                    />
                  </label>
                </div>
              </div>

              {/* Visualization Options */}
              <div className="space-y-6">
                <h3 className="text-xl text-teal-600 text-center font-medium">
                  Visualization Options
                </h3>
                <div className="bg-white rounded-lg border p-4 flex justify-between items-center">
                  <span className="text-lg font-medium">Enable Clustering</span>
                  <div
                    className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${
                      clustering
                        ? "bg-teal-500 justify-end"
                        : "bg-gray-300 justify-start"
                    }`}
                    onClick={() => setClustering(!clustering)}
                  >
                    <div className="bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Marker Size</span>
                    <span className="text-teal-600 font-medium">
                      x{markerSize / 25}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">Small</span>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={markerSize}
                      onChange={(e) => setMarkerSize(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none"
                    />
                    <span className="text-gray-500">Large</span>
                  </div>
                </div>
              </div>

              {/* Map Theme */}
              <div className="space-y-4">
                <h3 className="text-xl text-teal-600 text-center font-medium">
                  Map Theme
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`border-2 rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer ${
                      theme === "day" ? "border-teal-500" : "border-gray-200"
                    }`}
                  >
                    <div className="text-yellow-500 text-4xl">☀️</div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          theme === "day"
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {theme === "day" && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-lg">Day</span>
                    </div>
                    <input
                      type="radio"
                      className="hidden"
                      checked={theme === "day"}
                      onChange={() => setTheme("day")}
                    />
                  </label>
                  <label
                    className={`border-2 rounded-lg p-6 flex flex-col items-center justify-center gap-4 cursor-pointer bg-gray-900 text-white ${
                      theme === "night" ? "border-teal-500" : "border-gray-200"
                    }`}
                  >
                    <div className="text-blue-300 text-4xl">🌙</div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          theme === "night"
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {theme === "night" && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-lg">Night</span>
                    </div>
                    <input
                      type="radio"
                      className="hidden"
                      checked={theme === "night"}
                      onChange={() => setTheme("night")}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default App;

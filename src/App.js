import React, { useState, useEffect } from 'react';
import './App.css';
import Canvas from './components/Canvas';

function App() {
  const [mode, setMode] = useState('pi');
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(2);
  const [colorMode, setColorMode] = useState(0.09); // subtle color changes
  const [backgroundColor, setBackgroundColor] = useState(0); // subtle color changes
  const [backgroundBrightness, setBackgroundBrightness] = useState(100); // subtle color changes
  const [backgroundInvert, setBackgroundInvert] = useState(false); // subtle color changes
  const [colorChangeMode, setColorChangeMode] = useState('dynamic'); // or 'fixed'
  const [distance, setDistance] = useState(300); // Default distance
  const [pivotDistance, setPivotDistance] = useState(300); // Default pivot distance
  const [customEquation, setCustomEquation] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);
  const [backgroundColorSpeed, setBackgroundColorSpeed] = useState(10);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const [isBlendModeActive, setIsBlendModeActive] = useState(false);
  const [lineHue, setLineHue] = useState(0);
  const [animateHue, setAnimateHue] = useState(false);
  const [initialSeparation, setInitialSeparation] = useState(3); // 50 pixels initial separation
  const [activePreset, setActivePreset] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  const presets = [
    {
      id: 1, settings: {
        mode: 'pigr',
        running: true,
        speed: 99,
        colorMode: 0.09,
        backgroundBrightness: 52,
        backgroundInvert: false,
        colorChangeMode: 'dynamic',
        distance: 91,
        pivotDistance: 80,
        customEquation: '',
        isCustomMode: false,
        animateBackground: true,
        backgroundColor: 0,
        backgroundColorSpeed: 964,
        isRotating: true,
        rotationSpeed: -0.001,
        isBlendModeActive: true,
        lineHue: 0,
        animateHue: true,
        initialSeparation: 3
      }
    },
    {
      id: 2, settings: {
        mode: '3pi',
        running: true,
        speed: 902.3,
        colorMode: 0.9,
        backgroundBrightness: 36,
        backgroundInvert: false,
        colorChangeMode: 'dynamic',
        distance: 93,
        pivotDistance: 0,
        customEquation: '',
        isCustomMode: false,
        animateBackground: true,
        backgroundColor: 0,
        backgroundColorSpeed: 964,
        isRotating: true,
        rotationSpeed: -0.001,
        isBlendModeActive: true,
        lineHue: 0,
        animateHue: false,
        initialSeparation: 123
      }
    },
    {
      id: 3, settings: {
        mode: 'pi',
        speed: 9638,
        colorMode: 0.09,
        backgroundBrightness: 9,
        backgroundInvert: false,
        colorChangeMode: 'dynamic',
        distance: 1480,
        pivotDistance: 6860,
        customEquation: '',
        isCustomMode: false,
        animateBackground: true,
        backgroundColor: 0,
        backgroundColorSpeed: 1927,
        isRotating: true,
        rotationSpeed: -0.001,
        isBlendModeActive: true,
        lineHue: 0,
        animateHue: false,
        initialSeparation: 3
      }
    },
    {
      id: 4, settings: {
        mode: 'custom',
        running: true,
        speed: 9638,
        colorMode: 0.1,
        backgroundBrightness: 9,
        backgroundInvert: false,
        colorChangeMode: 'dynamic',
        distance: 936,
        pivotDistance: 27930,
        customEquation: '-396396',
        isCustomMode: true,
        animateBackground: true,
        backgroundColor: 0,
        backgroundColorSpeed: 1766,
        isRotating: true,
        rotationSpeed: 0.428,
        isBlendModeActive: true,
        lineHue: 0,
        animateHue: false,
        initialSeparation: 3
      }
    },
    {
      id: 5, settings: {
        mode: 'pigr',
        speed: 9630,
        colorMode: 0.1,
        backgroundBrightness: 11,
        backgroundInvert: false,
        colorChangeMode: 'dynamic',
        distance: 936,
        pivotDistance: 98290,
        customEquation: '',
        isCustomMode: false,
        animateBackground: true,
        backgroundColor: 0,
        backgroundColorSpeed: 1927,
        isRotating: true,
        rotationSpeed: -0.244,
        isBlendModeActive: true,
        lineHue: 0,
        animateHue: false,
        initialSeparation: 3
      }
    },
  ];

  const appStyle = {
    backgroundColor: `hsl(${backgroundColor}, 100%, ${backgroundBrightness}%)`,
  };

  function handleModeChange(e) {
    const selectedMode = e.target.value;
    setMode(selectedMode);
    setIsCustomMode(selectedMode === 'custom');
  }

  const applyPreset = (presetId) => {
    const selectedPreset = presets.find(p => p.id === presetId);
    if (selectedPreset) {
      const { settings } = selectedPreset;
      setMode(settings.mode);
      setRunning(true);
      setSpeed(settings.speed);
      setColorMode(settings.colorMode);
      setBackgroundColor(settings.backgroundColor);
      setBackgroundBrightness(settings.backgroundBrightness);
      setColorChangeMode(settings.colorChangeMode);
      setDistance(settings.distance);
      setPivotDistance(settings.pivotDistance);
      setCustomEquation(settings.customEquation);
      setIsCustomMode(settings.isCustomMode);
      setAnimateBackground(settings.animateBackground);
      setBackgroundColorSpeed(settings.backgroundColorSpeed);
      setIsRotating(settings.isRotating);
      setRotationSpeed(settings.rotationSpeed);
      setIsBlendModeActive(settings.isBlendModeActive);
      setLineHue(settings.lineHue);
      setAnimateHue(settings.animateHue);
      setInitialSeparation(settings.initialSeparation);
      setActivePreset(presetId);
    }
  };

  //menus
  const [showEquationMenu, setShowEquationMenu] = useState(false);
  const [showAnimationMenu, setShowAnimationMenu] = useState(false);
  const [showLineColorMenu, setShowLineColorMenu] = useState(false);
  const [showBackgroundColorMenu, setShowBackgroundColorMenu] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(prevState => !prevState);
  };

  if (backgroundInvert) {
    appStyle.filter = 'invert(100%)'; // Invert the colors if backgroundInvert is true
  }

  useEffect(() => {
    let intervalId;

    if (animateBackground) {
      intervalId = setInterval(() => {
        setBackgroundColor((prevColor) => (prevColor + (backgroundColorSpeed / 10000)) % 360);
      }, 3); // Adjust the interval and color change rate for smoothness
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [animateBackground, backgroundColorSpeed]);

  function closeAllMenu() {
    setShowEquationMenu(false);
    setShowAnimationMenu(false);
    setShowLineColorMenu(false);
    setShowBackgroundColorMenu(false);
  }

  function renderEquationMenu() {
    return (
      <div className='menu-options-content' style={{ display: showEquationMenu ? 'block' : 'none' }}>
        <select onChange={handleModeChange} value={mode}>
          <option value="goldenRatio">Golden Ratio</option>
          <option value="pi">π + 1</option>
          <option value="3pi">π * π</option>
          <option value="pigr">π * Golden Ratio</option>
          <option value="piE">π * E</option>
          <option value="EE">E * E</option>
          <option value="mandelbrot">mandelbrot</option>
          <option value="custom">Custom</option>
        </select>

        {isCustomMode && (
          <input
            type="text"
            defaultValue={"π"}
            value={customEquation}
            onChange={(e) => setCustomEquation(e.target.value)}
            placeholder="PI Radians + (e.g.,  Angle)"
          />
        )}


        <div className='menu-option-list'>
          Speed:&nbsp;
          <input
            type="text"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            placeholder="e.g., 0.5-9638"
          />
          <input
            type="range"
            min="0.5"
            max="9638"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
        </div>


        <div className='menu-option-list'>
          Distance:&nbsp;
          <input
            type="text"
            value={distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            placeholder="e.g., 100-500"
          />
          <input
            type="range"
            min="0"
            max="30000"
            step="10"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value, 10))}
          />
        </div>


        <div className='menu-option-list'>
          Pivot Distance:&nbsp;
          <input
            type="text"
            value={pivotDistance}
            onChange={(e) => setPivotDistance(parseFloat(e.target.value))}
            placeholder="e.g., 0-50000"
          />
          <input
            type="range"
            min="0"
            max="50000"
            step="10"
            value={pivotDistance}
            onChange={(e) => setPivotDistance(parseInt(e.target.value, 10))}
          />
        </div>

        <div className='menu-option-list'>
          <label>
            Initial Separation:
            <input
              type="range"
              min="-213"
              max="213"
              value={initialSeparation}
              onChange={(e) => setInitialSeparation(parseInt(e.target.value))}
            />
          </label>
        </div>
      </div>
    );
  }

  function renderAnimationMenu() {
    return (
      <div className='menu-options-content' style={{ display: showAnimationMenu ? 'block' : 'none' }}>
        <button onClick={() => setRunning(true)}>Start</button>
        <button onClick={() => setRunning(false)}>Stop</button>

        <div className='menu-option-list'>
          {/* <label>
            Rotate:&nbsp;
            <input
              type="checkbox"
              checked={isRotating}
              onChange={(e) => setIsRotating(e.target.checked)}
            />
          </label> */}

          {isRotating && (
            <>
              Rotation Speed:&nbsp;
              <input
                type="text"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                placeholder="e.g., -1 to 1"
              />
              <input
                type="range"
                min="-1"
                max="1"
                step="0.001"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  function renderColorMenu() {
    return (
      <div className='menu-options-content' style={{ display: showLineColorMenu ? 'block' : 'none' }}>
        <div className='menu-option-list'>
          <select onChange={(e) => setColorChangeMode(e.target.value)} value={colorChangeMode}>
            <option value="dynamic">Dynamic Color</option>
            <option value="fixed">Fixed Color</option>
          </select>
        </div>

        Line Color Hue:
        <input
          type="range"
          min="0"
          max="360"
          value={lineHue}
          onChange={(e) => setLineHue(parseInt(e.target.value, 10))}
        />

        <label>
          Animate Hue:
          <input
            type="checkbox"
            checked={animateHue}
            onChange={(e) => setAnimateHue(e.target.checked)}
          />
        </label>

        <div className='menu-option-list'>
          Dynamic Color Speed:&nbsp;
          <input
            type="text"
            value={colorMode}
            onChange={(e) => setColorMode(parseFloat(e.target.value))}
            placeholder="e.g., 0.1-5"
          />
          <input
            type="range"
            min="0.01"
            max="5"
            step="0.01"
            value={colorMode}
            onChange={(e) => setColorMode(parseFloat(e.target.value))}
          />

        </div>
        <div className='menu-option-list'>
          <label>
            Blend Mode (Difference):&nbsp;
            <input
              type="checkbox"
              checked={isBlendModeActive}
              onChange={() => setIsBlendModeActive(!isBlendModeActive)}
            />
          </label>
        </div>
      </div>
    );
  }

  function renderBackgroundColorMenu() {
    return (
      <div className='menu-options-content' style={{ display: showBackgroundColorMenu ? 'block' : 'none' }}>
        <div className='menu-option-list'>
          Background Color:&nbsp;
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(parseFloat(e.target.value))}
            placeholder="e.g., 0-360"
          />
          <input
            type="range"
            min="0"
            max="360"
            step="0.0001"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(parseFloat(e.target.value))}
          />
        </div>

        <div className='menu-option-list'>
          Background Brightness:&nbsp;
          <input
            type="text"
            value={backgroundBrightness}
            onChange={(e) => setBackgroundBrightness(parseFloat(e.target.value))}
            placeholder="e.g., 0-100"
          />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={backgroundBrightness}
            onChange={(e) => setBackgroundBrightness(parseFloat(e.target.value))}
          />
        </div>

        <div className='menu-option-list'>
          <label>
            Animate Background:&nbsp;
            <input
              type="checkbox"
              checked={animateBackground}
              onChange={(e) => setAnimateBackground(e.target.checked)}
            />
          </label>

          {animateBackground && (
            <>
              Color Loop Speed:&nbsp;
              <input
                type="text"
                value={backgroundColorSpeed}
                onChange={(e) => setBackgroundColorSpeed(parseFloat(e.target.value))}
                placeholder="e.g., 0-100000"
              />
              <input
                type="range"
                min="1"
                max="100000"
                className='range'
                value={backgroundColorSpeed}
                onChange={(e) => setBackgroundColorSpeed(parseInt(e.target.value, 10))}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App" style={appStyle}>
      <div className='menu-wrapper'>
        <div className='toggle-button-container'>
          <button onClick={toggleMenu}>
            {isMenuVisible ? '<<' : '>>'}
          </button>
        </div>

        <div className={`button-menu ${isMenuVisible ? '' : 'minimized'}`}>
          <div className="presets-container">
            {presets.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                style={preset.id === activePreset ? { backgroundColor: 'darkgreen' } : {}}
              >
                Preset {preset.id}
              </button>
            ))}
          </div>
          <div className='top-menu-option-list'>
            <label>
              Invert Background:&nbsp;
              <input
                type="checkbox"
                checked={backgroundInvert}
                onChange={(e) => setBackgroundInvert(e.target.checked)}
              />
            </label>
          </div>
          <button className='tabButton' onClick={() => setShowEquationMenu(!showEquationMenu)}>Equation</button>
          <div className='menu-option-container'>{renderEquationMenu()}</div>
          <br></br>

          <button className='tabButton' onClick={() => setShowAnimationMenu(!showAnimationMenu)}>Animation</button>
          <div className='menu-option-container'>{renderAnimationMenu()}</div>
          <br></br>

          <button className='tabButton' onClick={() => setShowLineColorMenu(!showLineColorMenu)}>Line Color</button>
          <div className='menu-option-container'>{renderColorMenu()}</div>
          <br></br>

          <button className='tabButton' onClick={() => setShowBackgroundColorMenu(!showBackgroundColorMenu)}>Background Color</button>
          <div className='menu-option-container'>{renderBackgroundColorMenu()}</div>
          <br></br>
        </div>
      </div>

      {/* Canvas Component */}
      <Canvas
        mode={mode}
        running={running}
        speed={speed}
        colormode={colorMode}
        colorChangeMode={colorChangeMode}
        distance={distance}
        pivotDistance={pivotDistance}
        customEquation={isCustomMode ? customEquation : null}
        isRotating={isRotating}
        rotationSpeed={rotationSpeed}
        isBlendModeActive={isBlendModeActive}
        lineHue={lineHue}
        animateHue={animateHue}
        initialSeparation={initialSeparation}
      />
    </div>
  );
}

export default App;
# React Mandala

A dynamic, interactive visualization project that creates mesmerizing, mathematically-inspired patterns through circular motion and customizable equations.

![React Mandala Demo](https://mceponis.com/5/) ![p5.js](https://img.shields.io/badge/p5.js-1.8.0-red) ![License](https://img.shields.io/badge/license-MIT-green)

## Overview

React Mandala combines the power of React and p5.js to generate beautiful, mathematically-inspired patterns based on circular motion, mathematical constants (like π and the golden ratio), and customizable equations. Users can manipulate various parameters to create unique visual effects resembling mandalas or spirograph-like patterns.

The project features a responsive canvas with interactive controls, preset configurations, zoom functionality, and touch support for mobile devices, allowing users to explore mathematical beauty through dynamic animations and color variations.

## ✨ Features

- **Interactive Canvas**: Animated patterns rendered with p5.js using two circles moving based on user-defined parameters
- **Mathematical Modes**: Predefined equations (π, golden ratio, Mandelbrot-inspired) and custom user-defined equations
- **Customizable Settings**:
  - Motion parameters: speed, distance, pivot distance, initial separation
  - Animation controls: start/stop, rotation, rotation speed
  - Color options: dynamic or fixed color modes, hue animation, blend mode (difference)
  - Background customization: color, brightness, animation, and inversion
- **Presets**: Five predefined configurations for quick pattern exploration
- **Randomization**: Generate random settings for unique visual outputs
- **Touch Support**: Pinch-to-zoom functionality for mobile devices
- **Responsive Design**: Adapts to different screen sizes with automatic canvas resizing

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm or yarn package manager

### Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ceponism/react-mandala.git
   cd react-mandala
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000/` in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

## 🎮 Usage

### Getting Started
1. Open the app in your browser
2. You'll see a canvas displaying animated patterns with a control menu on the left
3. Use the `<</>>` button to show/hide the control menu

### Control Menu Options

- **Presets**: Select from five preset configurations or randomize settings
- **Equation Menu**: Choose predefined modes (π, golden ratio, Mandelbrot) or enter custom equations
- **Animation Menu**: Start/stop animation and adjust rotation speed
- **Line Color Menu**: Toggle dynamic/fixed colors, adjust hue, enable blend modes
- **Background Color Menu**: Customize background color, brightness, and animation
- **Invert Background**: Toggle color inversion for different visual effects

### Interactivity

- **Mouse Wheel**: Zoom in/out on the canvas
- **Touch Gestures**: Pinch to zoom on mobile devices
- **Custom Equations**: Enter equations using `x`, `y`, `pi`, and standard operators (e.g., `pi * x + y`)

## 🛠️ Dependencies

- **React** (^18.2.0): User interface framework for building the interactive control menu and managing state.
- **p5** (^1.8.0): JavaScript library for rendering the interactive canvas and animating mandala-like patterns.
- **mathjs** (^13.2.0): Math library for parsing and evaluating custom mathematical equations, enabling complex expressions like `sin` and `cos` in custom mode.
- **react-scripts** (5.0.1): Development and build tools for running and bundling the React application.

## ⚙️ How It Works

### App.js
- Manages application state (mode, speed, color settings)
- Renders control menu and Canvas component
- Includes preset configurations and random pattern generation
- Handles background color animation with useEffect

### Canvas.js
- Uses p5.js to render animated patterns
- Two circles move based on user parameters with paths drawn on canvas
- Supports mathematical modes and custom equation parsing
- Handles zoom via mouse wheel and touch gestures
- Manages color changes and canvas scaling

### Custom Equations
Users can input custom equations using the format:
- `x`, `y` for variables
- `pi` for π constant
- Standard operators (`+`, `-`, `*`, `/`, `^`)
- Example: `pi * x + y`

## ⚠️ Limitations

- **Custom Equation Parsing**: Limited parsing capabilities; use simple expressions
- **Performance**: High speeds or large distances may impact performance on low-end devices
- **Mandelbrot Mode**: Simplified implementation, not a full Mandelbrot set
- **Touch Support**: Only pinch-to-zoom is supported (no panning)

## 🔮 Future Improvements

- [x] Enhance equation parsing with safer math library (e.g., mathjs)
- [x] Add panning support for touch and mouse interactions
- [ ] Implement more complex mathematical modes and fractal patterns
- [ ] Optimize performance for high-speed animations
- [ ] Add export functionality for saving patterns as images/videos

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

Please ensure your code follows the project's ESLint configuration and includes relevant tests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [p5.js](https://p5js.org/)
- Inspired by mathematical art and spirograph-like visualizations
- Thanks to the open-source community for the amazing tools and libraries

---

**Explore, experiment, and create stunning visual patterns with React Mandala!** 

For questions or feedback, please [open an issue](https://github.com/ceponism/react-mandala/issues) on GitHub.
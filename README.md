# Video Highlight Tool

A simple web application that allows users to upload a video and preview selected highlight clips.

## Features

- Upload and play local video files
- Load and display highlight segments (with randomized transcripts)
- Clickable highlight list to jump to specific timestamps
- "Highlight Reel" playback mode that plays selected clips in sequence
- Smooth transitions between clips using a fade-to-black effect
- Responsive layout for desktop and mobile

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- Yarn

### Installation

1. Clone the repository:

```bash
git https://github.com/zdd997106/video-highlight-tool.git
cd video-highlight-tool
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development server:

```bash
yarn dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Project Structure

```
src/
├── components/      // UI components
├── hooks/           // Custom hooks
├── pages/           // Main app views
├── service/         // API request functions (mocked for this project)
├── theme/           // Styling (MUI theme, global styles)
├── type/            // Shared TypeScript types
├── utils/           // Utility functions
└── main.tsx         // App entry point
eslint.config.js     // ESLint rules
index.html           // HTML template
```

## Development Notes

- Bootstrapped with [Vite](https://vitejs.dev/)
- Built with [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- Styled using [MUI](https://mui.com/)

## References

- Assignment definition: [Video Highlight Tool Requirements](https://gist.github.com/vickyliin/879d4454bff348641c9c45298c2063ef)

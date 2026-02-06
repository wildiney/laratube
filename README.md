# LaraTube

LaraTube is an application that allows kids and teenagers to watch a curated list of YouTube videos safely. It features a persistence system for favorites and hidden videos using the browser's `localStorage`.

## Features

- **Video Playback**: Curated list of videos.
- **Favorites**: Mark videos with a heart ❤️ to keep them at the top and protect them from accidental hiding.
- **Hide Videos**: Remove videos you don't want to see anymore (requires confirmation).
- **Persistence**: Your choices are saved in your browser.
- **Settings**: Clear all preferences and reset the app.

## Requirements

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (recommended)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/wildiney/LaraTube.git
   ```
2. Navigate to the project directory:
   ```sh
   cd LaraTube
   ```
3. Install dependencies:
   ```sh
   pnpm install
   ```

## Usage

1. Start the development server:
   ```sh
   pnpm run dev
   ```
2. Access the application at `http://localhost:5173`.

## Testing

This project uses [Vitest](https://vitest.dev/) for testing.

- **Run all tests**: `pnpm run test`
- **Watch mode**: `pnpm run test:watch`
- **Coverage report**: `pnpm run test:coverage`

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.


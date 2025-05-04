<!-- markdownlint-disable MD029 -->

# LaraTube

LaraTube is an application that lets users to display selected YouTube videos and either delete or keep the ones they like the most. It uses the browser's local database to keep track of user's choices.

## Features

- Video playback
- Like and dislike system

## Requirements

- NodeJS

## Installation

1. Clone the repository:

  ```sh
  git clone https://github.com/wildiney/LaraTube.git
  ```

2. Navigate to the project directory:

  ```sh
  cd LaraTube
  ```

3. Install the dependencies:

  ```sh
  npm install
  ```

4. Configure the `.env` file:

  ```sh
  cp .env.example .env
  ```

## Usage

1. Start the local server:

  ```sh
  npm start
  ```

2. Access the application at `http://localhost:3000`.

## Contribution

1. Fork the project
2. Create a new branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more details.

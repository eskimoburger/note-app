# Note App

This project is a simple note-taking application built with React. It allows users to create, edit, and delete notes. The notes are saved in the browser's local storage, so they persist even after the page is refreshed.

## Features

- **Create Notes**: Add new notes with a title, content, and optional image.
- **Edit Notes**: Modify existing notes.
- **Delete Notes**: Remove notes from the list.
- **Undo/Redo**: Undo and redo changes to notes.
- **Debounced Save**: Notes are saved to local storage with a debounce to prevent excessive writes.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/eskimoburger/note-app.git
    ```
2. Navigate to the project directory:
    ```sh
    cd note-app
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the development server:
    ```sh
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000`.

## Components

### `App.jsx`

The main component that manages the state of the notes and renders the UI.

### `NoteWidget.jsx`

A component that displays individual notes with options to edit or delete them.

## Custom Hooks

### `useDebounceValue`

A custom hook that returns a debounced value after a specified delay.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Acknowledgements

- [React](https://reactjs.org/)
- [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

# sc-react-express

JS React / Express app with nested files for specific actions. /server/index.js file in the root /server path interacts with the /src frontend. All nested folders in /server are separate files to perform specific actions.

## Project Structure

```
/
├── src/              # React frontend
├── server/           # Express backend
│   ├── index.js      # Main Express server that interacts with src/
│   ├── johnson.elec.issues/
│   │    └── ...      # Express scripts for SC customer operations
│   └── ...           # Other customer scripts
├── package.json      # Project config (root)
└── ...
```

- **`/server/index.js`**: Entry point for the Express backend. Handles connections and routes requests to customer-specific scripts.
- **`/src/`**: The React application frontend.
- **`/server/[customer-folder]/`**: Each folder here (e.g., `/server/johnson.elec.issues`) contains Express scripts and routes for specific SC customer actions.

## Getting Started

Follow these steps to set up and run the project locally:

### 1. Install Dependencies

Install the root dependencies:

```bash
npm install
```

Then install backend dependencies:

```bash
cd server
npm install
```

### 2. Start the Backend Server

From any folder's root path in the `/server` path directory, run:

```bash
node index.js
```

This starts the desired Express server defined each folders `index.js`.

### 3. Start the Frontend (React)

Return to the root directory and run:

```bash
npm start
```

This starts the React development server.

## Development Notes

- The index.js file in the root /server path interacts with the /src frontend. All nested folders in /server are separate files to perform specific actions. 
- You can add new customer scripts by creating new folders and route handlers inside `/server`.

## Contributing

Pull requests and issues are welcome! Please open an issue or PR describing the change.

## License

This project is licensed under the MIT License.

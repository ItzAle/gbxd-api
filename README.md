# GBXD API

Welcome to the GBXD API project. This project allows users to add, view, and query games in a Firebase Firestore database. It also includes an interface for administrators and an API for interacting with the database.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
  - [Firebase Configuration](#firebase-configuration)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
- [CORS Configuration](#cors-configuration)
- [Contributing](#contributing)
- [License](#license)

## Description

The GBXD API project enables users to register games, view game details, and get a list of all games. Users can interact with the API to add and query games.

## Installation

To set up and run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/itzale/gbxd-api.git
   cd gbxd-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Firebase environment variables. Create a `.env.local` file in the root of the project with the following content:

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Usage

### Firebase Configuration

1. Create a project in Firebase Console.
2. Add a new web app to your Firebase project.
3. Copy the Firebase configuration credentials and paste them into the `.env.local` file.

### Project Structure

- `lib/firebase.js`: Firebase configuration and Firebase instances export.
- `app/add-game/page.js`: Interface for adding a game.
- `app/games/page.js`: Page for displaying all games.
- `app/profile/[uid]/page.js`: Page for displaying games added by a specific user.

### API Endpoints

- **Add a Game** (`POST /api/add-game`)

  - **Description:** Adds a new game to the Firestore collection.
  - **Request Body:**
    ```json
    {
      "name": "Game Name",
      "releaseDate": "Release Date",
      "description": "Game Description",
      "publisher": "Publisher",
      "developer": "Developer",
      "platforms": ["Platform1", "Platform2"],
      "genres": ["Genre1", "Genre2"],
      "coverImageUrl": "Cover Image URL"
    }
    ```

- **Get All Games** (`GET /api/games`)

  - **Description:** Retrieves a list of all games.
  - **Response:**
    ```json
    [
      {
        "id": "document_id",
        "name": "Game Name",
        "releaseDate": "Release Date",
        "description": "Game Description",
        "publisher": "Publisher",
        "developer": "Developer",
        "platforms": ["Platform1", "Platform2"],
        "genres": ["Genre1", "Genre2"],
        "coverImageUrl": "Cover Image URL"
      }
    ]
    ```

- **Get a Game by Name** (`GET /api/game/[name]`)

  - **Description:** Retrieves the details of a game by its name.
  - **Response:**
    ```json
    {
      "id": "document_id",
      "name": "Game Name",
      "releaseDate": "Release Date",
      "description": "Game Description",
      "publisher": "Publisher",
      "developer": "Developer",
      "platforms": ["Platform1", "Platform2"],
      "genres": ["Genre1", "Genre2"],
      "coverImageUrl": "Cover Image URL"
    }
    ```

## CORS Configuration

When deploying your application (e.g., on Vercel), CORS issues may arise if the frontend and backend are hosted on different domains. For handling CORS:

1. **Frontend:** Make sure the frontend correctly points to the deployed API endpoint.
2. **Backend:** Ensure that any server-side configurations (like those on Vercel) are properly set up to handle CORS. Vercel handles CORS automatically for Next.js APIs, but if you encounter issues, you might need to review your deployment settings.

## Contributing

Feel free to contribute by opening issues or submitting pull requests. Please ensure your code follows the project's style and guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

Thank you for checking out GBXD API! If you have any questions or need further assistance, please open an issue or contact the project maintainers.

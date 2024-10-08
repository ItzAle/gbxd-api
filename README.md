# GBXD API

Welcome to the GBXD API project. This project allows users to add, view, and query games in a DynamoDB database. It also includes an interface for administrators and an API for interacting with the database.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
  - [AWS Configuration](#aws-configuration)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
- [Admin Features](#admin-features)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Description

The GBXD API project enables users to register games, view game details, and get a list of all games. It provides a robust API for game data management and an admin interface for data manipulation.

## Installation

To set up and run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/gbxd-api.git
   cd gbxd-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure AWS environment variables. Create a `.env.local` file in the root of the project with the following content:

   ```
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
   NEXT_PUBLIC_ADMIN_PIN=your_admin_pin
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### AWS Configuration

1. Create a DynamoDB table named "games" in your AWS account.
2. Ensure your AWS credentials have the necessary permissions to read and write to this table.

### Project Structure

- `app/`: Contains the Next.js application files.
- `lib/`: Includes utility functions and configurations.
- `components/`: Reusable React components.
- `api/`: API route handlers.

### API Endpoints

- **Add a Game** (`POST /api/add-game`)
- **Get All Games** (`GET /api/games`)
- **Get a Game by ID** (`GET /api/game/[id]`)
- **Edit a Game** (`PUT /api/edit-game/[id]`)
- **Get Upcoming Games** (`GET /api/games/upcoming`)

## Security

- Admin access is protected by email verification and a backup PIN system.
- API routes use AWS credentials for database operations.
- Sensitive information is stored in environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

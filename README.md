# Books app

## About this project

This is a small app made using Express.js and MongoDB for the course "Software Architecture" of Universidad de los Andes.

Developed by Group 11:
- Gabriel Bergoeing
- Gianfranco Bobadilla
- Vicente Cuevas
- Luciano Fagioli

## Requirements

1. Node.js
1. Npm
1. MongoDB
1. Docker (optional)

## Running instructions

### Docker Profiles

App + DB:
- `docker-compose up --build`

App + DB + Cache
- `docker-compose --profile cache up --build`

App + DB + Search Engine:
- `docker-compose --profile search up --build`

App + DB + Reverse Proxy
- `docker-compose --profile proxy up --build`

All Together
- `docker compose --profile cache --profile search --profile proxy up --build`

Otherwise, you have to ensure to have [MongoDB running](#mongodb-setup) and follow [Project setup instructions](#project-setup-all-platforms)

### MongoDB setup

#### Ubuntu
To install MongoDB on Ubuntu:
1. Add the MongoDB repository and key (see official docs for your Ubuntu version).
2. Run:
  ```bash
  sudo apt update
  sudo apt install -y mongodb-org
  sudo systemctl start mongod
  sudo systemctl enable mongod
  sudo systemctl status mongod
  ```

#### Windows
1. Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
2. Run the installer and follow the instructions.
3. Start MongoDB as a Windows service (default) or run `mongod` from the command line.
4. Make sure MongoDB is running on `localhost:27017`.

### Project setup (all platforms)
1. Clone the repository:
  ```bash
  git clone https://github.com/lbfagioli/books-app-express.git
  cd books-app-express
  ```
2. Install dependencies:
  ```bash
  npm install
  ```
3. Seed the database with sample data:
  ```bash
  node seed.js
  ```
4. Start the server:
  ```bash
  node server.js
  ```
5. Open your browser and go to [http://localhost:3000](http://localhost:3000)

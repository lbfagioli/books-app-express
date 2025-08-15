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

## Running instructions

In order to run this project, run the following commands in your terminal

If mongoDB isn't installed:
- `sudo apt update`
- `sudo apt install -y mongodb-org`
- `sudo systemctl start mongod`
- `sudo systemctl enable mongod`
- `sudo systemctl status mongod`


1. `git clone https://github.com/lbfagioli/books-app-express.git`
2. `cd books-app-express`
3. `npm install`
4. `node seed.js`
5. `node server`

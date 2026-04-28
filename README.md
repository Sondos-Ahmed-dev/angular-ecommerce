<!-- # App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page. -->

# Angular E-Commerce Store
A fully functional e-commerce web application built with Angular 17 and JSON Server, featuring product listing, cart management, and full CRUD operations.

## Features

 Browse products with categories filter
 View detailed product information
 Add / remove items from cart
 Add new products
 Edit & delete existing products
 Fully responsive design with Bootstrap 5
 Toast notifications for user actions
 Custom 404 Not Found page


## Tech Stack
Technology  

Angular  

TypeScript 

Bootstrap  

Font Awesome  

JSON Server

RxJS       


## Getting Started
Prerequisites
Make sure you have the following installed:

Node.js (v18 or higher)
Angular CLI

npm install -g @angular/cli
Installation

Clone the repository

git clone https://github.com/Sondos-Ahmed-dev/angular-ecommerce.git

cd angular-ecommerce

## Install dependencies

npm install

 Running the App

 You need to run two terminals at the same time — one for the backend and one for the frontend.

Terminal 1 — Start JSON Server (Backend on port 3000):
npx json-server --watch db.json --port 3000

Terminal 2 — Start Angular (Frontend on port 4200):
npx ng serve
Then open your browser and navigate to:
http://localhost:4200

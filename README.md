# Product Management App

## Overview
This application helps manage products, track inventory across multiple locations, and generate statistics. It also supports user authentication and secure data storage.

## Features
- **Product Management**: Add, update, and delete products.
- **Stock Tracking**: Monitor stock levels at different warehouse locations.
- **Barcode Scanning**: Scan products using barcode technology.
- **User Authentication**: Secure login with password visibility toggle.
- **Secure Storage**: Store user data securely using SecureStore.
- **Statistics Dashboard**: View product stock distribution and total stock value.
- **PDF Report Generation**: Export product reports as PDFs using Expo Print.
- **Navigation & UI Enhancements**: Improved navigation with icons and active filters.

## Project Structer
└─ .
   ├─ .env
   ├─ .expo
   │  ├─ devices.json
   │  ├─ README.md
   │  ├─ types
   │  │  └─ router.d.ts
   │  └─ web
   │     └─ cache
   │        └─ production
   │           └─ images
   ├─ app
   │  ├─ (tabs)
   │  └─ __tests__
   ├─ app.json
   ├─ assets
   │  ├─ fonts
   │  └─ images
   │    
   ├─ components
   │  └─ __tests__
   │     ├─ ThemedText-test.tsx
   │     └─ __snapshots__
   ├─ config
   ├─ constants
   ├─ db.json
   ├─ expo-env.d.ts
   ├─ global.css
   ├─ helpers
   ├─ hooks
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.js
   ├─ README.md
   ├─ scripts
   ├─ services
   ├─ tailwind.config.js
   └─ tsconfig.json

## Installation

### Prerequisites
- **Node.js** (latest LTS version recommended)
- **Expo CLI** (for React Native development)
- **Android Studio/Xcode** (for testing on emulators)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/product-management-app.git
   cd product-management-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the application:
   ```sh
   expo start
   ```

## Configuration
### API Endpoint Configuration
If your API endpoint changes frequently, consider using a **local DNS setup** or storing the base URL in an environment variable.

**Example:** Modify `config.js`
```js
export const API_BASE_URL = "http://your-local-api:5000";
```

### Secure User Data Storage
The app uses `expo-secure-store` to securely store user credentials.


## Unit Testing
Unit tests are implemented for core functionalities like onboarding and product services.

Run tests with:
```sh
npm test
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes following commit guidelines
4. Push changes and open a Pull Request

## License
This project is licensed under the MIT License.


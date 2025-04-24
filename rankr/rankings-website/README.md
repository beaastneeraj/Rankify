# Rankings Website

This project is a web application that displays rankings based on CSV data for engineering disciplines. Users can dynamically adjust the weightage of various parameters to see updated rankings.

## Project Structure

- **public/**: Contains static assets such as images.
  - **logo.jpg**: Logo for the website.
  - **carousel/**: Contains images used in the carousel component.
  
- **src/**: Contains the source code for the application.
  - **app/**: Main application components and logic.
    - **components/**: React components for the application.
      - **RankingTable.tsx**: Displays rankings in a tabular format.
      - **ParameterForm.tsx**: Allows users to adjust parameter weightage.
      - **Layout.tsx**: Wrapper for the main application layout.
    - **lib/**: Utility functions for the application.
      - **csvParser.ts**: Parses CSV files into a usable format.
      - **rankingCalculator.ts**: Calculates rankings based on user-defined weights.
    - **models/**: TypeScript interfaces for data structures.
      - **RankingModel.ts**: Defines the structure of ranking data.
  - **middleware.js**: Middleware functions for handling requests.
  - **pages/**: Contains the pages of the application.
    - **index.tsx**: Main entry point for the website.
    - **api/**: API routes for fetching rankings data.
      - **rankings.ts**: Handles requests for rankings data.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd rankings-website
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add any necessary environment variables.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- Users can view the rankings displayed in a table format.
- The `ParameterForm` component allows users to input and adjust the weightage of different parameters.
- Rankings will update dynamically based on the user-defined weights.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.
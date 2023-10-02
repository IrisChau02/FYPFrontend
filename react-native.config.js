module.exports = {
  dependencies: {
    // other dependencies...
  },
  // Add your API base URL here
  // Replace `http://localhost:8081` with your actual backend URL
  // This assumes your backend is running on the same machine as the React Native packager
  // If not, replace `localhost` with the appropriate IP address or hostname
  // In production, make sure to use the actual production backend URL
  // instead of the development server URL
  assets: ['./assets/fonts/'],
  // ...
  commands: [
    {
      name: 'dev',
      description: 'Start Metro bundler and the app',
      // Add the `--reset-cache` flag if needed
      // You can also add other flags or modify the command as necessary
      func: async (_argv) => {
        process.env.API_BASE_URL = 'http://localhost:8081';
        require('react-native/cli').run();
      },
    },
  ],
};
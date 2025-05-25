# Project Architecture

This document outlines the architecture of the `youtube-summary-react` project.

## 1. Overall Project Architecture

The project is a modern frontend application built using **React** (with **Vite** as the build tool). It employs a feature-driven structure to organize its codebase.

Key technologies and libraries include:

*   **React**: For building the user interface.
*   **Vite**: A fast frontend build tool and development server.
*   **Redux Toolkit**: For global application state management.
*   **React Router DOM**: For client-side navigation and routing.
*   **Tailwind CSS**: A utility-first CSS framework for styling.
*   **Axios**: A promise-based HTTP client for making API requests.
*   **React Query**: For managing server state, including data fetching, caching, and synchronization.
*   **ESLint**: For code linting to maintain code quality.
*   **`idb`**: For interacting with IndexedDB, likely for advanced client-side storage.
*   **`lucide-react`**: For scalable vector icons.
*   **`react-player` / `react-youtube`**: For embedding and controlling video playback.

### Project Structure

The `src` directory is organized as follows:

*   **`src/application`**: Contains application-wide setup and global state management logic.
    *   `store/rootStore.js`: Configures the main Redux store, combining reducers from different features.
*   **`src/core`**: Provides core utilities, services, and configurations shared across the application.
    *   `api/client.js`: Sets up the Axios HTTP client, including interceptors for API requests (e.g., adding authentication tokens).
    *   `utils/`: Contains various helper functions and constants.
*   **`src/features`**: This directory houses the different functional modules (features) of the application. Each feature is typically self-contained and may include its own:
    *   `application`: Feature-specific application logic, such as Redux reducers/actions or React Query hooks.
    *   `domain`: Business logic, models, and entities specific to the feature.
    *   `infrastructure`: Adapters for interacting with external systems, like API services.
    *   `presentation`: React components, pages, and UI-related logic for the feature.
    The current main feature is `summary`.
*   **`src/main.jsx`**: The entry point of the React application. It initializes the Redux store provider and renders the main `App` component.
*   **`src/App.jsx`**: Defines the top-level application component, including the main routing structure using `react-router-dom`.

## 2. Frontend Routing

Client-side routing is managed by **`react-router-dom`**. The main routing configuration is located in `src/App.jsx`.

The application defines the following routes:

*   **`/`**: This path renders the `HomePage` component, located at `src/features/summary/presentation/pages/HomePage.jsx`. It serves as the main landing page of the application.
*   **`/summary/:videoId`**: This path renders the `DetailPage` component, located at `src/features/summary/presentation/pages/DetailPage.jsx`. The `:videoId` part is a URL parameter, indicating that this route expects a video identifier to display specific summary details for that video.

## 3. State Management

The project employs a combination of **Redux Toolkit** for global state and **React Query** for server state.

### Global State (Redux Toolkit)

*   **Redux Toolkit** is used for managing global application state that needs to be shared across different parts of the application.
*   The main Redux store is configured in `src/application/store/rootStore.js`.
*   The store is set up using `configureStore` from Redux Toolkit, which simplifies store setup and includes useful defaults like Redux Thunk for asynchronous logic and Redux DevTools Extension support.
*   Feature-specific reducers are combined in the root reducer. For example, the `summaryFeatureReducer` from `src/features/summary/application/store/index.js` is integrated into the main store under the `summaryFeature` key. This modular approach keeps state logic organized by feature.

### Server State (React Query)

*   **React Query** (`@tanstack/react-query`) is included in the project's dependencies, indicating its use for managing server state.
*   React Query handles data fetching, caching, synchronization, and updates of server data, simplifying tasks like loading states, error handling, and optimistic updates.
*   While the core setup files (`client.js`, `rootStore.js`) don't directly show React Query's QueryClientProvider (which is typically near the application root), its presence in `package.json` and the nature of the application (fetching YouTube summaries) strongly suggest its use within feature components or custom hooks for API interactions. It complements Redux by handling the complexities of asynchronous server state, allowing Redux to focus on global client state.

## 4. API Communication

API communication is primarily handled via the **Axios** HTTP client.

### Axios Client Setup

*   A pre-configured Axios instance is set up in `src/core/api/client.js`.
*   This client has default headers, including `'Content-Type': 'application/json'`.

### Request Interceptor for Authentication

*   The Axios client uses an interceptor (`client.interceptors.request.use`) to modify requests before they are sent.
*   This interceptor checks for an `accessToken` in `localStorage`. If a token exists, it adds an `Authorization` header to the request with the Bearer token (e.g., `Authorization: Bearer <token>`). This mechanism is used for authenticating API requests.

### Vite Proxy for Development

*   The Vite configuration file (`vite.config.js`) sets up a proxy for API requests during development.
*   Requests made from the frontend to paths starting with `/api/summary` are proxied to a backend server. The target URL for this proxy is defined by the `VITE_PROXY_TARGET` environment variable.
*   The `rewrite` option in the proxy configuration (`(path) => path.replace(/^\/api\/summary/, '/summary')`) modifies the request path before forwarding it to the backend, removing the `/api` prefix. For example, a frontend request to `/api/summary/some-endpoint` would be forwarded to `[VITE_PROXY_TARGET]/summary/some-endpoint`.
    This setup is useful for avoiding CORS issues during development and for abstracting the actual backend URL.

## 5. Other Key Aspects

### Client-Side Storage (IndexedDB)

*   The project includes the **`idb`** library, a small wrapper around IndexedDB.
*   This suggests the application might use IndexedDB for more complex client-side storage needs, such as:
    *   Caching data that doesn't fit well in `localStorage`.
    *   Storing user preferences or application state for offline use.
    *   Managing large datasets on the client side.
    The specific use cases would be found within the feature implementations that utilize this library.

### Video Playback

*   The inclusion of **`react-player`** and **`react-youtube`** libraries indicates that video playback is a core feature of the application.
*   `react-youtube` provides a React component specifically for embedding YouTube videos, offering fine-grained control over the YouTube IFrame Player API.
*   `react-player` is a more versatile component that can play a variety of URLs, including file paths, YouTube, Facebook, Twitch, SoundCloud, Streamable, Vimeo, Wistia, Mixcloud, DailyMotion and Kaltura.
    Given the project name (`youtube-summary-react`), these are likely used in the `summary` feature to display and interact with YouTube videos.

### Styling and UI

*   **Tailwind CSS** is used for styling, promoting a utility-first approach to build custom designs without writing traditional CSS. Configuration for Tailwind is in `tailwind.config.js` and PostCSS in `postcss.config.js`.
*   **Lucide Icons (`lucide-react`)** are used for incorporating clean and consistent icons throughout the application.

### Code Quality

*   **ESLint** is configured for static code analysis to enforce code style and catch potential errors early. The configuration can be found in `eslint.config.js`.

# Solution Overview

This document outlines the approach taken to address the objectives in the take-home assessment, including refactoring, optimizations, and new features. Below, I detail the changes made to the backend and frontend, along with trade-offs considered.

## Backend (Node.js)

### 1. Refactor Blocking I/O

- **Change**: Replaced `fs.readFileSync` and `fs.writeFileSync` in `src/routes/items.js` with `fs.promises` for non-blocking I/O.
- **Reason**: Synchronous file operations block the event loop, reducing scalability. Async operations improve performance under load.
- **Implementation**: Created `readData` and `writeData` utilities using `fs.promises.readFile` and `fs.promises.writeFile`. Updated all routes to use these async functions.
- **Trade-offs**:
  - Async operations add complexity (error handling, async/await syntax).
  - Scales better for larger files or high-concurrency scenarios.

### 2. Performance

- **Change**: Implemented caching for `GET /api/stats` in `src/routes/stats.js` and used `fs.watch` to invalidate the cache on `items.json` changes.
- **Reason**: Recalculating stats on every request is CPU-intensive. Caching reduces redundant computations.
- **Implementation**: Added a `statsCache` variable, populated on first request, and cleared when `items.json` changes. Reused `mean` utility from `utils/stats.js`.
- **Trade-offs**:
  - **Pros**: Significant performance boost for frequent stats requests.
  - **Cons**: `fs.watch` is not recursive and may miss changes in some environments. A library like `chokidar` could be used in production.

### 3. Testing

- **Change**: Added Jest unit tests for `items.js` (`__tests__/items.test.js`) and `stats.js` (`__tests__/stats.test.js`).
- **Reason**: Tests ensure route reliability for happy paths and error cases.
- **Implementation**: Used `supertest` to test endpoints, mocking file I/O to preserve `items.json`. Tested pagination, search, caching, and error handling.
- **Trade-offs**:
  - **Pros**: Comprehensive coverage improves code confidence.
  - **Cons**: File-based mocking adds complexity. A database would simplify testing.

### 4. Middleware Enhancement

- **Change**: Improved `logger.js` to include timestamps, request duration, and status codes. Fixed `errorHandler.js` to properly handle errors as middleware and removed risky `getCookie` function.
- **Reason**: Robust logging aids debugging, and proper error handling improves API reliability.
- **Implementation**: Added event listener in `logger.js` for response completion. Rewrote `errorHandler.js` to return JSON errors with stack traces in development.
- **Trade-offs**:
  - **Pros**: Enhanced debugging and user-friendly error responses.
  - **Cons**: Increased logging may impact performance for high-traffic APIs; could be mitigated with a logging library like `winston`.

## Frontend (React)

### 1. Memory Leak

- **Change**: Fixed memory leak in `Items.js` and `ItemDetail.js` using `isMounted` flag in `useEffect` cleanup.
- **Reason**: Prevents `setState` calls after component unmount, avoiding React warnings.
- **Implementation**: Added cleanup logic to prevent state updates post-unmount.
- **Trade-offs**: Simple solution; for complex apps, `axios` with cancellation tokens could be used.

### 2. Pagination & Search

- **Change**: Implemented server-side pagination and search in `Items.js` and `DataContext.js`.
- **Reason**: Reduces client-side load and improves UX for large datasets.
- **Implementation**: Backend supports `page`, `pageSize`, and `q` parameters. Frontend includes search input and pagination controls.
- **Trade-offs**:
  - **Pros**: Scalable and efficient data handling.
  - **Cons**: Slightly increases server load; a database would optimize filtering.

### 3. Performance

- **Change**: Integrated `react-window` in `Items.js` for list virtualization.
- **Reason**: Improves rendering performance for large lists.
- **Implementation**: Used `FixedSizeList` with a 360px height for card-based items.
- **Trade-offs**: Fixed height simplifies implementation; variable heights would require `VariableSizeList`.

### 4. UI/UX Polish

- **Change**: Redesigned UI with Tailwind CSS, added card-based layouts, animations, and a modern navbar. Enhanced `ItemDetail.js` for item details.
- **Reason**: Improves aesthetics, professionalism, and accessibility.
- **Implementation**: Used Tailwind CSS for responsive design, added `react-icons` for visual elements, and included skeleton states and ARIA labels.
- **Trade-offs**:
  - **Pros**: Modern, user-friendly interface with good accessibility.
  - **Cons**: Tailwind bundle size increased; PurgeCSS could optimize.

### 5. Testing

- **Change**: Added Jest tests for `Items.js`, `ItemDetail.js`, `Cart.js` and `DataContext.js`.
- **Reason**: Ensures component reliability and error handling.
- **Implementation**: Tested rendering, search, pagination, loading, and error states using mocked `fetch`.
- **Trade-offs**:
  - **Pros**: Improves confidence in frontend behavior.
  - **Cons**: Mocking `fetch` adds complexity; integration tests could complement unit tests.

### 6. Cart System

- **Change**: Implemented a shopping cart system with a dedicated `Cart.js` page, integrated into `DataContext.js`, `Items.js`, and `ItemDetail.js`.
- **Reason**: Enables users to add items to a cart, view cart contents, adjust quantities, and remove items, enhancing the e-commerce functionality.
- **Implementation**: Added `cart` state and functions (`addToCart`, `removeFromCart`, `updateCartQuantity`) in `DataContext.js`. Created `Cart.js` to display cart items with quantity controls and total price. Integrated "Add to Cart" buttons in `Items.js` and `ItemDetail.js`, and updated `App.js` to show a dynamic cart badge.
- **Trade-offs**:
  - **Pros**: Provides a seamless user experience for managing purchases; consistent with the modern UI design using Tailwind classes.
  - **Cons**: Cart state is in-memory and resets on page refresh; persisting to `localStorage` or a backend API could be added for production.

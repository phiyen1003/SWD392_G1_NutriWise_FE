import React, { Suspense, lazy } from "react";

const AppRoutes = lazy(() => import("./routes/AppRoutes"));

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRoutes />
    </Suspense>
  );
};

export default App;

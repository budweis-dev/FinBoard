// Definice React hooks
const { useState, useEffect, useRef } = React;

// Renderování aplikace s React Query
ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    document.getElementById('root')
);
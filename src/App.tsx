import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateFlashcards from "./pages/CreateFlashcards";
import ThemeToggle from "./components/ThemeToggle";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
    return (
        <>
            <ThemeToggle />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/create" element={<CreateFlashcards />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
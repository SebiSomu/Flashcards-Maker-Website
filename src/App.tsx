import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateFlashcards from "./pages/CreateFlashcards";
import ThemeToggle from "./components/ThemeToggle";

const App = () => {
    return (
        <>
            <ThemeToggle />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateFlashcards />} />
            </Routes>
        </>
    );
};

export default App;
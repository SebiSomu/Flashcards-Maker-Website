import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateFlashcards from "./pages/CreateFlashcards";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateFlashcards />} />
        </Routes>
    );
};

export default App;
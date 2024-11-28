import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Quiz from './components/Quiz/Quiz';
import CategorySelect from './components/CategorySelect/CategorySelect';
import ScoreBoard from './components/ScoreBoard/ScoreBoard';
import './App.css';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <Router>
      <div className="app-container">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/quiz">Quiz</Link></li>
            <li><Link to="/scores">Scores</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route 
            path="/" 
            element={<CategorySelect onSelect={handleCategorySelect} />} 
          />
          <Route 
            path="/quiz" 
            element={<Quiz category={selectedCategory} />} 
          />
          <Route 
            path="/scores" 
            element={<ScoreBoard />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
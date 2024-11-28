import { useState } from 'react';
import Quiz from './components/Quiz/Quiz';
import CategorySelect from './components/CategorySelect/CategorySelect';

const App = () => {
  const [category, setCategory] = useState('');

  return (
    <div className="app">
      <CategorySelect onCategoryChange={setCategory} />
      <Quiz category={category} />
    </div>
  );
};

export default App;
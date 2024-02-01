import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Search from './components/Search';
import Register from './components/Register';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
    
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Navbar from './components/navbar';
import Newsletter from './components/newsletter'
import Footer from './components/footer';
import Home from './components/pages/Home';
import CategoryPage from './components/pages/CategoryPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className='bg-gray-50 min-h-screen flex flex-col'>
          <Header />
          <Navbar />
          
          <div className="flex-grow">
              <Routes>
                  <Route path="/" element={<Home />} />
                  
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
              </Routes>
          </div>
          <Newsletter />
          <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

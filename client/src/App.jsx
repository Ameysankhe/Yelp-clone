import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import UpdatePage from './pages/UpdatePage';
import { RestaurantsContextProvider } from './context/RestaurantsContext';

const App = () => {
    return (
       <RestaurantsContextProvider>
         <div className='container'>
            <BrowserRouter>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path="/restaurants/:id" element={<RestaurantDetailsPage />} />
                        <Route path="/restaurants/:id/update" element={<UpdatePage />} />
                    </Routes>
            </BrowserRouter>
        </div>
       </RestaurantsContextProvider>
    )
}

export default App;
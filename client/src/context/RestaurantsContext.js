import React, {useState, createContext} from 'react';

export const RestaurantsContext = createContext();

// Here we are creating a context provider component so that each element in our site will get information about the state from a single source and we do not need to manage each state

export const RestaurantsContextProvider = props => {
    //Storing the list of restaurants
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const addRestaurants = (restaurant) => {
        setRestaurants([...restaurants, restaurant])
    }

    return (
        //value here is used to pass the info of restaurants to the component
        <RestaurantsContext.Provider value={{restaurants, setRestaurants, addRestaurants, selectedRestaurant, setSelectedRestaurant}}>
            {props.children}
        </RestaurantsContext.Provider>
    )
}
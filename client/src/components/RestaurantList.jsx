import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import RestaurantFinder from '../api/RestaurantFinder'
import { RestaurantsContext } from '../context/RestaurantsContext'
import StarRating from './StarRating';

const RestaurantList = (props) => {

    //useContext hook to basically set the data to our states coming from the api
    const { restaurants, setRestaurants } = useContext(RestaurantsContext)
    //Fetching the data from the backend server
    //Empty array is used to run the hook only when the component is rendered for the first time, if we do not do that it will use the hook each time it renders the component
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                //RestaurantFinder is basically the axios instance 
                const response = await RestaurantFinder.get("/");
                // console.log(response)
                setRestaurants(response.data.data.restaurants);
            } catch (err) {

            }
        }
        fetchData();

    }, [])

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try{
            const response = await RestaurantFinder.delete(`/${id}`);
            // console.log(response);
            setRestaurants(restaurants.filter(restaurant => {
                return restaurant.id !== id
            }))
        }catch(err){
            console.log(err);
        }
    }

    const handleUpdate = (e, id) => {
        e.stopPropagation();
        navigate(`/restaurants/${id}/update`);
    }

    const handleRestaurantSelect = (id) => {
        navigate(`/restaurants/${id}`)
    }

    const renderRating = (restaurant) => {
        if (!restaurant.count) {
          return <span className="text-warning">0 reviews</span>;
        }
        return (
          <>
            <StarRating rating={restaurant.average_rating} />
            <span className="text-warning ml-1">({restaurant.count})</span>
          </>
        );
      };

    return (
        <div className='list-group'>
            <table className="table table-hover table-dark">
                <thead>
                    <tr className="bg-primary">
                        <th scope='col'>Restaurant</th>
                        <th scope='col'>Location</th>
                        <th scope='col'>Price Range</th>
                        <th scope='col'>Ratings</th>
                        <th scope='col'>Edit</th>
                        <th scope='col'>Delete</th>
                    </tr>
                </thead>
                <tbody>
                {/* This line below to render restaurants data only when restaurnats exist in data */}
                    {restaurants && restaurants.map(restaurant => {
                        return(
                            <tr key = {restaurant.id} onClick={() => {handleRestaurantSelect(restaurant.id)}}>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.location}</td>
                            <td>{"$".repeat(restaurant.price_range)}</td>
                            <td>{renderRating(restaurant)}</td>
                            <td><button className="btn btn-warning" onClick={(e) => {handleUpdate(e, restaurant.id)}}>Update</button></td>
                            <td><button className="btn btn-danger" onClick={(e) => handleDelete(e, restaurant.id)}>Delete</button></td>
                        </tr>
                        )
                    })}


                </tbody>
            </table>

        </div>
    )
}

export default RestaurantList

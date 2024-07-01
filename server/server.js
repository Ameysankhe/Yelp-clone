import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
// import db from './db/index.js';
import { query } from './db/index.js';  
import cors from 'cors';



dotenv.config();
const app = express();
const port = process.env.PORT || 3006; 

// app.use(morgan("tiny"));
app.use(cors());
app.use(express.json())

// app.use((req,res, next) => {
//     console.log("yeah our middleware");
//     next();
// })

// Get all restaurants  
app.get('/api/v1/restaurants', async (req, res) => {
  try{
    // const results = await query("SELECT * FROM restaurants");
    // console.log(results);
    const restaurantRatingsData = await query(
        "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
      );
      res.status(200).json({
        status: "success",
        results: restaurantRatingsData.rows.length,
        data: {
          restaurants: restaurantRatingsData.rows,
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

// Get a restaurant
app.get('/api/v1/restaurants/:id', async (req,res) => {

    // console.log(req.params.id);

    try{
        const restaurant = await query(
            "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
            [req.params.id]
          );

        const reviews = await query("SELECT * FROM reviews WHERE restaurant_id = $1", [req.params.id]);

        res.status(200).json({
            status: "success",
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows
            },
        });
    } catch(err) {
        console.log(err)
    }
});

// Create a restaurant
app.post('/api/v1/restaurants/', async (req,res) => {
   try{
        const results = await query("INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) returning *", [req.body.name, req.body.location, req.body.price_range]);
        // console.log(results);
        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        });
    
   }catch(err){
    console.log(err);
   }
})

//Update restaurnats
app.put('/api/v1/restaurants/:id', async (req,res) => {
    try{

        const results = await query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *", [req.body.name, req.body.location, req.body.price_range, req.params.id]);

        // console.log(results);
    
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },

        });
    }catch(err){
        console.log(err)
    }
})

//Delete restaurants
app.delete('/api/v1/restaurants/:id', async (req,res) => {
   try{
        const results = await query("DELETE FROM restaurants WHERE id = $1", [req.params.id]);
        // console.log(results);
        res.status(204).json({
            status: "success"
        })
   }catch(err){
        console.log(err)
   }
})

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
    try {
      const newReview = await query(
        "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
        [req.params.id, req.body.name, req.body.review, req.body.rating]
      );
    //   console.log(newReview);
      res.status(201).json({
        status: "success",
        data: {
          review: newReview.rows[0],
        },
      });
    } catch (err) {
      console.log(err);
    }
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

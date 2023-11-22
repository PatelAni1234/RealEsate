import express from 'express'
import {createUser , bookVisit ,getAllBookings, cancelBookings , toFav, getAllFavorites} from '../controllers/userController.js'

const router  = express.Router()

router.post("/register"  , createUser)
router.post("/bookVisit/:id" , bookVisit)
router.post("/allBookings" , getAllBookings);
router.post("/removeBooking/:id" , cancelBookings);
router.post("/toFav/:rid" , toFav);
router.post("/allfavorites" , getAllFavorites);
export {router as userRoute}

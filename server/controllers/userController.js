import asyncHandler from "express-async-handler";
import prisma from "../config/prismaConfig.js";

export const createUser = asyncHandler(async (req, res) => {
  console.log("creating a new user ");

  let { email } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User registered succesfully",
      user: user,
    });
  } else res.status(201).send({ message: "User already registered" });
});

export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body;
  const { id } = req.params;
  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("your visit is booked succesfully");
    }
  } catch {
    throw new Error(err.message);
  }
});
// funciotn to get the booking sof the user
export const getAllBookings = asyncHandler(async(req ,res)=>{
      const{email} = req.body;
      try{
      const booking = await prisma.user.findUnique({
        where:{email} ,
        select:{bookedVisits:true}
      })
      res.status(200).send(booking)
      }
      catch(err){
        throw new Error(err.message);
      }
})

// funcution to cancel booking
export const cancelBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const{id} = req.params;
  try {
      const user = await prisma.user.findUnique({
      where: { email:email },
      select: { bookedVisits: true },
    });
    const index = user.bookedVisits.findIndex((visit)=> visit.id===id);
    if(index===-1){
      res.status(404).json({message:"Booking not found"});
    }
    else{
      user.bookedVisits.splice(index , 1);
      await prisma.user.update({
        where:{
          email:email
        } ,
        data:{
          bookedVisits:user.bookedVisits
        }
    })
    res.send("Booking cancel Succesfully")
    }
    res.status(200).send(booking);
  } catch (err) {
    throw new Error(err.message);
  }
});

// adding a residency in favourites
export const toFav = asyncHandler(async(req , res)=>{
  const {email} = req.body;
  const {rid} = req.params;
   try {
     const user = await prisma.user.findUnique({
       where: { email },
     });
     if(user.favResidenciesID.includes(rid)){
        const updateduser = await prisma.user.update({
          where:{email:email} , 
          data:{
            favResidenciesID:{
              set:user.favResidenciesID.filter((id)=> id!=id)
            }
          }
        })
        res.send({message:"removed from favorites" , user:updateduser})
     }
     else{
       const updateUser =  await prisma.user.update({
        where:{email} ,
        data:{favResidenciesID:{push:rid}}
       })
       res.send({message:"updated Favorites" , updateUser})
     }
     res.status(200).send(booking);
   } catch (err) {
     throw new Error(err.message);
   }
})


// funnction to get all favorite bookings
export const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
     const favorites = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    res.status(200).send(favorites);
  } catch (err) {
    throw new Error(err.message);
  }
});
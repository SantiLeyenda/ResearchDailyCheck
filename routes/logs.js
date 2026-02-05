const express = require("express");
const router = express.Router();
const pool = require("../db");


function isValidDate(dateString){

    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);

}


function validateDateParam(req,res,next){
    const date = req.params.date || req.body.date;
    if (!isValidDate(date)){
        return res.status(400).json({error: "Invalid date format. Use YYYY-MM-DD"});
    }
    next();
}

router.post("/", async (req, res, err) => {

    try {

        const {date, did, blockers, todo, minuteSpent, mood} = req.body;

        if (!isValidDate(date)){

            return res.status(400).json({error: "You need a valid date"})

        }


        if (minuteSpent === undefined || minuteSpent === null){

            return res.status(400).json({error: "minuteSpent is required"});

        }



       



        const { rows } = await pool.query(
            `INSERT INTO logs (date, did, blockers, todo, minuteSpent, mood) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
            [date, did, blockers, todo, minuteSpent, mood]
        );

        res.status(201).json(rows[0]);
    } catch (err){

        if (err.code === '23505'){
            return res.status(409).json({error: "Log for this date already exists"});
        }
        next(err);
    }

});



router.get("/:date", validateDateParam, async (req, res, err) => {


    
    

    try {
        const {date} = req.params;
        const {rows} = await pool.query(
        'SELECT * FROM logs WHERE date = $1',
        [date]
        )   

        if (rows.length === 0){
            return res.status(404).json({error: "Log not found for this date"});
        }


        


        res.status(200).json(rows[0]);



    } catch (err){

        next(err);

    }


})




router.get("/", async (req, res, err) => {

     

    try {

         const {from, to} = req.query;

          if (!isValidDate(from)){

            return res.status(400).json({error: "You need a valid date start date"})

        }

          if (!isValidDate(to)){

            return res.status(400).json({error: "You need a valid end date"})

        }

      
        const result = await pool.query (

            'SELECT * FROM logs WHERE date BETWEEN $1 AND $2 ORDER BY date', [from, to]

        );

        // Response 200
        res.status(200).json(result);
   


    } catch (err){

           next(err);

    }


})


router.patch("/:date", validateDateParam, async (req, res, err) => {

    try {

        const {date} = req.params;
        const { did, blockers, todo, minuteSpent, mood} = req.body;

        if (minuteSpent === undefined || minuteSpent === null){
            return res.status(400).json({error: "minuteSpent is required"});
        }

    
        // Response 200

        const { rows } = await pool.query(
            `UPDATE logs 
             SET did = $1, blockers = $2, todo = $3, minuteSpent = $4, mood = $5
             WHERE date = $6
             RETURNING *`,
            [did, blockers, todo, minuteSpent, mood, date]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Log not found for this date" });
        }

        res.status(200).json(rows[0]);




    } catch (err){

           next(err);

    }


})




router.delete("/:date", validateDateParam, async (req, res, err) => {

    
    try {
          const {date} = req.params;

        const {rows} = await pool.query(
            'DELETE FROM logs WHERE date = $1 RETURNING *',
            [date]
        )

        if (rows.length === 0){
            return res.status(404).json({error: "Log not found for this date"});
        }

      


        res.status(200).json({

            message: 'Event deleted succesfully', 
            deletedEvent: result.row[0]

        });

        // Response 200 if deleted = true 


    } catch (err){

           next(err);

    }


})


module.exports = router; 
const express = require("express");
const router = express.Router();
const pool = require("../db"); 

function isValidDate(dateString){
    if (!dateString) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}


// POST
router.post("/", async (req, res, next) => { 
    try {
        const {title, hypothesis, approach, config, startedOn} = req.body;
        const status = req.body.status || "planned";

        if (!title) {
            return res.status(400).json({error: "You need a title"});
        }

        if (title.length < 3 || title.length > 123){
            return res.status(400).json({error: "Title must be between 3 and 123 characters"});
        }

        const { rows } = await pool.query(
            `INSERT INTO experiments (title, hypothesis, approach, config, status, startedOn) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`, 
            [title, hypothesis, approach, config, status, startedOn]
        );

        res.status(201).json(rows[0]);

    } catch (err){
        if (err.code === '23505'){
            return res.status(409).json({error: "Experiment already exists"});
        }
        next(err);
    }
});

// GET with pagination
router.get("/", async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor; 
        const status = req.query.status; 

        if (limit < 1 || limit > 100) {
            return res.status(400).json({ error: "Limit must be 1-100" });
        }

        let query, params;

 
        if (cursor && status) {
            query = `
                SELECT * FROM experiments 
                WHERE created_at < $1 AND status = $2
                ORDER BY created_at DESC 
                LIMIT $3
            `;
            params = [cursor, status, limit + 1];
        } else if (cursor) {
            query = `
                SELECT * FROM experiments 
                WHERE created_at < $1 
                ORDER BY created_at DESC 
                LIMIT $2
            `;
            params = [cursor, limit + 1];
        } else if (status) {
            query = `
                SELECT * FROM experiments 
                WHERE status = $1
                ORDER BY created_at DESC 
                LIMIT $2
            `;
            params = [status, limit + 1];
        } else {
            query = `
                SELECT * FROM experiments 
                ORDER BY created_at DESC 
                LIMIT $1
            `;
            params = [limit + 1];
        }

        const { rows } = await pool.query(query, params);

        const hasMore = rows.length > limit;
        const data = hasMore ? rows.slice(0, limit) : rows;

        const nextCursor = data.length > 0 
            ? data[data.length - 1].created_at 
            : null;

        res.status(200).json({
            data,
            pagination: {
                nextCursor: hasMore ? nextCursor : null,
                hasMore,
                limit
            }
        });
    } catch (err) {
        next(err);
    }
});

// PATCH
router.patch("/:id", async (req, res, next) => {
    try {
        const {id} = req.params; 
        const {title, hypothesis, approach, config, startedOn} = req.body;
        const status = req.body.status || "planned";

        if (!title) {
            return res.status(400).json({error: "You need a title"});
        }

        if (title.length < 3 || title.length > 123){
            return res.status(400).json({error: "Title must be between 3 and 123 characters"});
        }

        const { rows } = await pool.query(
            `UPDATE experiments 
             SET title = $1, hypothesis = $2, approach = $3, config = $4, status = $5, startedOn = $6
             WHERE id = $7 
             RETURNING *`, 
            [title, hypothesis, approach, config, status, startedOn, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Experiment not found" });
        }

        res.status(200).json(rows[0]);

    } catch (err){
        next(err);
    }
});

// DELETE
router.delete("/id", async (req, res, next) => { 
    try {
        const {id} = req.params; 

        const {rows} = await pool.query( 
            'DELETE FROM experiments WHERE id = $1 RETURNING *', 
            [id] 
        );

        if (rows.length === 0){
            return res.status(404).json({error: "Experiment not found"});
        }

        res.status(200).json({
            message: 'Experiment deleted successfully', 
            deletedExperiment: rows[0]
        });

    } catch (err){
        next(err);
    }
});

module.exports = router;
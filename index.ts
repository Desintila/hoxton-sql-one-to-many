import express from "express"
import cors from 'cors'
import Database from "better-sqlite3"




const app = express()
app.use(cors())
app.use(express.json())

const db = new Database('./data.db', {
    verbose: console.log
})

const getAllMuseums = db.prepare(`SELECT * FROM museums;`)

const getAllWorks = db.prepare(`SELECT * FROM works;`)

const getMuseumById = db.prepare(`SELECT * FROM museums WHERE id=?;`)

const getWorkById = db.prepare(`SELECT  * FROM works WHERE id=?;`)

const getWorkByMuseumId = db.prepare(`SELECT  * FROM works WHERE museum_id=?;`)

const createMuseum = db.prepare(`INSERT INTO museums(name,city) VALUES(?,?);`)

const createWork = db.prepare(`INSERT INTO works(name,picture,museum_id) VALUES(?,?,?);`)

const deleteWork = db.prepare(`DELETE FROM works WHERE id=?;`)
const deleteMuseum = db.prepare(`DELETE FROM museums WHERE id=?;`)
const deleteWorkByMuseumId = db.prepare(`DELETE FROM works WHERE museum_id=?;`)

app.get('/museums', (req, res) => {
    const allMuseums = getAllMuseums.all()

    for (const museum of allMuseums) {

        const work = getWorkByMuseumId.all(museum.id)
        museum.work = work

    }
    res.send(allMuseums)
})


app.get('/museums/:id', (req, res) => {
    const id = req.params.id
    const museum = getMuseumById.get(id)

    if (museum) {

        const work = getWorkByMuseumId.all(museum.id)
        museum.work = work

        res.send(museum)
    }
    else {
        res.status(404).send({ error: 'Museum not found' })
    }
})

app.get('/works', (req, res) => {
    const allWorks = getAllWorks.all()

    for (const work of allWorks) {

        const museum = getMuseumById.all(work.museum_id)
        work.museum = museum

    }
    res.send(allWorks)
})

app.get('/works/:id', (req, res) => {
    const id = req.params.id

    const work = getWorkById.get(id)

    if (work) {

        const museum = getMuseumById.all(work.museum_id)

        work.museum = museum
        res.send(work)
    }
    else {
        res.status(404).send({ error: 'Work not found' })
    }
})

app.post('/museums', (req, res) => {

    const name = req.body.name
    const city = req.body.city

    const errors = []

    if (typeof name !== 'string') errors.push('Name missing')
    if (typeof city !== 'string') errors.push('City missing')


    if (errors.length === 0) {
        const result = createMuseum.run(name, city)

        const newMuseum = getMuseumById.run(result.lastInsertRowid)
        res.send(newMuseum)
    }
    else {
        res.status(400).send({ error: errors })
    }
})


app.post('/works', (req, res) => {
    const name = req.body.name
    const picture = req.body.picture
    const museum_id = req.body.museum_id

    const errors = []

    if (typeof name !== 'string') errors.push('name missing')
    if (typeof picture !== 'string') errors.push('picture missing')
    if (typeof museum_id !== 'number') errors.push('Museum Id missing')

    if (errors.length === 0) {
        const result = createWork.run(name, picture, museum_id)

        const newWork = getWorkById.run(result.lastInsertRowid)
        res.send(newWork)
    }
    else {
        res.status(400).send({ error: errors })
    }
})

app.delete('/works/:id', (req, res) => {
    const id = Number(req.params.id)

    const result = deleteWork.run(id)

    if (result.changes !== 0) {

        res.send('Work deleted')
    }
    else {
        res.status(404).send({ error: 'Work not found' })
    }
})

app.delete('/museums/:id', (req, res) => {
    const id = Number(req.params.id)

    deleteWorkByMuseumId.run(id)

    const result = deleteMuseum.run(id)

    if (result.changes !== 0) {

        res.send('Museum deleted')
    }
    else {
        res.status(404).send({ error: 'Museum not found' })
    }
})


app.listen(4000)
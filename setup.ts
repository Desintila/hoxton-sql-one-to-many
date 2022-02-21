import Database from "better-sqlite3";

const db = new Database('./data.db', {
    verbose: console.log
})

const museums = [
    {
        name: 'The British Museum',
        city: 'London'
    },
    {
        name: 'National History Museum',
        city: 'Tirane'
    },
    {
        name: 'The Museum of Modern Art',
        city: 'New York'
    },
    {
        name: 'Louvre Museum',
        city: 'Paris'
    },
    {
        name: 'Kosovo Museum ',
        city: 'Pristina'
    },
]

const works = [
    {
        name: 'Rosetta Stone',
        picture: 'https://blog.britishmuseum.org/wp-content/uploads/2020/08/xESG-Rosetta-Stone-square.jpg.pagespeed.ic.zrsHKMbwI1.webp',
        museumId: 1
    },
    {
        name: 'Sophilos Vase',
        picture: 'https://blog.britishmuseum.org/wp-content/uploads/2020/08/x17-08-2020-12.00.03.jpg.pagespeed.ic.trJE27XoZZ.webp',
        museumId: 1
    },
    {
        name: 'Scanderbeg',
        picture: 'https://www.albanopedia.com/wp-content/uploads/2020/09/skenderbeuhighresolution.jpg',
        museumId: 2
    },
    {
        name: 'THE STARRY NIGHT',
        picture: 'https://learnodo-newtonic.com/wp-content/uploads/2013/07/The-Starry-Night-De-sterrennacht-by-Vincent-Van-Gogh.webp',
        museumId: 3
    },
    {
        name: 'The Mona Lisa',
        picture: 'https://cdn.pariscityvision.com/library/image/5449.jpg',
        museumId: 4
    },
    {
        name: 'The Wedding at Cana',
        picture: 'https://cdn.pariscityvision.com/library/image/5459.jpg',
        museumId: 4
    }

]


const dropWorks = db.prepare(`DROP TABLE works;`)
const dropMuseums = db.prepare(`DROP TABLE museums;`)

dropWorks.run()
dropMuseums.run()


const createMuseums = db.prepare(`
CREATE TABLE  museums(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT 
);
`)


const createWorks = db.prepare(`
CREATE TABLE works(
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    picture TEXT,
    museum_id INTEGER,
    FOREIGN KEY (museum_id) REFERENCES museums(id)
);
`)


createMuseums.run()
createWorks.run()

const createMuseum = db.prepare(`
INSERT INTO museums(name,city) VALUES (?,?);
`)


const createWork = db.prepare(`
INSERT INTO works (name,picture,museum_id) VALUES (?,?,?);
`)

for (const museum of museums) {
    createMuseum.run(museum.name, museum.city)
}

for (const work of works) {
    createWork.run(work.name, work.picture, work.museumId)
}
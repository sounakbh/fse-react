import {createTuit, deleteTuit, findTuitById, findAllTuits} from "../services/tuits-service";

describe('can create tuit with REST API', () => {
    // sample tuit to be deleted
    const sampleTuit = {
        tuit: "Hello this is Sounak!",
        postedBy: "622cbdd1ec807793d6590234",
    }

    let createdTuitID = null;

    // clean up after test runs
    afterAll(() => {
        // remove any data we created
        return deleteTuit(createdTuitID);
    })

    test('can insert new tuits with REST API', async () => {
        // insert new tuit into the database
        const newTuit = await createTuit(sampleTuit.postedBy, sampleTuit);
        expect(newTuit.postedBy).toEqual(sampleTuit.postedBy);
        expect(newTuit.tuit).toEqual(sampleTuit.tuit);
        createdTuitID = newTuit._id;
    });
});

describe('can delete tuit with REST API', () => {
    // sample tuit to be inserted
    const sampleTuit = {
        tuit: "Hello this is Sounak!",
        postedBy: "622cbdd1ec807793d6590234",
    }

    // record tuit ID so we can delete it later
    let createdTuitID = null;

    beforeAll(async () => {
        // insert the sample tuit into the DB
        const createdTuit = await createTuit(sampleTuit.postedBy, sampleTuit);
        createdTuitID = createdTuit._id;
    })

    test('can insert new tuits with REST API', async () => {
        const status = await deleteTuit(createdTuitID);
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API',  () => {
    const sampleTuit = {
        tuit: "Hello this is Sounak!",
        postedBy: "622cbdd1ec807793d6590234",
    }

    // store tuit ID in this variable, so that we can delete it later.
    let createdTuitID = null;

    beforeAll(async () => {
        // insert the sample tuit into the DB
        const createdTuit = await createTuit(sampleTuit.postedBy, sampleTuit);
        createdTuitID = createdTuit._id;
    })

    // clean up after test runs
    afterAll(() => {
        // remove the tuit we created
        return deleteTuit(createdTuitID);
    })

    test('can insert new tuits with REST API', async () => {
        const response = await findTuitById(createdTuitID);
        expect(response.tuit).toEqual(sampleTuit.tuit);
        expect(response.postedBy._id).toEqual(sampleTuit.postedBy);
    });

});

describe('can retrieve all tuits with REST API', () => {
    // an array of tuits we need to insert
    const tuitsToBeInserted = [
        {
            tuit: "sounak's first tuit",
            postedBy: "622cbdd1ec807793d6590234"
        },
        {
            tuit: "sounak's second tuit",
            postedBy: "622cbdd1ec807793d6590234"
        },
        {
            tuit: "Heya's first tuit",
            postedBy: "622cd5757d43ac8c7bb56132"
        },
    ]

    // initialize an array to store the IDs of the created tuits.
    const createdTuitIDs = [];

    // setup data before test
    beforeAll(() =>
        // insert the array of tuits above into the DB
        Promise.all(tuitsToBeInserted.map(async tuit => {
                const createdTuit = await createTuit(tuit.postedBy, tuit)
                createdTuitIDs.push(createdTuit._id);
            }
        ))
    );

    // clean up the created tuits
    afterAll(() =>
        // delete the tuits we inserted
        Promise.all(createdTuitIDs.map(async tid =>
            await deleteTuit(tid)
        ))
    );

    test('can retrieve all tuits from REST API', async () => {
        // retrieve all the tuits
        const tuitsFetched = await findAllTuits();
        // there should be a minimum number of tuits
        expect(tuitsFetched.length).toBeGreaterThanOrEqual(tuitsToBeInserted.length);
        // let's check each tuit we inserted
        const tuitsWeInserted = tuitsFetched.filter(tuit => createdTuitIDs.indexOf(tuit._id) >= 0);
        tuitsWeInserted.forEach(tuit => {
            const tuitContent = tuitsToBeInserted.find(currentTuit => currentTuit.tuit === tuit.tuit
                && currentTuit.postedBy === tuit.postedBy._id);
            // the inserted tuit should be present in the DB
            expect(tuitContent).not.toBeNull();
            expect(tuitContent.tuit).toEqual(tuit.tuit);
            expect(tuitContent.postedBy).toEqual(tuit.postedBy._id);
        });
    });
});
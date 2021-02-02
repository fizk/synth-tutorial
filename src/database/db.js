/**
 * Private utility function that returns a Promise resloving to
 * an open IndexedDB.
 *
 * It will created all needed objectStores and indexes.
 *
 * @param {string} name
 * @param {number} version
 */
const db = (name = 'audio-synth', version = 1) => {
    return new Promise((pass, fail) => {
        var request = window.indexedDB.open(name, version);

        request.onerror = (event) => fail(event);
        request.onsuccess = (event) => pass(event.target.result);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.onerror = (event) => fail(event);

            const progressObjectStore = db.createObjectStore('progress', { keyPath: "path" });
            progressObjectStore.createIndex("from", "from", { unique: false });
            progressObjectStore.createIndex("to", "to", { unique: false });
            progressObjectStore.createIndex("relm", "relm", { unique: false });
            progressObjectStore.createIndex("object", "object", { unique: false });

            const scoreObjectStore = db.createObjectStore('score', { keyPath: "relm" });
            scoreObjectStore.createIndex("score", "score", { unique: false });
            scoreObjectStore.createIndex("relm", "relm", { unique: true });
        };
    });
};

/**
 * Record score for a page.
 * It is usually called in the `onBeforeLeave` method of a Page WebComponent.
 *
 * It will store the `progress object`, which should be in the form of:
 * ```
 *  from: Date
 *  to: Date
 *  relm: String
 *  object: {key: Boolean}
 * ```
 *
 * Second parameter is a validation function which should accept as its argument an array of
 * `progress objects` and validate if they meet the acceptance criteria. The return value should
 * either be `false` or the `score object` which looks like this: `{relm: String, score: Number}`.
 * If the `validator` function is successful, the `conclude` function will be called.
 *
 * The function returns a Promise that resolves to the return from the validator function.
 *
 * @param {object} object
 * @param {function} validator
 * @returns {Promise}
 */
export const record = (object, validator = () => {}) => {
    return db().then(database => {
        return new Promise((pass, fail) => {
            const transaction = database.transaction(['progress'], 'readwrite');
            const objectStore = transaction.objectStore('progress');
            objectStore.add(object);

            transaction.onerror = () => pass(false);
            transaction.oncomplete = () => conclude(validator, object.relm).then(pass);
        })
    });
};

/**
 * Function that checks if the score of a given relm has been previously recorded.
 * If not, it will calculate the total score for the given relm by sing the `validator`
 * function, store it and then return a Promise resolving to the `score object`
 * which looks like this: `{relm: String, score: Number}`. It can also resolve to `false`
 * if the score has already been recorded or if something has gone wrong.
 *
 * This function is usually called by the `record()` function, but can be called on its own,
 * usually in the `onAfterEnter` method of a Page WebComponent,
 * often by a *Epilogue Page Component.
 *
 * @param {function} validator
 * @param {string} relm
 * @returns {Promise}
 */
export const conclude = (validator, relm) => {
    return new Promise((pass, fail) => {
        db().then(database => {
            const transaction = database.transaction(['progress', 'score'], 'readwrite');
            const scoreObjectStore = transaction.objectStore('score');

            scoreObjectStore
                .get(relm)
                .onsuccess = (event) => {
                    if (!event.target.result) {
                        const progressResults = [];
                        transaction.objectStore('progress')
                            .index('relm')
                            .openCursor(IDBKeyRange.only(relm))
                            .onsuccess = event => {
                                const cursor = event.target.result;
                                if (cursor) {
                                    progressResults.push(cursor.value);
                                    cursor.continue();
                                } else {
                                    const validation = validator(progressResults);
                                    if (validation) {
                                        scoreObjectStore.put(validation).onsuccess = () => pass(validation);
                                    } else {
                                        pass(false)
                                    }
                                }
                            }
                    } else {
                        pass(false);
                    }
                };
        }).catch(() => pass(false));
    });
}

/**
 * Query the Database's `Score` objectStore.
 * It will return a Promise which resolves to all the records in the object store.
 * Mostly used by the top-most component (App) to display the score-board.
 *
 * @returns {Promise}
 */
export const getScore = () => {
    return new Promise((pass) => {
        db().then(database => {
            const request = database
                .transaction(['score'], 'readonly')
                .objectStore('score')
                .getAll();

            request.onsuccess = event => pass(event.target.result);
            request.onerror = () => pass([]);
        }).catch(() => pass([]));
    });
}

/**
 * Validator function.
 * A generic validation function that checks the progress of a relm.
 * It will always return `false` unless all pages in the relm have been
 * visited.
 *
 * This is a closure function that will return the actual validation function.
 *
 * @param {number} numberOfPagesInRelm
 * @returns {function}
 */
export default (numberOfPagesInRelm) => (data) => {
    const minTimePerPage = 3000;

    const relm = data.reduce((previous, current) => current.relm, undefined);

    const totalReadingTime = data
        .map(item => item.to - item.from)
        .reduce((previous, current) => previous + current, 0);

    const interactionArray = data
        .map(item => item.object)
        .reduce((previous, current) => [...previous, ...Object.values(current)], [])
        .map(Boolean);

    const scoreArray = [...interactionArray, data.length * minTimePerPage < totalReadingTime];
    const score = (scoreArray.filter(item => item).length / scoreArray.length) * 100

    return data.length === numberOfPagesInRelm
        ? { relm, score }
        : false;
};
const WaitersDb = (db) => {
    const storeName = async (name) => {
        const result = await db.manyOrNone('INSERT INTO waiters (name) VALUES ($1);', [name])
        return [result]
    }

    const storeWaiterAvailabilty = async (nameId, dayId) => {
        let result = ''
        if (typeof dayId == 'object') {
            for (let x = 0; x < dayId.length; x++) {
                result = await db.manyOrNone('INSERT INTO days_available (waiter_id, day_available) VALUES ($1, $2);', [nameId, dayId[x]])
            }
        } else {
            result = await db.oneOrNone('INSERT INTO days_available (waiter_id, day_available) VALUES ($1, $2);', [nameId, dayId])
        }
        return result
    }

    const getUsers = async () => {
        const result = await db.manyOrNone('SELECT * FROM waiters;')
        return result
    }

    const getUser = async (name) => {
        const [result] = await db.manyOrNone('SELECT * FROM waiters WHERE name = $1;', [name])
        return result
    }
    const getAvailableDays = async () => {
        const tables = await db.manyOrNone('SELECT * FROM days_available LEFT JOIN days ON days.id = days_available.day_available;')
        return tables
    }
    const getWaiters = async () => {
        const result = await db.manyOrNone('SELECT waiter_id, name, day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id GROUP BY waiter_id, name, days.day;')
        return result
    }
    const getDay = async (id) => {
        let days = '';
        let mainResult = []
        if (typeof id == 'number') {
            const result = await db.manyOrNone('SELECT name, day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id WHERE waiter_id = $1 GROUP BY days.day, waiters.name;', [id])
            mainResult.push(result)
        } else {
            const result = await db.any('SELECT name, day FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id GROUP BY days.day, waiters.name;')
            days = result?.map(item => item.day)
            for (let x = 0; x < result.length; x++) {
                let item = await db.any('SELECT DISTINCT day, name FROM waiters as W JOIN days_available as DA ON w.id = DA.Waiter_id JOIN days ON DA.day_available = days.id WHERE days.day = $1 GROUP BY days.day, w.name', [days[x]])
                mainResult.push(item)
            }
        }
        return mainResult
    }
    const getWaitersByDay = async (day) => {
        return getDaysByName = await db.manyOrNone('SELECT * FROM days_available INNER JOIN waiters ON waiter_id = waiters.id INNER JOIN days ON day_available = days.id WHERE day = $1', [day])

    }
    const getDays = async () => {
        const days = await db.manyOrNone('SELECT * FROM days;')
        return days
    }

    const deleteWaiters = async () => {
        await db.any('DELETE FROM waiters;')
    }

    const resetDays = async () => {
        await db.manyOrNone('DELETE FROM days_available;')
    }

    const deleteWaiter = async (name) => {
        return await db.oneOrNone('DELETE FROM waiters WHERE name = $1;', [name])
    }

    const clearWaiterDays = async (id) => {
        const result = await db.oneOrNone('DELETE FROM days_available WHERE waiter_id = $1;', [id])
        return result
    }
    return {
        getDay,
        getDays,
        getWaitersByDay,
        storeName,
        getWaiters,
        getUsers,
        getUser,
        getAvailableDays,
        storeWaiterAvailabilty,
        deleteWaiters,
        resetDays,
        deleteWaiter,
        clearWaiterDays
    }

}
module.exports = {
    WaitersDb
}
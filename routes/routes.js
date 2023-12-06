const Routes = (waiter, waitersDb) => {
    const postLoginPage = async (req, res) => {
        const { name } = req.body
        waiter.setName(name)
        const username = waiter.getName()
        const dbName = await waitersDb.getUser(username)
        const existName = waiter.validateDbName(username, dbName)
        existName === false && username ? await waitersDb.storeName(username) : '';
        const user = req.session.user = username;
        res.render('login', {
            error: waiter.errorHandler(),
            success: waiter.successHandler(existName, username)
        })
    }
    const getLoginPage = async (req, res) => {
        res.render('login')
    }

    const postAddWaiterPage = async (req, res) => {
        const { name } = req.body
        waiter.setName(name)
        const username = waiter.getName()
        const dbName = await waitersDb.getUser(username)
        const existName = waiter.validateDbName(username, dbName)
        existName === false && username ? await waitersDb.storeName(username) : '';
        const user = req.session.user = username;
        res.render('addWaiter', {
            error: waiter.errorHandler(),
            success: waiter.addWaiterSuccessHandler(existName, username)
        })
    }

    const getAddWaiterPage = async (req, res) => {
        res.render('addWaiter')
    }

    const getHomePage = async (req, res) => {
        const weekDays = await waitersDb.getDays()
        const waitersByDay = {}
        for (let day of weekDays.map(obj => obj.day)) {
            const users = await waitersDb.getWaitersByDay(day)
            waitersByDay[day] = [... new Set(users.map(obj => obj.name))]
        }
        res.render('index', {
            days: waitersByDay,
            helpers: {
                separator: function (user) {
                    let working = ''
                    if (user.length <= 2) {
                        working = 'yellow_day'
                    } else if (user.length === 3) {
                        working = 'green_day'
                    } else if (user.length > 3) {
                        working = 'red_day'
                    }
                    return working
                },
            }
        })
    }

    const postHomePage = async (req, res) => {
        const weekDays = await waitersDb.getDays()
        const waiters = await waitersDb.getUsers()
        let id = waiter.convertObj(waiters)
        const days = await waitersDb.getDay(id)
        res.render('index', {
            week: waitersDb.getCurrentWeek,
            nextweek: waitersDb.getCurrentWeek() + 1,
            date: waitersDb.getCurrentDate,
            weekDays,
            days,
            waiters,
        })
    }
    const getSchedulePage = async (req, res) => {
        const { username } = req.params
        const days = await waitersDb.getDays()
        const waiter = await waitersDb.getUser(username)
        let days_available = []
        if (!!waiter) {
            const { id } = waiter
            days_available = await waitersDb.getDay(id)
        }
        const [getAvailableDays] = days_available?.map(days => days)
        const allDays = (getAvailableDays || [])?.map(days => days.day)
        const success = req.flash()
        res.render('schedule', {
            username,
            days_available,
            days,
            helpers: {
                separator: function (daysSep) {
                    let isChecked = ''
                    if (allDays.includes(daysSep)) {
                        isChecked = 'Checked'
                    }
                    return isChecked
                },
            },
            waiter: username,
            success: success.success,
        })
    }

    const postSchedulePage = async (req, res) => {
        const { username } = req.params
        const { day } = req.body
        waiter.setName(username)
        waiter.setDays(day)
        const name = waiter.getName()
        const getDay = waiter.getDays()
        const dbName = await waitersDb.getUser(name)
        const days = await waitersDb.getDays()
        const existName = waiter.validateDbName(name, dbName)
        existName === false && username ? await waitersDb.storeName(name) : '';
        const waiterDetails = await waitersDb.getUser(name)
        let days_available = []
        if (!!waiterDetails) {
            const { id } = waiterDetails
            getDay !== '' ? await waitersDb.storeWaiterAvailabilty(id, getDay) : ''
            days_available = await waitersDb.getDay(id)
        }
        const [getAvailableDays] = days_available?.map(days => days)
        const allDays = (getAvailableDays || [])?.map(days => days.day)
        req.flash('success', 'you have successfully scheduled your days.')
        req.flash('error', 'schedule your days.')
        res.render('schedule', {
            username,
            days,
            helpers: {
                separator: function (daysSep) {
                    let isChecked = ''
                    if (allDays.includes(daysSep)) {
                        isChecked = 'Checked'
                    }
                    return isChecked
                },
            },
            error: waiter.errorHandler(getDay, name),
            success: waiter.successHandler('', name),
        })
    }

    const clearSchedulePage = async (req, res) => {
        const { username } = req.params
        const days = await waitersDb.getDays()
        const waiter = await waitersDb.getUser(username)
        const { id } = waiter
        await waitersDb.clearWaiterDays(id)
        let days_available = []
        if (!!waiter) {
            const { id } = waiter
            days_available = await waitersDb.getDay(id)
        }
        const [getAvailableDays] = days_available?.map(days => days)
        const allDays = (getAvailableDays || [])?.map(days => days.day)
        res.render('schedule', {
            username,
            days,
            helpers: {
                separator: function (daysSep) {
                    let isChecked = ''
                    if (allDays.includes(daysSep)) {
                        isChecked = 'Checked'
                    }
                    return isChecked
                },
            },
            waiter,
            success: `${username} your days reset successful`,
        })
    }

    const getAllDays = async (req, res) => {
        const weekDays = await waitersDb.getDays()
        const waiters = await waitersDb.getUsers()
        let id = waiter.convertObj(waiters)
        const waitersByDay = {}
        for (let day of weekDays.map(obj => obj.day)) {
            const users = await waitersDb.getWaitersByDay(day)
            waitersByDay[day] = [... new Set(users.map(obj => obj.name))]
        }
        res.render('admin', {
            days: waitersByDay,
            waiters,
            helpers: {
                separator: function (user) {
                    let working = ''
                    if (user.length <= 2) {
                        working = 'yellow_day'
                    } else if (user.length === 3) {
                        working = 'green_day'
                    } else if (user.length > 3) {
                        working = 'red_day'
                    }
                    return working
                },
            }
        })
    }
    const postAdminPage = async (req, res) => {
        const { username } = req.params
        const { day } = req.body
        waiter.setName(username)
        waiter.setDays(day)
        res.render('admin', {
            error: waiter.errorHandler,
            success: waiter.successHandler,
        })
    }

    const getAdminPage = async (req, res) => {
        const weekDays = await waitersDb.getDays()
        const waiters = await waitersDb.getUsers()
        let id = waiter.convertObj(waiters)
        const waitersByDay = {}
        for (let day of weekDays.map(obj => obj.day)) {
            const users = await waitersDb.getWaitersByDay(day)
            waitersByDay[day] = [... new Set(users.map(obj => obj.name))]
        }
        res.render('admin', {
            days: waitersByDay,
            waiters,
            helpers: {
                separator: function (user) {
                    let working = ''
                    if (user.length <= 2) {
                        working = 'yellow_day'
                    } else if (user.length === 3) {
                        working = 'green_day'
                    } else if (user.length > 3) {
                        working = 'red_day'
                    }
                    return working
                },
            }
        })
    }
    const postWaiterPage = async (req, res) => {
        res.render('waiter', {
            day,
        })
    }

    const getWaiterPage = async (req, res) => {
        // console.log('This is user', localStorage.getItem('Name'))
        const { username } = req.params
        const waiter = await waitersDb.getUser(username)
        const { id } = waiter
        let days_available = await waitersDb.getDay(id)
        let scheduleBtn = 'Schedule Days'
        let noDays = ''
        if (days_available[0].length < 1) {
            noDays = username + ' you have no days scheduled'
        } else {
            scheduleBtn = 'Update Days'
        }

        res.render('waiter', {
            noDays,
            username,
            days_available,
            waiter,
            scheduleBtn
        })
    }


    const allWaitersPage = async (req, res) => {
        const weekDays = await waitersDb.getDays()
        const waiters = await waitersDb.getUsers()
        let id = waiter.convertObj(waiters)
        const days = await waitersDb.getDay(id)
        res.render('waiters', {
            weekDays,
            days,
            waiters,
        })
    }
    const deleteWaiters = async (req, res) => {
        const { username } = req.params
        await waitersDb.deleteWaiters()
        const { day } = req.body
        waiter.setName(username)
        waiter.setDays(day)
        res.render('admin', {
            success: 'All waiters remove successful.',
        })
    }
    const resetDays = async (req, res) => {
        const { username } = req.params
        await waitersDb.resetDays()
        const { day } = req.body
        waiter.setName(username)
        waiter.setDays(day)
        res.render('admin', {
            success: "Days reset successful.",
        })
    }

    const deleteUser = async (req, res) => {
        const { name } = req.params
        await waitersDb.deleteWaiter(name)
        res.redirect('/')
    }
    return {
        postLoginPage,
        getLoginPage,
        postAddWaiterPage,
        getAddWaiterPage,
        postHomePage,
        getHomePage,
        postSchedulePage,
        getSchedulePage,
        postWaiterPage,
        getWaiterPage,
        postAdminPage,
        getAdminPage,
        allWaitersPage,
        deleteWaiters,
        resetDays,
        deleteUser,
        clearSchedulePage,
        getAllDays
    }

}
module.exports = Routes

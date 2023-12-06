const Waiter = () => {
    let username = ''
    let days;
    const setName = (name) => username = name?.trim().replace(/[^a-z, ^A-Z]/g, '').toLowerCase()
    const setDays = (day) => {
        if (day == '') return
        if (Array.isArray(day)) {
            days = day?.map((number) => parseInt(number))
        } else {
            days = day
        }
        return days
    }
    const errorHandler = (getDay, name) => {
        if (username === '') {
            return 'Enter name to signin!'
        }
        else if (typeof username == ! 'string') {
            return 'Enter correct name format! eg. John or Jane'
        } else if (getDay === '') {
            return name + ' schedule your days!'
        } else if (days === undefined && username === '') {
            return 'Select days you will be available!'
        }
    }

    const successHandler = (existname, name) => {
        if (existname === true) {
            return name + ' You already exist, signin...'
        } else if (name && existname === false) {
            return 'Sign up successfull'
        }
        return username && days ? `${name} you have succesfully scheduled your days.` : ''
    }
    const addWaiterSuccessHandler = (existname, name) => {
        if (existname === true) {
            return name + ' already exist, signin...'
        } else if (name && existname === false) {
            return 'User created successful.'
        }
    }

    const validateDbName = (inputName, dbName) => inputName == dbName?.name
    const getName = () => typeof username === 'string' && username !== '' ? username : ''
    const getDays = () => days !== undefined && username !== '' && typeof username === 'string' ? days : ''
    const convertObj = (users) => users?.map(user => user.id)
    return {
        setName,
        setDays,
        getName,
        getDays,
        errorHandler,
        successHandler,
        validateDbName,
        convertObj,
        addWaiterSuccessHandler
    }
}

module.exports = Waiter
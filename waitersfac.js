module.exports = function Waitersfunc(db) {

  async function setUsername(name, code) {
    let result = await db.none('INSERT INTO workers(username, code) values($1, $2)', [name, code])
    return result;
  }
  async function getUsername(code) {
    let results = await db.oneOrNone('SELECT username FROM workers WHERE code=$1', [code])
    return results.username;
  }

  async function usernameID(user){
    let user_id = await db.one('SELECT id FROM workers WHERE username=$1', [user])
return user_id.id
  }

  async function setWeek(day, user) {
    let user_id = await db.one('SELECT id FROM workers WHERE username=$1', [user])
    await db.none('DELETE FROM admins WHERE user_id= $1', [user_id.id])

    for (let i = 0; i < day.length; i++) {
      const weekday = day[i];
      let day_id = await db.manyOrNone('SELECT id FROM workdays WHERE workday=$1', [weekday])
      await db.none('INSERT INTO admins(day_id, user_id) values($1, $2)', [day_id.id, user_id.id])

    }
  
  }

  async function getWeekday() {
    let results = await db.oneOrNone('SELECT * FROM admins')
    return results;
  }
  
  async function theWorkers(){
    let output= await db.oneOrNone("SELECT username, code from workers")
    return output;
  }
  async function selectUsername(name) {
    let output = await db.one("SELECT COUNT(*) FROM workers WHERE username=$1", [name])
    return output;
  }
  async function authCode(userCode) {
    let output = await db.oneOrNone("SELECT * FROM workers WHERE code=$1", [userCode])
    return output;
  }

  async function removeNames(){
    let output= await db.none('DELETE FROM admins')

}

  async function JoinTables(week_days) {
    let output = await db.manyOrNone(`select workers.username, workdays.workday FROM admins
    INNER JOIN workers ON admins.user_id= workers.id
    INNER JOIN workdays ON admins.day_id = workdays.id where workdays.workday= $1`, [week_days])
    return output;
  }

  async function removeWaiters() {
    return await db.none('DELETE FROM admins')
  }

  async function getDays(usernameID){
    let output= await db.manyOrNone('SELECT user_id, day_id, workday FROM admins join workdays on workdays.id = day_id where user_id = $1', [usernameID]);
    return output
  }

  async function weekdays(){
   let output= await db.manyOrNone('SELECT * FROM workdays')
   return output
  }

  async function selectDays(day){

    
    let output= await db.oneOrNone('SELECT id from workdays where workday= $1', [day]);

    let results= await db.oneOrNone('SELECT COUNT(*) FROM admins JOIN workdays on admins.day_id= workdays.id WHERE admins.day_id=$1', [output.id])
    return results.count;
  }

 async function getColors(){
  let days= await db.manyOrNone("SELECT workday FROM workdays")
  let status= []
  for(i=0; i<days.length; i++){
    let day=days[i].workday;
    let count= await selectDays(day);
    if(Number(count)>= 0 && Number(count)<3){
      status.push({weekday: day, state: "waiters-needed"});
    }else if(Number(count)==3) {
      status.push({weekday: day, state: "enough-waiters"});
    }else if (Number(count>3)){
      status.push({weekday: day, state: "overwaiters"})
     }
    }
    return status
  }
  return {
    setUsername,
    getUsername,
    setWeek,
    getWeekday,
    removeWaiters,
    selectUsername,
    authCode,
    JoinTables,
    getColors,
    selectDays,
    getDays,
    weekdays,
    theWorkers,
    getColors,
    authCode,
    usernameID,
    removeNames
  }
  
}
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

const port = 8000;
app.use(bodyParser.json());
app.use(cors());

let users = []
let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8830
  })
}

// path = GET / users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})

// path = POST / user สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
   
    try{
        let user = req.body;
        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'Create user successfully',
            data: results[0]
        })
    }catch(error){
        console.error('error: ', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})


 // path = GET / users /: id สำหรับดึง users รายคนออกมา
// path = GET / users /: id สำหรับดึง users รายคนออกมา
app.get('/users/:id', async (req, res) => {
  try {
  let id = req.params.id;
  const result = await conn.query('SELECT * FROM user WHERE id = ?', id)
  if (result[0].length == 0) {
    throw { statuscode: 404, message: 'User not found' }
    }
    res.json(result[0][0])
  } catch (error) {
      console.log('error', error.message)
      let statusCode = error.statusCode || 500
      res.status(500).json({ 
      message: 'something went wrong',
      errorMessage: error.message
    })
  }
})
   
 // path = PUT /user/:id สำหรับดึง users รายคน (ตาม id ที่บันทึกเข้าไป)
 app.put('/users/:id',async (req, res) => {
  try {
    let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.query
    ('UPDATE user SET? WHERE id = ?',
       [updateUser, id]
      )
    res.json({
      message: 'Create user successfully',
      data: results[0]
   })
  }catch (error) {
    console.log('error', error.message)
    res.status(500).json({
      message:'something went wrong',
      errorMessage: error.message
    })
  }
})



 //path = DELETE /users/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
 app.delete('/users/:id', async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query(
      'DELETE from user WHERE id = ?', id)
    res.json({
      message: 'Delete user successfully',
      data: results[0]
   })
  } catch (error) {
    console.log('error', error.message)  
    res.status(500).json({
      message: 'something went wrong',
      errorMessage: error.message  
     })
   }
});

app.listen(port, async (req, res) => {  
  await initMySQL()
  console.log('Http Server is running on port ' + port);
});
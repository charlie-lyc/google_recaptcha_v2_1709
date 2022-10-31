require('dotenv').config()
const express = require('express')
const axios = require('axios')
const path = require('path')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.post('/subscribe', async (req, res) => {
    // console.log(req.body)
    if (!req.body.captcha || req.body.captcha === undefined || req.body.captcha === '') {
        return res.status(200).json({ 
            success: false,
            msg: 'Please select captcha.' 
        })
    }

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${req.body.captcha}&remoteip=${req.socket.remoteAddress}`
    try {
        const { data } = await axios(verifyUrl)
        // console.log(data)
        if (data.success !== undefined && !data.success) {
            return res.status(200).json({ 
                success: false,
                msg: 'Failed captcha verification.' 
            })
        }
        res.status(200).json({ 
            success: data.success,
            msg: 'Captcha passed.' 
        })
    } catch (error) {
        console.log(error)
    }
})

const port = 3001
app.listen(port, () => {
    console.log(`Server started on port ${port}.`)
})
const cors = require('cors')
const express = require('express')
const auth = require('../auth')();

const router = express.Router()

router.use(cors({
    origin: '*',
    methods: 'GET,PUT',
    allowedHeaders: 'Access-Control-Allow-Origin,X-Api-Key,Content-Type,Accept,Accept-Encoding,Accept-Language,Origin,Referer,User-Agent,Authorization',
    exposedHeaders: 'X-Pagination-Limit,X-Pagination-Offset,X-Pagination-rowCount,X-Pagination-pageCount',
}))
router.use('/signin', require('./signin'));
router.use('/login', require('./login'));
router.use('/items', auth.authenticate(), require('./items'));
router.use('/tags', auth.authenticate(), require('./tags'));

module.exports = router
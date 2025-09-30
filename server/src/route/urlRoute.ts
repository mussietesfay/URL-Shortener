
import express from 'express';

const router = express.Router();

import {shortenUrl , getOriginalUrl , listUrls} from '../controllers/urlController.js'


router.post('/v1/shorten', shortenUrl);
router.get('/v1/url/:shortUrl', getOriginalUrl)
router.get('/v1/urls', listUrls);



export default router;

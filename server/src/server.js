// @flow

import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Cases } from './models.js';

type Request = express$Request;
type Response = express$Response;

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json()); // For parsing application/json

app.get('/cases', (req: Request, res: Response) => {
  return Cases.findAll().then(cases => res.send(cases));
});

app.get('/cases/:id', (req: Request, res: Response) => {
    return Cases.findOne({ where: { id: Number(req.params.id) } }).then(
    casex => (casex ? res.send(casex) : res.sendStatus(404))
  );
});

app.put('/cases', (req: Request, res: Response) => {
  if (
    !req.body ||
    typeof req.body.id != 'number' ||
    typeof req.body.title != 'string' ||
    typeof req.body.text != 'string' ||
    typeof req.body.img != 'string' ||
        typeof req.body.category != 'number' ||
        typeof req.body.importance != 'number'
  )
    return res.sendStatus(400);

  return Cases.update(
    { title: req.body.title, text: req.body.text, img: req.body.img, category: req.body.category, importance: req.body.importance},
    { where: { id: req.body.id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

app.post('/cases', (req: Request, res: Response) => {
    return Cases.create({
        title: req.body.title,
        text : req.body.text,
        img : req.body.img,
        category : req.body.category,
        importance : req.body.importance
    }).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

// Hot reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

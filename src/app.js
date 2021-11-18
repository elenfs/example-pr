import express from 'express';
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Started on port 3000')
});

export default app

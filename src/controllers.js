import { Connection } from './models';
import app from './app';
import { auth } from '@googleapis/gmail';

app.post('/get-authentication-url', (req, res) => {
  var oauth2Client = new auth.OAuth2(
    'realGoogleClientId',
    'realGoogleClientSecret',
    'http://some.url/callback'
  );

  var state;
  if (req.query.state.length) {
    state = req.query.state;
  }

  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly'
    ],
    prompt: 'consent',
    state: state
  });

  res.set({ 'Content-Type': 'application/json' });
  res.status(200).send({
    status: 'OK',
    data: url
  });
})

app.patch('/create_connection/:currentUserId', (req, res) => {
  if (typeof req.body.code != 'string') {
    res.set({ 'Content-Type': 'application/json' });
    res.status(500).send({
      status: 'ERROR',
      data: 'code param is missing'
    })
  }

  const oauth2Client = new auth.OAuth2(
    'realGoogleClientId',
    'realGoogleClientSecret',
    'http://some.url/callback'
  );

  oauth2Client.getToken(req.body.code, async (err, token) => {
    if (err) {
      res.set({ 'Content-Type': 'application/json' });
      res.status(500).send({
        status: 'ERROR',
        data: 'failed to get token'
      });
    }

    await Connection.create({
      token: token.refresh_token,
      userId: req.params.currentUserId
    });

    res.set({ 'Content-Type': 'application/json' });
    res.status(200).send({
      status: 'OK',
      data: 'successfully created a connection'
    })
  });
});

# Express + PostgreSQL starter

[![Deploy to Uppcoder](deploy-to-uppcoder.svg)](https://portal.uppcoder.com/cust-portal/deploy?starter=express-postgresql-starter&utm_source=github&utm_medium=repo&utm_campaign=express-starter)

A small Express app on PostgreSQL, ready to deploy: a notes API with create,
list and delete, and its table created on startup. The database comes from one
environment variable, `DATABASE_URL`, so no password sits in the code.

| Endpoint | What it does |
|---|---|
| `GET /` | Says whether the database is connected |
| `GET /status` | Runs a query and returns the PostgreSQL version |
| `GET /notes` | Lists the notes |
| `POST /notes` | Adds one: `{"text": "..."}` |
| `DELETE /notes/:id` | Deletes one |

## Deploy it on Uppcoder (free plan)

[Uppcoder](https://portal.uppcoder.com/developers?utm_source=github&utm_medium=repo&utm_campaign=express-starter)
runs it on its own HTTPS address with a real PostgreSQL database and VS Code in
the browser beside it.
The free plan (Spark) has no card and no time limit, and the app and its database
are backed up every night to a separate server.

Press the button above: it opens Uppcoder's deploy page with this starter and PostgreSQL filled in. New to Uppcoder? Sign up there, confirm your email, and start the free plan (Spark) in one click on the same page. Or set it up by hand:

1. Sign up at portal.uppcoder.com, confirm your email, then Billing, Spark, Start free.
2. Stacks, Create, Blank stack. Pick **Express**, then add **PostgreSQL**: it is
   connected to the app automatically.
3. On the Express card, under Git repository, paste
   `https://github.com/Uppcoder/express-postgresql-starter` (branch `main`).
4. Deploy. Uppcoder clones the repository, runs `npm install`, sets `DATABASE_URL`
   and `PORT` and starts the app with `node index.js`.
   Open the app's address and `/status` shows the database.

The full walk-through, with pictures:
[Deploy an Express app with PostgreSQL, free](https://portal.uppcoder.com/guides/deploy-express-postgresql?utm_source=github&utm_medium=repo&utm_campaign=express-starter).

To start from your own copy, fork this repository first and paste your fork's
address instead.

## Bringing your own Express app

Uppcoder starts the first of these it finds: `index.js`, the file named in
`package.json` `"main"`, `server.js`, `app.js`, `src/index.js`, else `npm start`.
Listen on `process.env.PORT`, as almost every Express tutorial already does. One path is taken: `/health` is answered by the platform itself (its health check), so give your own status route another name.

## Run it on your own machine

With Docker:

```bash
docker compose up
```

Then open http://localhost:8000/notes. Compose starts PostgreSQL 16 beside the
app and sets `DATABASE_URL` for it.

Without Docker, point `DATABASE_URL` at any PostgreSQL database:

```bash
npm install
export DATABASE_URL=postgresql://user:password@localhost:5432/mydb
node index.js
```

## License

MIT

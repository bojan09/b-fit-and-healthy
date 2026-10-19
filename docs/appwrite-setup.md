# Appwrite setup

The application uses Appwrite for authentication and user data. It starts with an empty database; no previous records are imported. The project endpoint and ID are in `.env.example`. Copy that file to `.env.local`, then add your local provider keys.

## Create the database

1. In the Appwrite Console, open project `6ac945000038e9b28df4` and enable Email/Password plus Google under Auth.
2. Add `localhost` and your deployed host to the project's allowed platforms/domains. Configure Google OAuth credentials in Appwrite and use the callback URL shown in the Appwrite Console in Google Cloud.
3. Create a server API key called Database setup with database, table, column, and index write scopes. Put it in `APPWRITE_SETUP_API_KEY` in `.env.local`. Do not expose it with a `NEXT_PUBLIC_` name.
4. Set `APPWRITE_DATABASE_ID=bfit-health` or choose another valid database ID. Run `npm run appwrite:setup`. The script creates the database, 31 TablesDB tables, fields, indexes, and row-level security. It is safe to rerun after a partial setup; conflicts are left in place. It does not create or import user records.
5. Create a separate runtime API key with the session scope needed by the Google OAuth callback and set `APPWRITE_API_KEY`. The application does not use an admin key for ordinary table queries; those run through the user's Appwrite session. Remove the setup key after the schema is ready.

## Data access

All private tables use row security. Writes include owner permissions tied to the authenticated Appwrite user. Public reference tables are read-only to the app's user paths; curated exercises, recipes, and foods also have local bundled catalogues so a fresh database can be used immediately. External provider results are stored as user-owned snapshots.

TablesDB does not reproduce PostgreSQL foreign keys, triggers, or transaction behavior. The application validates mutations and checks ownership in server actions; workflows with multiple writes use compensating cleanup where possible. Review those limits before adding new multi-table workflows.

## Authentication callbacks

Register these application callback URLs in Appwrite's allowed redirect URLs: `http://localhost:3000/auth/callback` and the equivalent production URL. Google's provider callback is the Appwrite URL shown in the Console. Email verification and password recovery use the application callback route.

The app stores Appwrite session secrets in project-scoped, HttpOnly, SameSite cookies. Use HTTPS in production. Google's OAuth callback exchanges its short-lived secret using the server runtime API key.

## Scheduled retention

Assistant history is hidden after 30 days. To physically remove expired conversations and their messages, schedule `npm run appwrite:cleanup:assistant` daily on a trusted server. It uses `APPWRITE_API_KEY`; grant only the TablesDB row read/write scopes needed for the two assistant tables, and keep that key server-only. Do not run the cleanup command from a browser or user-facing route.

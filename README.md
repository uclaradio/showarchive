# UCLA RADIO ARCHIVE
This is the repo for the [UCLA Radio](https://uclaradio.com/).

To get started, make sure you have git, Node.js, and npm all installed and configured.

In the desired location that you want to locally store your app, run the following in your terminal:

### `git clone https://github.com/uclaradio/showarchive.git`

In order to access the app make sure to 

### `cd showarchive`

then to run the app do

### `npm run dev`

---

## Deploying to Vercel

The build uses **Firebase Admin** (Firestore) in `getStaticProps` / `getStaticPaths`. You must set these **server-side** environment variables in your Vercel project:

1. **Vercel Dashboard** → your project → **Settings** → **Environment Variables**.

2. Add these for **Production** (and Preview if you want):

   | Name | Description |
   |------|-------------|
   | `FIREBASE_PROJECT_ID` | Your Firebase project ID (e.g. `ucla-radio-show-archive`) |
   | `FIREBASE_CLIENT_EMAIL` | Service account email from Firebase Console → Project Settings → Service Accounts |
   | `FIREBASE_PRIVATE_KEY` | Service account private key (full key including `-----BEGIN PRIVATE KEY-----` / `-----END PRIVATE KEY-----`). In Vercel you can paste the key with real newlines, or use `\n` for line breaks; the app will normalize `\n` automatically. |

3. Get the values from **Firebase Console** → Project Settings → **Service accounts** → **Generate new private key**, then use the `project_id`, `client_email`, and `private_key` from the downloaded JSON.

4. Redeploy after saving the variables (or trigger a new deployment).

Without these, the build fails with `16 UNAUTHENTICATED` when fetching show/episode data from Firestore.

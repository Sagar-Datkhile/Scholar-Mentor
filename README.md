## Supabase Setup

Create a project in Supabase and set the following environment variables in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://jtnskbtidkuknbiztbrs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bnNrYnRpZGt1a25iaXp0YnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4ODQzMzgsImV4cCI6MjA3MzQ2MDMzOH0.rhlig30Pz7o1Mx3oZixJKmPgl3L2OsL9BRZb2h-9Smw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bnNrYnRpZGt1a25iaXp0YnJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzg4NDMzOCwiZXhwIjoyMDczNDYwMzM4fQ.wh1GpiPcKB8tUwLcEuedc0S4oyXcw8tCKPHTq5BWnEM
```

Apply the database schema to your Supabase project:

```
# Install the Supabase CLI if needed: https://supabase.com/docs/guides/cli
supabase db reset --local # optional for local dev
# Or copy and run the SQL in supabase/schema.sql in the Supabase SQL editor
```

Use the prebuilt clients:

- `lib/supabaseClient.ts` for browser/server client with anon key
- `lib/supabaseAdmin.ts` for server-side admin operations (service role)

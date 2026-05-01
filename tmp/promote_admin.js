const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');

// Read env manually with more robust parsing
const env = fs.readFileSync('.env', 'utf8');
const envVars = {};
env.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*(NEXT_PUBLIC_SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY)\s*=\s*(.+?)\s*$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const key = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!url || !key) {
  console.error("ERROR: Missing URL or Key in .env", { url: !!url, key: !!key });
  process.exit(1);
}

(async () => {
  const supabase = createClient(url, key);
  
  // 1. Get User by Email
  const { data: users, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error("AUTH_ERROR:", authError.message);
    process.exit(1);
  }

  const targetEmail = "olabodesamuel0920@gmail.com";
  const user = (users?.users || []).find(u => u.email === targetEmail);
  if (!user) {
    console.log("USER_NOT_FOUND: Please sign up (register) on the platform first at " + targetEmail);
    process.exit(0);
  }

  // 2. Update Profile to Admin
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", user.id);

  if (profileError) {
    console.error("PROFILE_ERROR (Maybe combined_migrations.sql hasn't been run in the SQL Editor yet?):", profileError.message);
    process.exit(1);
  }

  console.log("SUCCESS: User " + user.email + " prompted to ADMIN.");
})().catch(e => {
  console.error("FATAL_ERROR", e.message);
  process.exit(1);
});

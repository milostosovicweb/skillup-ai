import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
'https://hhhtkdjmjyfjlnycjkyl.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaHRrZGptanlmamxueWNqa3lsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTUzNTg0NiwiZXhwIjoyMDYxMTExODQ2fQ.ZSQcbvspDgGit1_6zJuVSk4wXSad2LgFP4GPJSQL9qE'
);

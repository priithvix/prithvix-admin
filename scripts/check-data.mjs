import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
  const { data, error } = await supabase.from('registrations').select('*');
  if (error) console.error(error);
  console.log('Total registrations:', data?.length);
  if (data?.length) {
    console.log('Sample data:', data[0]);
  }
}

checkData();

import { createClient } from '@supabase/supabase-js'

//supabase keys stored in secret env file.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY

export const supabase = createClient(supabaseUrl, supabaseApiKey)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://giokdgrpwuqlpzttthcm.supabase.co'
const supabaseAnonKey = 'sb_publishable_q4xQA6Zpia5_97XV4MDWwQ_gbvoJwH-'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
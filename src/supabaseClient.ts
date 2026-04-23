import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://giokdgrpwuqlpzttthcm.supabase.co'
const supabaseKey = 'sb_publishable_q4xQA6Zpia5_97XV4MDWwQ_gbvoJwH-' 

export const supabase = createClient(supabaseUrl, supabaseKey)
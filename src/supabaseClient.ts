import { createClient } from '@supabase/supabase-js'

// 这是你的云端数据库地址
const supabaseUrl = 'https://giokdgrpwuqlpzttthcm.supabase.co'
// 这是你刚才发给我的 Anon Key
const supabaseKey = 'sb_publishable_q4xQA6Zpia5_97XV4MDWwQ_gbvoJwH-' 

export const supabase = createClient(supabaseUrl, supabaseKey)
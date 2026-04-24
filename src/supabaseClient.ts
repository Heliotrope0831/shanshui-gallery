import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://giokdgrpwuqlpzttthcm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpb2tkZ3Jwd3VxbHB6dHR0aGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MzgyMTIsImV4cCI6MjA5MjQxNDIxMn0.X51HGryN8HynJLjKNxjCakvGl4eChXUtgbQv7rM-KIA' 

export const supabase = createClient(supabaseUrl, supabaseKey)
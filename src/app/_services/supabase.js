import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ejllotfoygfoenzrkpsb.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbGxvdGZveWdmb2VuenJrcHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzEzOTksImV4cCI6MjA3NzUwNzM5OX0.PlaFvBozz2mm5s83yU5QEn1oXuMqF5nKIuZvy_dmlmA"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
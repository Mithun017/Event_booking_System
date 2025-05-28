const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vbcwnlukyewnkhfhciuj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiY3dubHVreWV3bmtoZmhjaXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTczMzcsImV4cCI6MjA2Mzk5MzMzN30.zQbxZo-nePoaTL-kKunOuUsHUnLB6tYS7nl1na7ALBY';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };

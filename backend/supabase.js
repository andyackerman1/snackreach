// Supabase client configuration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pplhyetnwyywucdxwkbu.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwbGh5ZXRud3l5d3VjZHh3a2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODYzODEsImV4cCI6MjA3Nzk2MjM4MX0.UkypAjm_eXDjiPUH59fh4T5hYgCg3F9H2aFP4aR2-4o';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test connection
async function testConnection() {
    try {
        // Simple connection test - just ping Supabase
        const { data, error } = await supabase.from('users').select('id').limit(1);
        if (error && error.code === 'PGRST116') {
            // Table doesn't exist yet - that's OK, connection works
            console.log('✅ Supabase connected (table not created yet - run SQL schema)');
            return true;
        } else if (error) {
            console.error('❌ Supabase connection error:', error.message);
            return false;
        }
        console.log('✅ Supabase connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return false;
    }
}

module.exports = {
    supabase,
    testConnection
};


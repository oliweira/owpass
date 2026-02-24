// src/services/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jjbnezedpzzwppyshirh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYm5lemVkcHp6d3BweXNoaXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MzM2MDYsImV4cCI6MjA4NzUwOTYwNn0.jg5RV_SVLpCxpM2hU-b7rWAjTQVLkjjEfYL-rlVGZUI";

export const supabase = createClient(supabaseUrl, supabaseKey);

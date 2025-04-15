const supabase = supabase.createClient(
    'https://naecognnktiibvkwfhks.supabase.co',     // Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZWNvZ25ua3RpaWJ2a3dmaGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTY0NzYsImV4cCI6MjA2MDI3MjQ3Nn0.r1IGt9Hx4-dr4lWpP0b9XX-pwoVRjzlMyys_IVZ8opY'                 // Public anon key
  );
  

//   Real time authentication 
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      console.log("User signed in:", session.user.email);
    }
    if (event === "SIGNED_OUT") {
      console.log("User signed out");
    }
  });
  

  const channel = supabase
  .channel('public:user_profiles')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'user_profiles',
    },
    (payload) => {
      console.log('Change received!', payload);
      // You can update the UI in realtime here
    }
  )
  .subscribe();

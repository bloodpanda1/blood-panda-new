

async function testInvite() {
  const email = 'coo@bloodpanda.com';
  
  console.log(`Triggering admin onboarding (password reset) for ${email}...`);
  
  // We trigger the forgetPassword API which will call the sendResetPassword callback
  // and log the onboarding link to the console for testing.
  try {
    const res = await fetch('http://localhost:3000/api/auth/forget-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        redirectTo: 'http://localhost:3000/reset-password'
      })
    })
    const data = await res.text()
    console.log('Response Status:', res.status)
    console.log('Response:', data)
    console.log('✅ Success! Check the terminal running the dev server for the reset link.')
  } catch (error) {
    console.error('Error triggering invite:', error)
  }
}

testInvite().catch(console.error);

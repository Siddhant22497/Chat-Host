/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/App.js",
          "./src/Login.js",
          "./src/SignUp.js",
        "./src/Homescreen.js",
        "./src/components/Leftbar.js",
        "./src/components/Chat.js",  
        "./src/components/Users.js",        
      ],
  theme: {
    extend: {
      screens: {
        tablet: {max:"1043px"}, 
      },
      height:{
        100:'400px',
        110:'460rem',
        120:'493px'
      },
      left:{
        100:'20rem'
      },
      margin:{
        18:'72px'
      },
      width:{
        192:'48rem',
        98:'498px',
        100:'550px',
        115:'570px',
        120:'574px',
        150:'650px',
        160:'50rem',
        88:'510px'
      }
    },
  },
  plugins: [],
}


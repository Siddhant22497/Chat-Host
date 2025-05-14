import './App.css';
import { React } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import dark_mode from './assets/dark_mode.png';
import light_mode from './assets/light_mode.png';


function SignUp({ isDarkMode, setDarkMode }) {
  const switchMode = () => {

    const submit_id = document.getElementById("submit_id");
    if (!isDarkMode) {

      submit_id.classList.remove("bg-green-500");
      submit_id.classList.add("bg-gray-500");
    }
    else {
      submit_id.classList.remove("bg-gray-500");
      submit_id.classList.add("bg-green-500");
    }
    setDarkMode(!isDarkMode);
  }
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");

  const navigate = useNavigate();


  const submitData = async (e) => {

    e.preventDefault();
    const resultElement = document.getElementById("result");

    if (password !== repassword) {
      resultElement.textContent = "Password and Re-enter Password do not match.";
      return;
    }

    if (username.length === 0) {
      resultElement.textContent = "Username is empty.";
      return;
    }

    if (password.length === 0) {
      resultElement.textContent = "Password cannot be empty.";
      return;
    }

    if (username.length > 24) {
      resultElement.textContent = "Username must be 24 characters or less.";
      return;
    }


    const response1 = await fetch(`https://chat-host-mern.onrender.com/tosignup/signup`, {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json',
      },
    });


    const data = await response1.json();

    if (response1.status === 409) {
      resultElement.textContent = "Username already exists. Try a different one!";
      return;
    }

    if (response1.status !== 200) {
      resultElement.textContent = "An error occurred while checking the username.";
      return;
    }

    
    const response2 = await fetch(`https://chat-host-mern.onrender.com/tosignup/signupnow`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response2.status === 201) {
      resultElement.textContent = "User created successfully!";
      setTimeout(() => {
        resultElement.textContent = "";
        navigate('/Homescreen', { state: { username, isDarkMode } });
      }, 1000);
    } else {
      resultElement.textContent = "Failed to create user. Please try again.";
    }

  }
  return (
    <>
      <div id="main_login" className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
        <h1 className='pt-[2vh]'>
          {isDarkMode == false ?
            (<span className='relative pt-[0.5vh] hover:scale-110 float-right right-[15vw]  tablet:left-[10vw]'>
              <button onClick={() => switchMode()} alt="light mpde"  >
                <img src={dark_mode} style={{ height: "10vh" }} alt="dark mode" />

              </button>
            </span>)
            :
            (<span className='relative pt-[0.5vh] hover:scale-110 float-right   right-[15vw] tablet:left-[10vw]'>
              <button onClick={() => switchMode()} alt="dark mode">
                <img src={light_mode} style={{ height: "10vh" }} alt="light mode" />

              </button>
            </span>)}
          <span className='hover:scale-110 relative float-right tablet:left-[10vw]'>
            <a href="https://github.com/Siddhant22497/Chat-Host" target="_blank">
              <img src={!isDarkMode ? "/dark_mode.png" : "light_mode.png"} alt="GitHub Logo" className="h-[10vh]" />
            </a>
          </span>
        </h1>
        <br></br>
        <div className="flex items-center justify-center mt-[10vh]">
          <div>
            <form action="" id="form_login" className='border-t-4 border-r-4 border-b-4 box-content border-l-4  border-black h-[70vh] w-[25vw] tablet:w-[50vw]'>
              <p className='mt-[2vh] flex justify-center text-[3xl] mb-[3.5vh]'>SignUp</p>
              <label htmlFor="name_id" className='ml-[2vw] text-[3vh]'>Username</label> <br />
              <input className={`h-[5vh] ml-[2vw] text-[3vh] border-4 mt-[1vh] tablet:w-[45vw] w-[20vw] rounded-md ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray"
                }`} required="required" type="text" id="name_id" placeholder={username.length === 0 ? `Enter your Username` : username} onChange={(e) => setUsername(e.target.value)} />
              <br />
              <label htmlFor="password_id" className='ml-[2vw] text-[3vh]' >Password</label> <br />
              <input className={`h-[5vh] ml-[2vw] text-[3vh] border-4 mt-[1vh] tablet:w-[45vw] w-[20vw] rounded-md ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray"
                }`} required="required" type="password" name="password_name" id="password_id" placeholder={password.length === 0 ? `Enter your Password` : password} onChange={(e) => setPassword(e.target.value)} />
              <label htmlFor="re-password_id" className='ml-[2vw] text-[3vh]' >Re-Password</label> <br />
              <input className={`h-[5vh] ml-[2vw] text-[3vh] border-4 mt-[1vh] tablet:w-[45vw] w-[20vw] rounded-md ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray"
                }`} required="required" type="password" name="re-password_name" id="re-password_id" placeholder={repassword.length === 0 ? `Enter your Password` : repassword} onChange={(e) => setRePassword(e.target.value)} />
              <button onClick={(e) => submitData(e)} className={`${!isDarkMode ? "bg-green-500" : "bg-gray-500"}  hover:scale-105 rounded-xl  mt-[3vh] ml-[2vw] tablet:w-[45vw]  text-[3vh] w-[20vw] h-[7vh]"`} id="submit_id">Sign Up</button>
              <p className='mt-[1.5vh] mx-auto text-[2vh] tablet:w-[50vw] w-[20vw] flex justify-center'>Already have an account?<Link to="/" className='underline'>Login</Link></p>
              <p id='result' className={`${!isDarkMode ? "text-red-700" : "text-white"}  mx-auto mt-[1vh] text-[2.3vh] flex justify-center`}></p>

            </form>
          </div>
          <div className="flex items-center box-content border-t-4 border-r-4 border-b-4  border-black border h-[70vh] w-[25vw] tablet:hidden text-[2.3vh] tablet:text-sm text-center ">


                       Chat Host is built using React.js for the frontend, with Tailwind CSS for styling and creating responsive layouts. On the backend, Express handles client-server operations, while MongoDB is used for storing schemas, including users, individual messages, and group messages. Socket.io is implemented for real-time communication. crypto is used for cryptography, and bcrypt is used for password hashing.
          </div>
        </div >
      </div>
    </>
  );
}

export default SignUp;


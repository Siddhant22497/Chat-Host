import './App.css';
import { React } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dark_mode from './assets/dark_mode.png';
import light_mode from './assets/light_mode.png';



function Login({ isDarkMode, setDarkMode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();


  const callSubmit = async (e) => {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) {
      let ele = document.getElementById('result');
      ele.textContent = "UserName or Password is empty."
      return;
    }
    else {
      let ele = document.getElementById('result');
      ele.textContent = "";
    }

    const resultElement = document.getElementById("result");
    try {
      const response = await fetch(`https://chat-host-mern.onrender.com/tologin`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.status === 200) {
        resultElement.textContent = "Login successful.";
        setTimeout(() => {
          navigate('/Homescreen', { state: { username, isDarkMode } });
        }, 1000);
      } else if (response.status === 404) {
        resultElement.textContent = "User not found.";
      } else if (response.status === 401) {
        resultElement.textContent = "Invalid password.";
      }
      else {
        resultElement.textContent = "An error occurred. Please try again.";
      }
    } catch (error) {
      console.error("Error during login:", error);
      resultElement.textContent = "Failed to connect to the server.";
    }
  };

  
  const switchMode = () => {


    const submit_id = document.getElementById("submit_id");
    if (!isDarkMode) {

      submit_id.classList.remove("bg-blue-500");
      submit_id.classList.add("bg-gray-500");
    }
    else {
      submit_id.classList.remove("bg-gray-500");
      submit_id.classList.add("bg-blue-500");
    }

    setDarkMode(!isDarkMode);
  }
  return (
    <>
      <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
        <h1 className='pt-[2vh]'>
          {isDarkMode == false ?
            (<span className=' relative float-right right-[15vw] pt-[0.5vh]  tablet:left-[10vw]'>
              <button onClick={() => switchMode()} >
                <img src={dark_mode} style={{ height: "10vh" }} alt="dark mode" />

              </button>
            </span>)
            :
            (<span className='relative float-right pt-[0.5vh] right-[15vw] tablet:left-[10vw]'>
              <button onClick={() => switchMode()} alt="dark mode">
                <img src={light_mode} style={{ height: "10vh" }} alt="light mode" />

              </button>
            </span>)}
          <span className='hover:scale-110 relative float-right  tablet:left-[10vw]'>
            <a href="https://github.com/Siddhant22497/Chat-Host" target="_blank">
              <img src={!isDarkMode ? "/dark_mode.png" : "/light_mode.png"} alt="GitHub Logo" className="h-[10vh]" />
            </a>
          </span>
        </h1>
        <br></br>
        <div className="flex items-center justify-center mt-[10vh]  " style={{}}>



          <div className="flex items-center border-t-4 border-l-4 border-b-4 box-content  border-black border h-[70vh] w-[25vw] tablet:hidden text-[2.3vh] tablet:text-sm text-center  ">


            Chat Host is built using React.js for the frontend, with Tailwind CSS for styling and creating responsive layouts. On the backend, Express handles client-server operations, while MongoDB is used for storing schemas, including users, individual messages, and group messages. Socket.io is implemented for real-time communication. crypto is used for cryptography, and bcrypt is used for password hashing.

          </div>
          <div className='box-content'>
            <form action="" id="form_login" className='border-t-4 border-r-4 border-b-4 border-l-4  border-black h-[71.5vh] w-[25vw] tablet:w-[50vw]'>
              <p className='mt-[2vh] flex justify-center text-xl tablet:text-2xl mb-[6vh]'>Login</p>
              <label htmlFor="name_id" className='ml-[2vw] mt-[1vh] text-md tablet:text-sm'>Username</label> <br />
              <input required="required" className={`h-[6vh] rounded-md ml-[2vw] mt-[1vh] tablet:w-[45vw] w-[20vw] border-4 text-[3vh] ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray"
                }`} type="text" id="name_id" placeholder={username.length === 0 ? `Enter your Username` : username} onChange={(e) => setUsername(e.target.value)} />
              <br />
              <label htmlFor="number_id" className='ml-[2vw] text-md tablet:text-sm' >Password</label> <br />
              <input required="required" className={`h-[6vh] rounded-md ml-[2vw] mt-[1vh] tablet:w-[45vw] w-[20vw] border-4 text-[3vh] ${isDarkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray"
                }`} type="password" name="number_name" id="number_id" placeholder={password.length === 0 ? `Enter your Password` : password} onChange={(e) => setPassword(e.target.value)} />
              <br />
              <button className={`${!isDarkMode ? "bg-blue-500" : "bg-gray-500"} rounded-xl hover:scale-105 mt-[2vh] tablet:w-[45vw] ml-[2vw] w-[20vw] h-[7vh]`} id="submit_id" onClick={(e) => callSubmit(e)}>Log In</button>
              <p className='mt-[2vh] mx-auto  flex justify-center text-[2vh]'>Don't have an account?<Link to="/SignUp" className='underline'>Register Here</Link></p>
              <p id='result' className={`${isDarkMode?"text-white":"text-red-700"} mt-[2vh] mx-auto flex justify-center max-tablet:ml-[5vw]  text-[2.3vh] text-white`}></p>
            </form>
          </div>

        </div >
      </div>
    </>
  );
}

export default Login;

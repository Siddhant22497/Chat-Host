import './App.css';
import { React } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();

  const callSubmit = async (e) => {
    e.preventDefault();
    if (username.length == 0 || password.length == 0) {
      let ele = document.getElementById('result');
      ele.textContent = "UserName or Password is empty."
      return;
    }
    else {
      let ele = document.getElementById('result');
      ele.textContent = "";
    }
  
    const response = await fetch('https://chat-host.onrender.com/tologin', {
      method: 'POST',
      body: JSON.stringify({ "username": username, "password": password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    if (data.length == 1) {
      let ele = document.getElementById('result');
      ele.textContent = "Login successful."
      setTimeout(() => {
        navigate('/Homescreen', { state: { "username": username } });
      }, 1000);
    }
    else {
      let ele = document.getElementById('result');
      ele.textContent = "Incorrect username or password."
    }

  }
  return (
    <>
      <div className="flex items-center justify-center h-screen" style={{
        backgroundColor: "#4158D0",
        backgroundImage: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
        backgroundSize: 'cover', backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center'
      }}>
        <div className="flex items-center border-t-4 border-l-4 border-b-4 box-content  border-black border h-[70vh] w-[25vw] tablet:hidden text-[2.3vh] tablet:text-sm text-center ">


        Chat Host is built using React.js for the frontend, with Tailwind CSS for styling and creating responsive layouts. On the backend, Express handles client-server operations, while MongoDB is used for storing schemas, including users, individual messages, and group messages. Socket.io is implemented for real-time communication.

        </div>
        <div  className='box-content'>
          <form action="" id="form_login" className='border-t-4 border-r-4 border-b-4 border-l-4  border-black h-[71.1vh] w-[25vw] tablet:w-[50vw]'>
            <p className='mt-[2vh] flex justify-center text-xl tablet:text-2xl mb-[6vh]'>Login</p>
            <label htmlFor="name_id" className='ml-[2vw] mt-[1vh] text-md tablet:text-sm'>Username</label> <br />
            <input required="required" className='h-[6vh] rounded-md ml-[2vw] mt-[1vh] tablet:w-[45vw] w-[20vw] border-4 border-gray text-[3vh]   rounded-md ' type="text" id="name_id" placeholder={username.length == 0 ? `Enter your Username` : username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label htmlFor="number_id" className='ml-[2vw] text-md tablet:text-sm' >Password</label> <br />
            <input required="required" className='h-[6vh]  rounded-md  ml-[2vw] tablet:w-[45vw] mt-[1vh] border-4 border-gray text-[3vh] w-[20vw] ' type="password" name="number_name" id="number_id" placeholder={password.length == 0 ? `Enter your Password` : password} onChange={(e) => setPassword(e.target.value)} />
            <br />
            <button className="bg-blue-500 rounded-xl hover:bg-blue-700 hover:scale-105 mt-[2vh] tablet:w-[45vw] ml-[2vw] w-[20vw] h-[7vh]" onClick={(e) => callSubmit(e)}>Log In</button>
            <p className='mt-[2vh] mx-auto  flex justify-center text-[2vh]'>Don't have an account?<Link to="/SignUp" className='underline'>Register Here</Link></p>
            <p id='result'className="mt-[2vh] mx-auto flex justify-center max-tablet:ml-[5vw]  text-[2.3vh] text-white"></p>

          </form>
        </div>

      </div >
    </>
  );
}

export default Login;

import './App.css';
import { React } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';


function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");

  const navigate = useNavigate();


  const submitData = async (e) => {
    e.preventDefault();
    if (password != repassword) {
      const result = document.getElementById("result")
      result.textContent = "Password and Re Enter Password not match"
      return;
    }
    if (username.length == 0) {
      const result = document.getElementById("result")
      result.textContent = "Username is empty"
      return;
    }
    else {
      const result = document.getElementById("result")
      result.textContent = ""
    }
    const response1 = await fetch(`${process.env.REACT_APP_BACKEND_PORT}/tosignup/signup`, {
      method: 'POST',
      body: JSON.stringify({ "username": username }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response1.json();
    const length = data.length;
    if (length == 1) {
      const result = document.getElementById("result")
      result.className = "text-red-600 ml-12";
      result.textContent = "Username already exists. Try different!";
      return;
    }
    const res = await fetch(`${process.env.REACT_APP_BACKEND_PORT}/tofetchgroup/checkgroupexist`, {
      method: 'POST',
      body: JSON.stringify({
        "groupname": username
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const res2 = await res.json();
    if (res2.flag == "true") {
      const result = document.getElementById("result")
      result.className = "text-red-600 ml-12";
      result.textContent = "Username already exists. Please try a different one.";
      return;
    }
    if(password.length==0)
    {
      const result = document.getElementById("result")
      result.className = "text-red-600 ml-12";
      result.textContent = "Password or Confirm Password cannot be empty.";
      return;  
    }
    if(username.length>24)
    {
      const result = document.getElementById("result")
      result.className = "text-red-600 ml-12";
      result.textContent = "Username must be 24 characters or less.";
      return; 
    }

    const result = document.getElementById("result");
    result.className = "text-red-600 ml-24";
    result.textContent = "Details saved successfully.";
    const response2 = await fetch(`${process.env.REACT_APP_BACKEND_PORT}/tosignup/signupnow`, {
      method: 'POST',
      body: JSON.stringify({ "username": username, "password": password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    setTimeout(() => {
      navigate('/Homescreen', { state: { username: username, password: password } });
    }, 1000);

  }
  return (
    <>
      <div className="flex items-center justify-center h-screen" style={{
        backgroundColor: "#FBDA61",
        backgroundImage: "linear-gradient(45deg, #FBDA61 0%, #FF5ACD 100%)",
        backgroundSize: 'cover', backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}>
        <div>
          <form action="" id="form_login" className='border-t-4 border-r-4 border-b-4 box-content border-l-4  border-black h-[70vh] w-[25vw] tablet:w-[50vw]'>
            <p className='mt-[2vh] flex justify-center text-[3xl] mb-[3.5vh]'>SignUp</p>
            <label htmlFor="name_id" className='ml-[2vw] text-[3vh]'>Username</label> <br />
            <input className='h-[5vh] ml-[2vw] text-[3vh] mt-[1vh] tablet:w-[45vw] w-[20vw] rounded-md  ' required="required" type="text" id="name_id" placeholder={username.length == 0 ? `Enter your Username` : username} onChange={(e) => setUsername(e.target.value)} />
            <br />
            <label htmlFor="password_id" className='ml-[2vw] text-[3vh]' >Password</label> <br />
            <input className='h-[5vh] ml-[2vw] text-[3vh] mt-[1vh] tablet:w-[45vw] w-[20vw] rounded-md ' required="required" type="password" name="password_name" id="password_id" placeholder={password.length == 0 ? `Enter your Password` : password} onChange={(e) => setPassword(e.target.value)} />
            <label htmlFor="re-password_id" className='ml-[2vw] text-[3vh]' >Re-Password</label> <br />
            <input className='h-[5vh] ml-[2vw] text-[3vh]  mt-[1vh]  tablet:w-[45vw] w-[20vw] rounded-md ' required="required" type="password" name="re-password_name" id="re-password_id" placeholder={repassword.length == 0 ? `Enter your Password` : repassword} onChange={(e) => setRePassword(e.target.value)} />
            <button onClick={(e) => submitData(e)} className="bg-green-500 hover:bg-green-700 hover:scale-105 rounded-xl  mt-[3vh] ml-[2vw] tablet:w-[45vw]  text-[3vh] w-[20vw] h-[5vh]">Sign Up</button>
            <p className='mt-[1.5vh] mx-auto text-[2vh] tablet:w-[50vw] w-[20vw] flex justify-center'>Already have an account?<Link to="/" className='underline'>Login</Link></p>
            <p id='result' className='text-black mx-auto mt-[1vh] text-[2.3vh] flex justify-center'></p>

          </form>
        </div>
        <div className="flex items-center box-content border-t-4 border-r-4 border-b-4  border-black border h-[70vh] w-[25vw] tablet:hidden text-[2.3vh] tablet:text-sm text-center ">

        
        Chat Host is built using React.js for the frontend, with Tailwind CSS for styling and creating responsive layouts. On the backend, Express handles client-server operations, while MongoDB is used for storing schemas, including users, individual messages, and group messages. Socket.io is implemented for real-time communication.

        </div>
      </div >
    </>
  );
}

export default SignUp;

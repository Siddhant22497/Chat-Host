import { React, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const { io } = require("socket.io-client");


const socket = io.connect("https://chat-host.onrender.com")

export default function Homescreen(receiver) {
  const location = useLocation();

  const inputRef = useRef(null);

  const [isgroupchat, setIsgroupchat] = useState(false);

  var username = location.state?.username || "";

  const [searchusersgroup, setSearchUsersgroup] = useState([]);

  const [searchusers, setSearchsUsers] = useState([]);

  const [usersgroupname, setusersgroupname] = useState("");
  const [searchgroupMessages, setsearchGroupMessages] = useState([]);

  const [searchbool, setSearchbool] = useState(false);

  const [mscreen, setMscreen] = useState(true);


  const senderGroupName = useRef("");

  const emptyUsername = () => {
    username = "";
  }



  const [currsendmessage, setCurrsendmessage] = useState({});


  const [groupmessage, setGroupmessage] = useState("");

  const [addgroupModal, setAddgroupModal] = useState(false);


  const [messagetext, setmessagetext] = useState("Type message here");

  const [intial_user_group, setIntial_user_group] = useState([]);

  const [usersingroups, setUsersingroups] = useState([])



  const switchModal = () => {
    setAddgroupModal(!addgroupModal);
    let to_add_group = document.getElementById("to_add_group");
    if (addgroupModal) {

      to_add_group.classList.remove("invisible");
      to_add_group.classList.add("visible");
    } else {

      to_add_group.classList.remove("visible");
      to_add_group.classList.add("invisible");
      setSearchUsersgroup([]);
      setUsersingroups([]);

    }
  }


  const clickOnImage = (event) => {
    const searchimage = document.getElementById('search_image');
    let a = searchimage.attributes['src']
    senderGroupName.current = "";
    setusersgroupname("");
    if (a.nodeValue == '/leftArrow.png') {
      fetchintialusergroup();
      a.nodeValue = '/searchIcon.png';
      setSearchbool(false);
      setMscreen(true);
      setmessagetext("Type message here");
    }
    else {
      a.nodeValue = '/leftArrow.png';
      setSearchbool(true);

      if (inputRef.current) {
        inputRef.current.focus();
      }

    }
    event.stopPropagation();

  }

  const handleContainerClick = (event) => {
    const target = event.target;
    const searchimage = document.getElementById('search_image');
    let a = searchimage.attributes['src']
    const flag = target.classList.contains('searchnot');
  }

  const oninput = async (e) => {
    const value = e.target.value;
    setSearchbool(true);
    senderGroupName.current = "";
    setusersgroupname("");
    if (value.length > 0) {
      const response = await fetch('https://chat-host.onrender.com/togetresult/tofetch', {
        method: 'POST',
        body: JSON.stringify({ "username": value }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      const data_users = data.users
      const data_group = data.groupMessages;

      setSearchsUsers(data_users || []);
      setsearchGroupMessages(data_group || []);
    }
    else {
      setSearchsUsers([]);
      setsearchGroupMessages([]);
    }
  }

  useEffect(() => {
    const handleReceiveMessage = (data) => {

      const currentDate = data.currentDate;
      const currentTime = data.currentTime;
      const sender = data.sender;
      const receiver = data.receiver;
      const textToSend = data.textToSend;


      fetchintialusergroup();

      if (currsendmessage == "") {
        setCurrsendmessage({
          "currentDate": currentDate,
          "currentTime": currentTime,
          "sender": sender,
          "receiver": receiver,
          "textToSend": textToSend
        });


        if (senderGroupName.current == "") return;

        if (isgroupchat == false) {
          if (senderGroupName.current === receiver)
            loadindimess(receiver, senderGroupName.current);
        }
      }
      else if (currsendmessage["currentTime"] != currentTime) {

        setCurrsendmessage({
          "currentDate": currentDate,
          "currentTime": currentTime,
          "sender": sender,
          "receiver": receiver,
          "textToSend": textToSend
        });


        if (senderGroupName.current == "") return;

        if (isgroupchat == false) {
          if (senderGroupName.current === receiver)
            loadindimess(username, receiver);
        }
      }



    };
    const handleGroupReceiveMessage = (data) => {
      const currentDate = data.currentDate;
      const currentTime = data.currentTime;
      const groupname = data.groupname;
      const sender = data.receiver;
      const chat = data.textToSend;


      fetchintialusergroup();

      if (Object.keys(groupmessage).length === 0) {

        setGroupmessage({
          currentDate,
          currentTime,
          groupname,
          sender,
          chat,
        });


        if (senderGroupName.current == "") return;

        if (isgroupchat == true) {
          if (senderGroupName.current == groupname) {
            loadgroupmess(receiver, senderGroupName.current);
          }
        }
      } else if (groupmessage.currentTime !== currentTime) {
        setGroupmessage({
          currentDate,
          currentTime,
          groupname,
          receiver,
          chat,
        });




        if (senderGroupName.current == "") return;

        if (isgroupchat == true) {
          if (senderGroupName.current == groupname) {

            loadgroupmess(receiver, senderGroupName.current);
          }
        }
      }
    };





    socket.on("receive_message", handleReceiveMessage);

    socket.on("receive_group_message", handleGroupReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };


  });





  const startindivimessage = async (e, u2, flag = "false") => {
    setMscreen(false);
    const receiver = username;
    const sender = u2;
    setIsgroupchat(false);
    if (sender == receiver) {
      const t1 = receiver + ' (Self)';

      setusersgroupname(t1);
      senderGroupName.current = t1;

    }
    else {
      setusersgroupname(sender);
      senderGroupName.current = sender;
      if (flag == "true") {
        const identifier1 = receiver + '#' + sender;
        const identifier2 = sender + '#' + receiver;
        socket.emit("join_room", identifier1);
        socket.emit("join_room", identifier2);
      }
    }
    setmessagetext("Type message here");
    loadindimess(receiver, sender);
  }

  const startgroupmessage = async (e, groupname) => {
    setMscreen(false);
    setIsgroupchat(true);
    setmessagetext("Type message here");
    const receiver = username;


    setusersgroupname(groupname);
    senderGroupName.current = groupname;
    loadgroupmess(receiver, groupname);

  }
  const loadgroupmess = async (receiver, groupname) => {
    const response = await fetch('https://chat-host.onrender.com/tofetchgroup/loadgroupmessage', {
      method: 'POST',
      body: JSON.stringify({ "groupname": groupname }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();



    const messageDisplayContainer = document.getElementById("messageDisplay");
    if (messageDisplayContainer != null) {
      messageDisplayContainer.innerHTML = "";
    }


    if (result.length === 0) {
      messageDisplayContainer.innerHTML = "";
      return;
    }
    let lastDate = "28/12/2024";

    result.forEach((currentEle) => {
      const { receiver: messageReceiver, chat, currentDate, currentTime } = currentEle;


      if (currentDate !== lastDate) {
        lastDate = currentDate;
        const dateHeader = document.createElement("h1");
        dateHeader.className = "flex justify-center items-center h-12";

        const dateContainer = document.createElement("span");
        dateContainer.className = "bg-white border-3  border-yellow-700  text-[1.3vw] text-black h-[6vh] w-[6.5vw] py-[1vh] text-center rounded-md";
        dateContainer.innerText = currentDate;

        dateHeader.append(dateContainer);
        messageDisplayContainer.appendChild(dateHeader);
      }

      const messageBubble = document.createElement("div");
      messageBubble.className = `p-3 rounded-lg m-2 max-w-xs w-[20vw] ${username === messageReceiver
        ? "bg-blue-500 text-white self-end ml-auto"
        : "bg-gray-200 text-black self-start mr-auto"
        }`;
      messageBubble.style.marginBottom = "1rem";
      messageBubble.style.minHeight = "10vh";
      messageBubble.style.height = "auto";
      messageBubble.style.display = "flex";
      messageBubble.style.flexDirection = "column";

      const messageWrapper = document.createElement("div");
      messageWrapper.className = "flex flex-col h-auto";

      const receiverText = document.createElement("p");
      receiverText.className = `text-[1.1vw] font-semibold mb-1 ${username === messageReceiver ? "text-white" : "text-black"} break-words`;
      receiverText.innerText = `From: ${messageReceiver}`;

      const messageText = document.createElement("p");
      messageText.className = "text-[1.3vw] mb-1 break-words";
      messageText.innerText = chat;

      const messageDateTime = document.createElement("span");
      messageDateTime.className = `text-[1vw] ${username === messageReceiver
        ? "text-white"
        : "text-black"
        } self-end break-words`;
      messageDateTime.innerHTML = `${currentDate}<br>${currentTime}`;

      messageWrapper.appendChild(receiverText);
      messageWrapper.appendChild(messageText);
      messageWrapper.appendChild(messageDateTime);

      messageBubble.appendChild(messageWrapper);

      messageDisplayContainer.appendChild(messageBubble);

    });

    messageDisplayContainer.scrollTop = messageDisplayContainer.scrollHeight;

  };

  const loadindimess = async (receiver, sender) => {

    const response = await fetch('https://chat-host.onrender.com/tofetchindichat/tofetchindichat', {
      method: 'POST',
      body: JSON.stringify({ "receiver": receiver, "sender": sender }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let messageDisplayContainer = document.getElementById("messageDisplay");
    if (messageDisplayContainer != null)
      messageDisplayContainer.innerHTML = "";
    const result = await response.json();
    if (result.length == 0) {

      messageDisplayContainer.innerHTML = "";
      return;
    }

    result.sort((a, b) => {

      const [dayA, monthA, yearA] = a.currentDate.split('/').map(Number);
      const [dayB, monthB, yearB] = b.currentDate.split('/').map(Number);

      if (yearA !== yearB) return yearA - yearB;
      if (monthA !== monthB) return monthA - monthB;
      if (dayA !== dayB) return dayA - dayB;

      const timeA = a.currentTime.split(':').map(Number);
      const timeB = b.currentTime.split(':').map(Number);


      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
      if (timeA[1] !== timeB[1]) return timeA[1] - timeB[1];
      return timeA[2] - timeB[2];
    });

    let lastDate = "10/12/2024";

    result.forEach((currentEle) => {
      const { chat, currentDate, currentTime, receiver, sender, whichuser } = currentEle;


      if (currentDate !== lastDate) {
        lastDate = currentDate;
        const dateHeader = document.createElement("h1");
        dateHeader.className = "flex justify-center items-center h-12";

        const dateContainer = document.createElement("span");
        dateContainer.className = "bg-white border-3  border-yellow-700  text-[1.3vw] text-black h-[6vh] w-[6.5vw] py-[1vh] text-center rounded-md";
        dateContainer.innerText = currentDate;

        dateHeader.append(dateContainer);
        messageDisplayContainer.appendChild(dateHeader);
      }


      const messageBubble = document.createElement("div");
      messageBubble.className = `p-3 rounded-lg m-2 max-w-xs w-[20vw] ${whichuser === receiver
        ? "bg-blue-500 text-white self-end ml-auto"
        : "bg-gray-200 text-black self-start mr-auto"
        }`;
      messageBubble.style.marginBottom = "1rem";
      messageBubble.style.minHeight = "10vh";
      messageBubble.style.height = "auto";
      messageBubble.style.display = "flex";
      messageBubble.style.flexDirection = "column";



      const messageWrapper = document.createElement("div");
      messageWrapper.className = "flex flex-col";

      const messageText = document.createElement("p");
      messageText.className = "text-[1.3vw] mb-1 break-words";
      messageText.innerText = chat;


      const messageTime = document.createElement("span");
      messageTime.className = `text-[1vw] ${sender === receiver || whichuser == receiver ? "text-white" : "text-black"} self-end`;
      messageTime.innerText = currentTime;




      messageWrapper.appendChild(messageText);
      messageWrapper.appendChild(messageTime);


      messageBubble.appendChild(messageWrapper);

      messageDisplayContainer.appendChild(messageBubble);
    });

    messageDisplayContainer.scrollTop = messageDisplayContainer.scrollHeight;


  };


  const messageBox = async (e, flag = "true") => {
    e.stopPropagation();
    if (flag == "true") {
      if (messagetext == "Type message here") {
        const d = e.target.value;
        const i = d.indexOf('Type message here')
        const m1 = d.substring(i + ('Type message here'.length));
        setmessagetext(m1);
      }
      else if (e.target.value && e.target.value.length > 0) {

        setmessagetext(e.target.value);
      }
      else {

        setmessagetext("Type message here");
      }
    }
    else {
      if (messagetext == "Type message here") {
        e.target.value = "";
        setmessagetext(e.target.value);
      }
    }

  }
  const sendGroupmessage = async (e) => {
    const chat = messagetext;
    const groupname = senderGroupName.current;

    const receiver = username;

    const now = new Date();


    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();


    const currentDate = `${day}/${month}/${year}`;
    const currentTime = `${hours}:${minutes}:${seconds}`;

    setmessagetext("Type message here");
    const response = await fetch('https://chat-host.onrender.com/tofetchgroup/savegroupmessage', {
      method: 'POST',
      body: JSON.stringify({
        "receiver": receiver,
        "groupname": groupname,
        "chat": chat,
        "currentDate": currentDate,
        "currentTime": currentTime
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    socket.emit('send_message_group', { receiver, groupname, chat, currentDate, currentTime });

    setSearchbool(false);
    fetchintialusergroup();
    loadgroupmess(receiver, senderGroupName.current);
  }

  const sendMessage = async (e) => {
    const textToSend = messagetext;
    const receiver = username;
    const sender = senderGroupName.current;

    if (textToSend.length == 0) {
      setmessagetext("Type message here");
      return;
    }
    if (isgroupchat == false) {
      const identifier = receiver + ' (Self)';
      if (senderGroupName.current == identifier) {


        const now = new Date();

        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();


        const currentDate = `${day}/${month}/${year}`;
        const currentTime = `${hours}:${minutes}:${seconds}`;

        setmessagetext("Type message here");
        const response = await fetch('https://chat-host.onrender.com/tofetchindichat/saveindichat', {
          method: 'POST',
          body: JSON.stringify({
            "receiver": receiver,
            "sender": receiver,
            "whichuser": receiver,
            "textToSend": textToSend,
            "currentDate": currentDate,
            "currentTime": currentTime
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        setSearchbool(false);
        fetchintialusergroup();

        loadindimess(receiver, receiver);




      }
      else {
        const identifier1 = receiver + '#' + sender;
        const identifier2 = sender + '#' + receiver;
        const now = new Date();


        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();


        const currentDate = `${day}/${month}/${year}`;
        const currentTime = `${hours}:${minutes}:${seconds}`;

        setmessagetext("Type message here");
        const response = await fetch('https://chat-host.onrender.com/tofetchindichat/saveindichat', {
          method: 'POST',
          body: JSON.stringify({
            "receiver": receiver,
            "sender": sender,
            "whichuser": receiver,
            "textToSend": textToSend,
            "currentDate": currentDate,
            "currentTime": currentTime
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await response.json();
        const response2 = await fetch('https://chat-host.onrender.com/tofetchindichat/saveindichat', {
          method: 'POST',
          body: JSON.stringify({
            "receiver": sender,
            "sender": receiver,
            "whichuser": receiver,
            "textToSend": textToSend,
            "currentDate": currentDate,
            "currentTime": currentTime
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result2 = await response2.json();
        socket.emit('send_message', { identifier1, identifier2, receiver, sender, textToSend, currentDate, currentTime });

        setSearchbool(false);
        fetchintialusergroup();
        loadindimess(receiver, senderGroupName.current);

      }
    }
  }
  const submitNewGroup = async () => {
    let group_name = document.getElementById("group_name");
    const val = group_name.value;
    if (val.length == 0) {
      let display_res = document.getElementById("display_res");
      display_res.textContent = "Enter Group Name.";
      return;
    }
    else {
      let display_res = document.getElementById("display_res");
      display_res.textContent = "";
    }

    if (usersingroups.length <= 1) {
      let display_res = document.getElementById("display_res");
      display_res.textContent = "Atleast 2 users are required.";
      return;
    }
    else {
      let display_res = document.getElementById("display_res");
      display_res.textContent = "";
    }

    const response = await fetch('https://chat-host.onrender.com/tosignup/signup', {
      method: 'POST',
      body: JSON.stringify({ "username": val }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    const length = data.length;
    if (length == 1) {
      let display_res = document.getElementById("display_res");
      display_res.textContent = "Group name matches with username.";
      return;
    }
    if (val.length > 24) {
      let display_res = document.getElementById("display_res");
      display_res.textContent = "Groupname must be 24 characters or less.";
      return;
    }



    const res = await fetch("https://chat-host.onrender.com/tofetchgroup/checkgroupexist", {
      method: 'POST',
      body: JSON.stringify({
        "groupname": val
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const res2 = await res.json();
    if (res2.flag == "true") {
      let display_res = document.getElementById("display_res");
      display_res.textContent = "Group name already exists. Please choose a different one.";
      return;
    }
    else {
      let display_res = document.getElementById("display_res");
      display_res.textContent = "";
    }
    let groupmember = [];
    groupmember = usersingroups.map((user) => user.username);
    groupmember.push(username);
    const now = new Date();

    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const currentDate = `${day}/${month}/${year}`;
    const currentTime = `${hours}:${minutes}:${seconds}`;
    const response2 = await fetch('https://chat-host.onrender.com/tofetchgroup/savegroupinfo', {
      method: 'POST',
      body: JSON.stringify({
        "receiver": username,
        "groupname": val,
        "groupmember": groupmember,
        "currentDate": currentDate,
        "currentTime": currentTime
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    let display_res = document.getElementById("display_res");
    display_res.textContent = "Group created successfully.";
    setTimeout(() => {
      switchModal();
      setSearchUsersgroup([]);
      setUsersingroups([]);
      fetchintialusergroup();
    }, 2000);

  }

  const searchusersforgroup = async (e) => {
    const sender = e.target.value;

    if (sender.length > 0) {
      const response = await fetch('https://chat-host.onrender.com/togetresult/tofetch', {
        method: 'POST',
        body: JSON.stringify({ "username": sender }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      const data_users = data.users
      const data_group = data.groupMessages;

      setSearchUsersgroup(data_users || []);

    }
    else {
      setSearchUsersgroup([]);
    }
  }

  const addingroup = (e, user) => {
    e.preventDefault();
    const alreadyAdded = usersingroups.some((element) => element._id === user._id);
    if (alreadyAdded) return;

    setUsersingroups((prev) => [...prev, user]);

  }
  const removeingroup = (e, user) => {
    e.preventDefault();
    setUsersingroups((prev) => prev.filter((element) => element._id !== user._id))
  }
  const fetchintialusergroup = async () => {
    const res1 = await fetch('https://chat-host.onrender.com/tofetchindichat/intialindires', {
      method: 'POST',
      body: JSON.stringify({ receiver: username }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data1 = await res1.json();


    data1.forEach(element => {
      const identifier1 = username + '#' + element.sender;
      const identifier2 = element.sender + '#' + username;

      socket.emit("join_room", identifier1);
      socket.emit("join_room", identifier2);
    });


    const res2 = await fetch('https://chat-host.onrender.com/tofetchgroup/intialresultgroup', {
      method: 'POST',
      body: JSON.stringify({ receiver: username }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data2 = await res2.json();

    data2.forEach(element => {
      socket.emit("join_room_group", element.groupname);
    });


    const processedData2 = await Promise.all(
      data2.map(async (group) => {

        const { groupname, currentDate, currentTime, groupmember } = group;


        const res3 = await fetch('https://chat-host.onrender.com/tofetchgroup/intialgroupres', {
          method: 'POST',
          body: JSON.stringify({ groupname }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data3 = await res3.json();


        const latestMessage = data3[0]?.latestMessage || "Start your messaging";
        const n1currentDate = data3[0]?.currentDate || currentDate;
        const n1currentTime = data3[0]?.currentTime || currentTime;

        return {
          groupname,
          groupmember,
          "currentDate": n1currentDate,
          "currentTime": n1currentTime,
          chat: latestMessage
        };
      })
    );




    let tresult = [...data1, ...processedData2];


    let temp = tresult.sort((b, a) => {

      const [dayA, monthA, yearA] = a.currentDate.split('/').map(Number);
      const [dayB, monthB, yearB] = b.currentDate.split('/').map(Number);


      if (yearA !== yearB) return yearA - yearB;
      if (monthA !== monthB) return monthA - monthB;
      if (dayA !== dayB) return dayA - dayB;


      const timeA = a.currentTime.split(':').map(Number);
      const timeB = b.currentTime.split(':').map(Number);


      if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
      if (timeA[1] !== timeB[1]) return timeA[1] - timeB[1];
      return timeA[2] - timeB[2];
    });


    setIntial_user_group([...temp]);
  };



  useEffect(() => {

    fetchintialusergroup();


    const interval = setInterval(() => {
      fetchintialusergroup();
    }, 3000);


    socket.on("receive_message", (data) => {
      const { sender, textToSend, currentDate, currentTime } = data;


      setIntial_user_group((prevGroups) => {
        const updatedGroups = [...prevGroups];
        const groupIndex = updatedGroups.findIndex((group) => group.sender === sender);
        if (groupIndex > -1) {
          updatedGroups[groupIndex] = {
            ...updatedGroups[groupIndex],
            latestMessage: textToSend,
            currentDate,
            currentTime,
          };
        } else {
          updatedGroups.unshift({ sender, latestMessage: textToSend, currentDate, currentTime });
        }
        return updatedGroups;
      });
    });

    return () => {
      clearInterval(interval);
      socket.off("receive_message");
    };
  }, []);


  const [deleleCHAT, setDeleteChat] = useState(false);

  const toggleExit = () => {
    setDeleteChat(!deleleCHAT);
  }

  const deletechat = async () => {
    const receiver = username;
    const sender = senderGroupName.current;
    let delele_result = document.getElementById("delete_result");
    if (isgroupchat == true) {

      delele_result.innerHTML = "Group Chat is deleted.";
      const response = await fetch('https://chat-host.onrender.com/tofetchgroup/getgroupmember', {
        method: 'POST',
        body: JSON.stringify({ "groupname": senderGroupName.current }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const res = await response.json();
      let groupmember = res[0].groupmember;
      let newgroupmember = [];
      groupmember.forEach((user) => {
        if (user != username) {
          newgroupmember.push(user)
        }
      })
      const response2 = await fetch('https://chat-host.onrender.com/tofetchgroup/updategroupmember', {
        method: 'POST',
        body: JSON.stringify({ "groupname": senderGroupName.current, "groupmember": newgroupmember }),
        headers: {
          'Content-Type': 'application/json'
        }
      });


    }
    else {

      delele_result.innerHTML = "Individual Chat is deleted.";
      const response = await fetch('https://chat-host.onrender.com/tofetchindichat/deleteindichat', {
        method: 'DELETE',
        body: JSON.stringify({ "receiver": receiver, "sender": sender }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
    setTimeout(() => {
      delele_result.innerHTML = "";
      setDeleteChat(false);
      setMscreen(true);
      senderGroupName.current = "";
      setusersgroupname("");
      fetchintialusergroup();
    }, 1000);
  }


  return (
    <>




      <div className='class="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        {username === "" && (
          <>
          
            <div className="modal-background fixed top-0 left-0 w-full h-full z-10 bg-black bg-opacity-70" />

       
            <div
              className='fixed top-10 left-[25vw] h-[80vh] w-[50vw] z-20 rounded-2xl flex flex-col justify-center items-center'
              style={{
                backgroundColor: "#8EC5FC",
                backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)"
              }}
            >

              <p className="text-[2vw] text-center">Log in first.</p>
            </div>
          </>
        )}

        {addgroupModal && (
          <div className="modal-background fixed top-0 left-0 w-full h-full   z-10 bg-black bg-opacity-50" />
        )}
        {addgroupModal &&
          <div className='fixed top-10 left-[25vw] h-[80vh] w-[50vw] z-20 rounded-2xl' style={{
            backgroundColor: "#8EC5FC",
            backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)"


          }}>
            <button onClick={switchModal} className='bg-red-500  hover:bg-red-600 border-4 hover:scale-105 rounded-md border-red-500 hover:border-red-600 mt-[1vh] mr-[0.5vw] float-right text-[1.5vw] h-[8vh] w-[5vw]' >Close</button>
            <input type="text" id="group_name" name="" placeholder='Enter Group Name: ' className='relative top-[3vh] left-[1.1vw] w-[30vw] h-[6vh] pl-[0.5vw] border-black border-2 rounded-md' />
            <input type="text" id="search_user" onChange={e => searchusersforgroup(e)} name="" placeholder='Search User: ' className='relative top-[5vh] left-[1.1vw] w-[30vw] h-[6vh] pl-[0.5vw] border-black border-2 rounded-md' />
            <div className='bg-white h-[45vh] mt-[7vh] w-[23vw] ml-[1vw] border-4 border-blue-300 float-left overflow-y-auto class="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
              {searchusersgroup.length > 0 ? (
                <ul className="text-[2vw] mt-[2vh] searchnot">
                  {searchusersgroup.map(
                    (user) =>
                      user.username !== username && (
                        <li
                          key={user._id}
                          className="flex items-center justify-between border-4 rounded-xl hover:scale-105 cursor-pointer border-gray-700 mt-[2vh] ml-[0.7vw] h-[10vh] w-[21vw] text-[2vw] p-2"
                        >
                          <span>{user.username}</span>
                          <button
                            type="button"
                            onClick={(e) => addingroup(e, user)}
                            className="bg-green-400 rounded-md hover:bg-green-600 border-green-400 hover:border-green-600 h-[6vh] w-[6vw] text-[1.5vw]"
                          >
                            Add
                          </button>
                        </li>
                      )
                  )}
                </ul>
              ) : (
                <ul className="text-[1.8vw] mt-[2vh] flex justify-center searchnot">
                  No Users found
                </ul>
              )}
            </div>
            <div className="bg-white h-[45vh] border-4 border-blue-500 mt-[7vh] w-[23vw] mr-[1vw] float-right no-scrollbar">
              {usersingroups.length > 0 ? (
                <ul className="text-[2vw] mt-[2vh]">
                  {usersingroups.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center justify-between border-4 rounded-xl hover:scale-105 cursor-pointer border-black ml-[0.7vw] mt-[2vh] h-[10vh] w-[21vw] text-[2vw] p-2"
                    >
                      <span>{user.username}</span>
                      <button
                        type="button"
                        onClick={(e) => removeingroup(e, user)}
                        className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 rounded-md hover:scale-105 h-[6vh] w-[8vw] text-[1.5vw]"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="text-[1.8vw] mt-[2vh] flex justify-center searchnot">
                  No Users is added
                </ul>
              )}
            </div>

            <div id='display_res' className='text-black font-semibold h-[6vh] mt-[53vh] text-[1.5vw] h-[2.5vw] mx-auto  text-center'></div>
            <div className='bh-[6vh] flex justify-items-center'> <button className='bg-green-500  hover:bg-green-600  hover:scale-105   hover:border-green-600 border-green-500 rounded-md mx-auto border-4  text-[1.5vw] w-[8vw]' onClick={e => submitNewGroup(e)} >Submit</button></div>

          </div>}
        <div className='flex flex-row h-screen' onClick={handleContainerClick} >
          <div className="bg-gray-400 flex items-center justify-center" style={{ width: '5vw', height: '100vh' }}>


            <Link to="/" className='inline mt-[85vh]'><button className='bg-white rounded-xl h-[9vh] w-[4.8vw] border-4 text-[1.1vw] border-black hover:bg-gray-500 hover:scale-105' onClick={(e) => emptyUsername()}>Log Out</button></Link>

          </div>
          <div style={{ width: '40vw' }}>
            <div className='bg-fixed '>
              <span className='text-[2vw] font-bold relative top-[2vh] pl-[2vw]'>
                Chats
              </span>

              <button type="button" id="to_add_group" className='relative left-[14.5vw] text-[2vw] top-3 font-bold border-black rounded-lg border-4 border-solid visible hover:scale-105' onClick={switchModal}>New Group Chat</button>

              <div className='mt-[5vh] flex justify-center  ml-[2vw]' id='search_container' >
                <span className='rounded-l-md bg-gray-200 inline-block h-[10vh] pl-[1vw] ml-[0.2vw] hover:cursor-pointer ' onClick={(e) => clickOnImage(e)}><img src="/searchIcon.png" alt="" id='search_image' className='inline-block h-[4vh] mt-[3vh] m' /></span>
                <input type="text" ref={inputRef} placeholder='Search' id="search_user" className=' h-[10vh] rounded-r-md inline bg-gray-200' onChange={(e) => oninput(e)}
                  style={{ outline: 'None', width: '90%', paddingLeft: '5%', marginRight: '6%' }} onClick={(e) => clickOnImage(e)} />
              </div>
            </div>
            {searchbool ? (
              <div id='search_panel' className='class="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]  searchnot ' style={{ maxHeight: '480px', overflowY: 'scroll' }}>

                {searchusers.length > 0 ? (
                  <ul className='text-2xl mt-[2vh]  searchnot'>
                    <span className='ml-[2.2vw] text-[2vw] searchnot'>Search User</span>
                    {searchusers.map((user) => (
                      <li key={user._id} onClick={(e) => startindivimessage(e, user.username, "true")} className='hover:scale-105 rounded-xl border-4 cursor-pointer mt-[2vh] ml-[2vw] border-gray-700 pl-[1vw] pt-[1vh]  h-[10vh]  w-[36vw]  searchnot text-[2vw]'>{user.username}</li>
                    ))}
                  </ul>
                ) : <div className='ml-[2.2vw] mt-[0.5vh] text-[2vw] searchnot'>Search User not Found</div>}
              </div>) :
              (<div className=' overflow-auto h-[77vh]  class="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'  >
                {intial_user_group.length > 0 && (
                  <ul className=''>
                    <div >
                      {intial_user_group.map((item, index) => (
                        <li key={index} className='border-4 rounded-xl cursor-pointer mt-[2vh] ml-[2vw] border-gray-700 pl-[1vw] pt-[1vh]  hover:scale-105  w-[36vw]  searchnot text-[2vw]'>

                          {item.groupname ? (
                            <div className='h-[15vh] relative' onClick={(e) => startgroupmessage(e, item.groupname)}>
                              <p className="text-[3vh] font-bold text-blue-800">{item.groupname}</p>
                              <p className="text-[2vh] text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">Message: {item.chat}</p>
                              <p className="text-[2vh] text-gray-600 float-right mr-2">Date: {item.currentDate}</p>
                              <p className="text-[2vh] text-gray-600 float-right absolute bottom-0 right-2">Time: {item.currentTime}</p>
                            </div>
                          ) : (

                            <div onClick={(e) => startindivimessage(e, item.sender)} className='h-[15vh] relative'>
                              <p className="text-[3vh] font-bold text-green-800">From: {item.sender}</p>
                              <p className="text-[2vh] text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">Message: {item.latestMessage}</p>
                              <p className="text-[2vh] text-gray-600 float-right mr-2">Date: {item.currentDate}</p>
                              <p className="text-[2vh] text-gray-600 float-right absolute bottom-0  right-2">Time: {item.currentTime}</p>
                            </div>
                          )}
                        </li>
                      ))}
                    </div>
                  </ul>
                )}

              </div>)}
          </div>
          {mscreen ? (
            <div className='text-[2vw] flex justify-center items-center  class="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' style={{
              width: '55vw', backgroundColor: "#FFDEE9",
              backgroundImage: "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)"
            }}>
              <div>
                Start Messaging
              </div>
            </div>) :
            (<div style={{ width: '55vw', height: '99.5vh' }} >
              <div className="bg-gray-300 pl-10 text-[6vh] h-10vh" >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[3vw]">{usersgroupname}</span>
                  <span className="inline-block mr-2 mb-2">
                    <button onClick={toggleExit} className="bg-red-500 h-[8vh] w-[10vw] text-[2vw]   rounded-md hover:bg-red-600 border-4 border-red-500 hover:border-red-600 hover:scale-105">
                      Exit {isgroupchat === true ? "Group" : "Chat"}
                    </button>
                  </span>
                </div>
              </div>

              <div className='flex-1 overflow-y-auto class="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' id="messageDisplay" style={{
                height: '80%', backgroundImage: "linear-gradient( 109.6deg,  rgba(112,246,255,0.33) 11.2%, rgba(221,108,241,0.26) 42%, rgba(229,106,253,0.71) 71.5%, rgba(123,183,253,1) 100.2% )"
              }} ></div>
              <div className='bg-gray-500' style={{ height: '10%' }}><input type="text" value={messagetext} onChange={e => messageBox(e)} onClick={e => messageBox(e, false)} name="" id="" className='inline-block ' style={{ width: '75%', paddingLeft: '1%', marginLeft: '10%', height: '70%', marginTop: '1%' }} /> <button style={{ width: '10%', height: '50%' }}><img src="/rightarrow.png" onClick={isgroupchat == false ? (e) => sendMessage(e) : (e) => sendGroupmessage(e)} style={{ width: "50%", height: '150%', paddingTop: '5%' }} /></button></div>
            </div>)}
        </div>
        {deleleCHAT && (
          <div className="modal-background fixed top-0 left-0 w-full h-full z-10 bg-black bg-opacity-50" />
        )}
        {deleleCHAT &&
          <div className='bg-white fixed top-[30vh] left-[25vw] h-[30vh] w-[50vw] z-20 rounded-2xl '>
            <div className='text-black h-[5vh] text-[1.4vw] mx-auto w-[30vw] mt-[2vh] text-center font-semibold'>Are you sure you want to delete this chat?</div>
            <div className='text-black h-[5vh] text-[1.4vw] w-[50vw] text-center font-semibold'>{isgroupchat == true ? "Deleting it will also remove you from the group." : "Deleting the message will also remove the user from your home list."}</div>
            <div id="delete_result" className='h-[5vh] text-green-500 mt-[1vh] text-[1.5vw] text-center'></div>
            <div className='mt-[0.5vh]'><button className='bg-green-500 hover:bg-green-600 h-[9vh] hover:scale-105 rounded-xl border-4 border-green-500 hover:border-green-600 w-[15vw] ml-[3vw]' onClick={deletechat}>Yes</button><button onClick={toggleExit} className='bg-red-500 hover:bg-red-700 border-red-500  hover:border-red-700  hover:scale-105  border-4 h-[9vh] w-[15vw] rounded-xl float-right mr-[3vw]'>No</button></div>

          </div>}
      </div >

    </>
  );
}

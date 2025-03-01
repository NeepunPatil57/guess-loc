import React, { useState, useEffect } from 'react';
import env from "react-dotenv";

const Dashboard = ({rounds}) => {
  const [userInfo, setUserInfo] = useState({
    user_name: "",
    user_maxscore: 0
  });

  const checkAuthenticated = async () => {
    try {
      const res = await fetch( env.BASE_URL + "/dashboard/userinfo", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseRes = await res.json();

      setUserInfo(parseRes);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, [rounds == 5]);

  const logoutHandle = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location = "/";
  };


  return (
<div className='absolute top-3 right-1 group'>
  <div className='bg-[#ffffffa3] w-[100px] h-[100px] rounded-full scale-[0.65]'>
    <img
      className='rounded-full'
      src={`https://api.dicebear.com/6.x/personas/svg?seed=${userInfo.user_name}`}
      alt="profile"
      width="100"
      height="100"
    />

    <div className='group-hover:scale-125'> 
      {/* Dropdown Content */}
      <div className="hidden group-hover:block absolute text-lg top-[-10px] right-[90%] bg-white p-4 rounded-md shadow-md w-[220px] ">
        {/* Add your dropdown content here */}
        <p className='p-2 text-3xl font-bold'>{userInfo.user_name}</p>
        <p className='p-2 text-3xl'>Max:{userInfo.user_maxscore}</p>
        <p className='p-2 text-3xl cursor-pointer text-red-400' onClick={logoutHandle}>Logout</p>
      </div>
    </div>

  </div>
</div>

  );
};

export default Dashboard;

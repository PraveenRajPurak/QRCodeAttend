// Frontpage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Frontpage() {
  return (
    <section className="flex items-center justify-center h-screen">

      <div style={{ textAlign: 'center', borderWidth : 0.5, borderRadius : "10px", padding : "200px" }}>

        <h1 style={{ margin: '50px', fontSize : 26, fontWeight : "bold" }}>Welcome to QRCodeAttend</h1>
        <h3 style={{ margin: '50px', fontSize : 20 }}>Select your role to continue...</h3>

        <div className='flex flex-row justify-center'  style = {{marginTop : "-30px"}}>
          <Link to="/user-signup">
            <button style={{ textAlign: 'center', borderWidth : 0.5, borderRadius : "10px", marginRight : "30px", padding : "9px", width : "80px" }}>User</button>
          </Link>
          <Link to="/admin-signup">
            <button style={{ textAlign: 'center', borderWidth : 0.5, borderRadius : "10px", padding : "9px",  width : "80px" }}>Admin</button>
          </Link>
        </div>

      </div>

    </section>
  );
}

export default Frontpage;

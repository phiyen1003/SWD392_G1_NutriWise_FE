// import React from "react";
import { useNavigate } from "react-router-dom";
import { firebaseLogin } from "../../api/accountApi";

function Login() {
  const navigate = useNavigate();

  const handleFirebaseLogin = async () => {
    try {
      const data = await firebaseLogin();
      if (data.isRegistered) {
        navigate("/home"); // Đã đăng ký hoàn chỉnh -> Trang chính
      } else {
        navigate("/register"); // Chưa đăng ký -> Form đăng ký
      }
    } catch (error:any) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <button onClick={handleFirebaseLogin}>Login with Google</button>
    </div>
  );
}

export default Login;
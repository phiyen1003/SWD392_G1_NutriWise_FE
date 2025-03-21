// import { completeProfile, CompleteProfileRequest, googleCallback, GoogleCallbackResponse } from "../../api/accountApi";
// import AuthModal from "../../components/Home/AuthModal";
// import { auth } from "../../firebase-config";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// interface AppUser {
//     email: string;
//     token?: string;
//     userId?: string;
//   }
  
//   interface JwtPayload {
//     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
//     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
//     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
//     exp: number;
//   }
// const CallbackPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [error, setError] = useState<string | null>(null);
//     const [tempUserId, setTempUserId] = useState<string>("");
//     const [tempEmail, setTempEmail] = useState<string>("");
//     const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  
//     useEffect(() => {
//       const fetchCallbackData = async () => {
//         try {
//           const user = auth.currentUser;
//           if (!user) {
//             throw new Error("No user is currently signed in.");
//           }
  
//           const idToken = await user.getIdToken();
//           const data: GoogleCallbackResponse = await googleCallback(idToken);
//           const { token, email, isRegistered, profileComplete } = data;
  
//           if (!token || !email) {
//             throw new Error("No token or email in callback response.");
//           }
  
//           const decoded: JwtPayload = JSON.parse(atob(token.split(".")[1]));
//           const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  
//           if (!isRegistered || !profileComplete) {
//             localStorage.setItem("tempToken", token);
//             localStorage.setItem("tempEmail", email);
//             localStorage.setItem("tempUserId", userId);
//             setTempUserId(userId);
//             setTempEmail(email);
//             setShowAuthModal(true);
//           } else {
//             localStorage.setItem("token", token);
//             localStorage.setItem("email", email);
//             localStorage.setItem("userId", userId);
//             // Kiểm tra email và điều hướng
//             if (email === "nutriwise@gmail.com") {
//               navigate("/nutriwise/dashboard");
//             } else {
//               navigate("/");
//             }
//           }
//         } catch (err) {
//           setError("Failed to process Google callback: " + (err instanceof Error ? err.message : "Unknown error"));
//           console.error("Callback error details:", err);
//           setTimeout(() => navigate("/"), 3000);
//         }
//       };
  
//       fetchCallbackData();
//     }, [navigate]);
  
//     const handleCompleteProfile = async (data: CompleteProfileRequest) => {
//       try {
//         const response = await completeProfile(data);
//         localStorage.setItem("token", localStorage.getItem("tempToken") || "");
//         localStorage.setItem("email", data.email || "");
//         localStorage.setItem("userId", data.userId);
//         localStorage.removeItem("tempToken");
//         localStorage.removeItem("tempEmail");
//         localStorage.removeItem("tempUserId");
//         setShowAuthModal(false);
//         alert(response.message || "Profile completed successfully!");
//         // Kiểm tra email và điều hướng
//         if (data.email === "nutriwise@gmail.com") {
//           navigate("/nutriwise/dashboard");
//         } else {
//           navigate("/");
//         }
//       } catch (err) {
//         setError("Failed to complete profile: " + (err instanceof Error ? err.message : "Unknown error"));
//       }
//     };
  
//     if (error) {
//       return (
//         <div style={{ textAlign: "center", padding: "20px" }}>
//           <p style={{ color: "red" }}>{error}</p>
//           <button
//             onClick={() => navigate("/")}
//             style={{
//               marginTop: "10px",
//               padding: "8px 16px",
//               backgroundColor: "#3B82F6",
//               color: "#FFFFFF",
//               borderRadius: "8px",
//               cursor: "pointer",
//             }}
//           >
//             Back to Home
//           </button>
//         </div>
//       );
//     }
  
//     return (
//       <>
//         <div>Processing Google callback...</div>
//         <AuthModal
//           open={showAuthModal}
//           onClose={() => setShowAuthModal(false)}
//           onCompleteProfile={handleCompleteProfile}
//           isNewUser={true}
//           userId={tempUserId}
//           email={tempEmail}
//         />
//       </>
//     );
//   };
  
//   export default CallbackPage;
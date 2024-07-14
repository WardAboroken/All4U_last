import React, { useState, useEffect } from "react";
import "./css/index.css";
import "./css/insideHeader.css";
import InsideHeader from "../components/InsideHeader";
import Footer from "../components/Footer";
import user_profile from "../asserts/images/user_profile.jpeg";

function EditProfile() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user_profile);
  const [userInfo, setUserInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    profileImage: ""
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        setUserInfo(data.userInfo);
        setName(data.userInfo.name);
        setUserName(data.userInfo.userName);
        setEmail(data.userInfo.email);
        setNumber(data.userInfo.phoneNumber);
        setImagePreview(data.userInfo.profileImage || user_profile);
      } catch (error) {
        setError("Error fetching user info: " + error.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("number", number);
    formData.append("password", password);
    formData.append("newPassword", newPassword);

    if (image) {
      formData.append("profileImage", image);
    }

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error: ${response.statusText}, ${errorData}`);
      }

      setError("Profile updated successfully");
    } catch (error) {
      setError("Network error: " + error.message);
    }
  };

  return (
    <div>
      <InsideHeader />
      <div className="container">
        <h1>All4U</h1>
        <h2>Customer Profile Edit</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="User Profile"
              className="imagePreview"
            />
          )}
          <input
            type="text"
            placeholder={userInfo.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder={userInfo.userName}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder={userInfo.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder={userInfo.phoneNumber}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Current Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Update Profile</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default EditProfile;

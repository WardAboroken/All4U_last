import React, { useState, useEffect } from "react";
import "./css/index.css";
import "./css/insideHeader.css";
import InsideHeader from "../components/InsideHeader";
import Footer from "../components/Footer";
import user_profile from "../asserts/images/user_profile.jpeg"

function EditProfile() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null); // New state for profile image
  const [imagePreview, setImagePreview] = useState(user_profile); // State to store image preview

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user-profile");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setName(data.name);
        setUserName(data.userName);
        setEmail(data.email);
        setNumber(data.number);
        setImage(data.profileImage); // Assuming the backend sends the image URL
        setImagePreview(data.profileImage || user_profile); // Set initial image preview
      } catch (error) {
        setError("Error fetching user data: " + error.message);
      }
    };

    fetchUserData();
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

      // Optionally handle successful profile update
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
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
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

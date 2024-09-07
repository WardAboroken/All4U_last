import React, { useState, useEffect } from "react";
import "./css/index.css";
import "./css/customerHeader.css";
import ShopOwnerHeader from "../components/ShopOwnerHeader";
import Footer from "../components/Footer";
import user_profile from "../assets/images/user_profile.jpeg";

function EditShopOwnerProfile() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [description, setDescription] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user_profile);

  useEffect(() => {
    const fetchShopOwnerInfo = async () => {
      try {
        const response = await fetch("/userinfo/getUserInfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch shop owner info");
        }
        const data = await response.json();

        if (data && data.userInfo) {
          // Ensure data.userInfo is defined and contains the required fields
          setName(data.userInfo.name || "");
          setUserName(data.userInfo.userName || "");
          setEmail(data.userInfo.email || "");
          setNumber(data.userInfo.phoneNumber || "");
          setBusinessName(data.userInfo.businessName || "");
          setBusinessAddress(data.userInfo.businessAddress || "");
          setDescription(data.userInfo.description || "");
          setImagePreview(data.userInfo.profileImage || user_profile);
        }
      } catch (error) {
        setError("Error fetching shop owner info: " + error.message);
      }
    };

    fetchShopOwnerInfo();
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

    const shopOwnerData = {
      name,
      userName,
      email,
      phoneNumber: number,
      password,
      newPassword,
      businessName,
      businessAddress,
      description,
      profileImage: image ? image.name : imagePreview,
    };

    try {
      const response = await fetch("/updateProfile/updateShopOwnerProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shopOwnerData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        window.alert("YOUR UPDATE IS NOT SUCCESS");
        throw new Error(`Error: ${response.statusText}, ${errorData}`);
      }
      window.alert("YOUR UPDATE IS SUCCESS");
      setError("Profile updated successfully");
    } catch (error) {
      window.alert("YOUR UPDATE IS NOT SUCCESS");
      setError("Network error: " + error.message);
    }
  };

  return (
    <div>
      <ShopOwnerHeader />
      <div className="container">
        <h1>All4U</h1>
        <h2>Shop Owner Profile Edit</h2>
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
            placeholder="Username"
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
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Business Address"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

export default EditShopOwnerProfile;

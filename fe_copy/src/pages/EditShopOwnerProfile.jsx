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
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user_profile);
  const [userInfo, setUserInfo] = useState({
    name: "",
    userName: "",
    email: "",
    phoneNumber: "",
    profileImage: "",
    businessName: "",
    businessAddress: "",
    description: "",
  });

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
        setUserInfo(data.userInfo);
        setName(data.userInfo.name);
        setUserName(data.userInfo.userName);
        setEmail(data.userInfo.email);
        setNumber(data.userInfo.phoneNumber);
        setBusinessName(data.userInfo.businessName);
        setBusinessAddress(data.userInfo.businessAddress);
        setDescription(data.userInfo.description);
        setImagePreview(data.userInfo.profileImage || user_profile);
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
      name: name || userInfo.name,
      userName: userName || userInfo.userName,
      email: email || userInfo.email,
      phoneNumber: number || userInfo.phoneNumber,
      password,
      newPassword,
      businessName: businessName || userInfo.businessName,
      businessAddress: businessAddress || userInfo.businessAddress,
      description: description || userInfo.description,
      profileImage: image ? image.name : userInfo.profileImage,
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
            type="text"
            placeholder={userInfo.businessName}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder={userInfo.businessAddress}
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            required
          />
          <textarea
            placeholder={userInfo.description}
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
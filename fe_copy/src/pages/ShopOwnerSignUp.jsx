import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/login.css";
import Footer from "../components/Footer";
import OutHeader from "../components/OutHeader";

const api_url = "https://data.gov.il/api/3/action/datastore_search";
const cities_resource_id = "5c78e9fa-c2e2-4771-93ff-7f400a12f7ba";
const streets_resource_id = "a7296d1a-f8c9-4b70-96c2-6ebb4352f8e3";
const city_name_key = "cityName";
const street_name_key = "streetName";

function ShopOwnerSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phoneNumber: "",
    shopName: "",
    businessAddress: { city: "", street: "" },
  });

  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedStreet, setSelectedStreet] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const getData = useCallback((resource_id, q = "", limit = "100") => {
    return axios.get(api_url, {
      params: { resource_id, q, limit },
      responseType: "json",
    });
  }, []);

  const parseResponse = useCallback((records = [], field_name) => {
    return records.map((record) => record[field_name].trim());
  }, []);

  const loadCities = useCallback(() => {
    getData(cities_resource_id, "", 32000)
      .then((response) => {
        const cityNames = parseResponse(
          response.data.result.records,
          city_name_key
        );
        setCities(cityNames);
      })
      .catch((error) => {
        console.error("Couldn't get list of cities:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          cities: "Couldn't load cities. Please try again later.",
        }));
      });
  }, [getData, parseResponse]);

  const loadStreets = useCallback(
    (city) => {
      getData(streets_resource_id, { [city_name_key]: city }, 32000)
        .then((response) => {
          const streetNames = parseResponse(
            response.data.result.records,
            street_name_key
          );
          setStreets(streetNames);
        })
        .catch((error) => {
          console.error("Couldn't get list of streets:", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            streets: "Couldn't load streets. Please try again later.",
          }));
        });
    },
    [getData, parseResponse]
  );

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  useEffect(() => {
    if (selectedCity) {
      loadStreets(selectedCity);
      setFormData((prevData) => ({
        ...prevData,
        businessAddress: { ...prevData.businessAddress, city: selectedCity },
      }));
    }
  }, [selectedCity, loadStreets]);

  useEffect(() => {
    if (selectedStreet) {
      setFormData((prevData) => ({
        ...prevData,
        businessAddress: {
          ...prevData.businessAddress,
          street: selectedStreet,
        },
      }));
    }
  }, [selectedStreet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = "Passwords do not match.";
    }
    // Add more validation checks as needed
    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    console.log("Form Data: ", formData);

    // Navigate to ShopMainPage after form submission
    navigate("/ShopMainPage");
  };

  return (
    <div>
      <OutHeader />
      <div className="container">
        <h1>All4U</h1>
        <h2>Shop Owner Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder="User Name"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder="Shop Name"
            name="shopName"
            value={formData.shopName}
            onChange={handleInputChange}
            required
          />
          <div className="form-field" id="city-selection">
            <label htmlFor="city-choice">Street City:</label>
            <input
              list="cities-data"
              id="city-choice"
              name="selectedCity"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              required
            />
            <datalist id="cities-data">
              {cities.map((city, index) => (
                <option key={index} value={city} />
              ))}
            </datalist>
            {errors.cities && <p className="error">{errors.cities}</p>}
          </div>
          <div className="form-field" id="street-selection">
            <label htmlFor="street-choice">Select Street:</label>
            <input
              list="streets-data"
              id="street-choice"
              name="selectedStreet"
              value={selectedStreet}
              onChange={(e) => setSelectedStreet(e.target.value)}
              required
            />
            <datalist id="streets-data">
              {streets.map((street, index) => (
                <option key={index} value={street} />
              ))}
            </datalist>
            {errors.streets && <p className="error">{errors.streets}</p>}
          </div>
          <button type="submit">Continue</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ShopOwnerSignUp;

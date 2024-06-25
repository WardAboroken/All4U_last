import React from "react";
import { Link } from "react-router-dom";
import gmail from "../asserts/images/gmail-svgrepo-com.svg";
import facebook from "../asserts/images/facebook-svgrepo-com.svg";
import whatsapp from "../asserts/images/whatsapp-svgrepo-com.svg";
import instagram from "../asserts/images/instagram-167-svgrepo-com.svg";
function Footer() {
  return (
    <footer>
      <div className="footer">
        <div className="footer__wrap d-flex jcc">
          <div className="left">
            <div className="slogan">Our Categories</div>
            <Link to="/">
              <img src={gmail} alt="gmail" />
              <img src={facebook} alt="facebook" />
              <img src={instagram} alt="instagram" />
              <img src={whatsapp} alt="whatsapp" />
            </Link>
          </div>
          <div className="right">
            <table className="Table_Categories">
              <tr>
                <td>Home Styling</td>
                <td>Accessories</td>
                <td>Sport</td>
              </tr>
              <tr>
                <td>Toys</td>
                <td>Clothing</td>
                <td>Furnishing</td>
              </tr>
              <tr>
                <td>Work Tools</td>
                <td>Cleaning</td>
                <td>Beauty</td>
              </tr>
              <tr>
                <td>Pet Supplies</td>
                <td>Shoes</td>
                <td>Safety</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

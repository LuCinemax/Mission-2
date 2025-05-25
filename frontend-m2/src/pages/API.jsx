import NavBar from "../components/NavBar";
import TopHeader from "../components/TopHeader";
import Footer from "../components/Footer";
import logo from "../assets/Images/turnerscars_logo.png";
import styles from "./API.module.css";
import finance from "../assets/Images/finance.jpg";
import userIcon from "../assets/Images/user.png";
import phoneIcon from "../assets/Images/phone.png";
import locationIcon from "../assets/Images/location.png";

const API = () => {

  return (
    <div>
    {/* ========######## HEADER ########======== */}
      <TopHeader></TopHeader>

    {/* ========######## TOP LOGO SECTION ########======== */}
      <div className={styles.logoBox}>
        <figure className={styles.logoImage}>
            {/* Turners Logo */}
          <img src={logo} alt="turnerslogo" />
        </figure>
        <ul className={styles.infoSection}>
          <li><img src={userIcon} alt="" /><a href="https://www.turners.co.nz/Login/?ReturnUrl=/Cars/finance-insurance/car-insurance/">LOGIN</a> OR <a href="https://www.turners.co.nz/Login/Registration/">REGISTER</a></li>
          <li> <img src={phoneIcon} alt="" /> 0800 887 637</li>
          <li><img src={locationIcon} alt="" /><a href="https://www.turners.co.nz/Company/Branches/">Find Us</a></li>
          <li><a href="https://www.turners.co.nz/Company/Branches/">中文</a></li>
        </ul>
      </div>

    {/* ========######## NAVIGATION BAR ########======== */}
      <NavBar></NavBar>

    {/* ========######## BREADCRUMB NAVIGATOR ########======== */}
      <main className={styles.background}>
        <section className={styles.pageBox}>
          <nav className={styles.breadcrumb}>
            <a href="https://www.turners.co.nz/">Home</a>
            <span>»</span>
            <a href="https://www.turners.co.nz/Cars/">Cars</a>
            <span>»</span>
            <a href="https://www.turners.co.nz/Cars/finance-insurance/">Finance & Insurance</a>
            <span>»</span>
            <a href="https://www.turners.co.nz/Cars/finance-insurance/car-insurance/">Car Insurance</a>
            <span>»</span>
            <a href="#">API</a>
          </nav>

    {/* ========######## HEAD BANNER ########======== */}
          <figure>
            <img className={styles.financeImg} src={finance} alt="" />
          </figure>

          {/* ========######## API OUTPUTS ########======== */}

          <section className={styles.apiContainer}>
            <div className={styles.api1}>
              API 1
            </div>

            <div className={styles.api2}>
              API 2
            </div>

            <div className={styles.api3}>
              API 3
            </div>

            <div className={styles.api4}>
              API 4
            </div>
          </section>

        {/* ========######## FOOTER ########======== */}
          <Footer></Footer>
        </section>
      </main>
    </div>
  );
};

export default API;

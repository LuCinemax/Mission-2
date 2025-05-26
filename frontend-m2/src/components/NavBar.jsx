import {useState} from 'react';
import styles from './NavBar.module.css';
import searchIcon from '../assets/Images/search.png'

const NavBar = () => {
    const [openMenu, setOpenMenu] = useState(null);

    const toggle = (menuName) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

  return (
    <nav className={styles.navBox}>

        {/* LeftSide */}
        <main className={styles.navLeft}>
            <span><a href="https://www.turners.co.nz/Cars/Used-Cars-for-Sale/"><img src={searchIcon} alt="" />Find a Car</a></span>

        <div className={styles.dropdown}>
            <span onClick={() => toggle('howToBuy')}>How to Buy</span>
            {openMenu === 'howToBuy' && (
            <ul className={styles.dropdownList}>
                <li>View our cars</li>
                <li>Ways to Buy</li>
                <li>Book to test drive</li>
                <li>How to Pay</li>
                <li>FAQs about Buying</li>
                <li>Turners Live</li>
                <li>Website Tools</li>
            </ul>
          )}
        </div>

        <div className={styles.dropdown}>
            <span onClick={() => toggle('sellYourCar')}>Sell your Car</span>
            {openMenu === 'sellYourCar' && (
            <ul className={styles.dropdownList}>
                <li>Ways to sell</li>
                <li>Book an appraisal</li>
                <li>FAQs about Selling</li>
            </ul>
          )}
        </div>

        <div className={styles.dropdown}>
            <span onClick={() => toggle('financeInsurance')}>Finance & Insurance</span>
            {openMenu === 'financeInsurance' && (
            <ul className={styles.dropdownList}>
                <li>Finance Information</li>
                <li>Finance FAQ</li>
                <li>Apply Online For Finance</li>
                <li>Apply Online for Business Finance</li>
                <li>Car Insurance</li>
            </ul>
            )}
        </div>

        </main>
        

        {/* Rightside */}
        <aside className={styles.navRight}>
        <div className={styles.dropdown}>
            <span onClick={() => toggle('auctions')}>Auctions</span>
            {openMenu === 'auctions' && (
            <ul className={styles.dropdownList}>
                <li>All car auctions</li>
                <li>Whangarei</li>
                <li>North West Auckland</li>
                <li>Central/South Auckland</li>
                <li>Hamilton</li>
                <li>Tauranga</li>
                <li>Napier</li>
                <li>New Plymouth</li>
                <li>Palmerston North</li>
                <li>Porirua(Wellington)</li>
                <li>Nelson Cars</li>
                <li>Christchurch</li>
                <li>Dunedin</li>
                <li>Discounted Cars</li>
                <li>Classic Cars</li>
                <li>Turners Certified Vehicles</li>
                <li>Ex-Lease Cars</li>
            </ul>
            )}
        </div>

        <div className={styles.dropdown}>
            <span onClick={() => toggle('serviceInfo')}>Services & Info</span>
            {openMenu === 'serviceInfo' && (
            <ul className={styles.dropdownList}>
                <li>5 Day Moneyback Guarantee</li>
                <li>Turners Group Overview</li>
                <li>Terms & Conditions</li>
                <li>Buyers & sellers fees</li>
                <li>Shipping costs</li>
                <li>Careers at Turners</li>
                <li>Consumer Guarantees Act</li>
                <li>The Good Oil Blog</li>
                <li>Email Alerts</li>
                <li>Email Newsletters</li>
                <li>Sponsorship</li>
                <li>Change of Ownership</li>
                <li>Returning Lease Cars</li>
            </ul>
            )}
        </div>
        </aside>
    </nav>
  )
}

export default NavBar
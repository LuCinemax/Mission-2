import styles from './Footer.module.css'
import envelopeIcon from '../assets/Images/EnvIcon.png'
import houseIcon from '../assets/Images/HouseIcon.png'
import fbIcon from '../assets/Images/FBIcon.png'
import instaIcon from '../assets/Images/InstaIcon.png'

const Footer = () => {
  return (
    <footer className={styles.footerBox}>
    <main className={styles.topFooter}>
        <div>
            <h1 className={styles.linkTitles}>CARS</h1>
            <ul className={styles.links}>
                <li><a href="https://www.turners.co.nz/Cars/how-to-buy/how-to-buy-old/">How to Buy</a></li>
                <li><a href="https://www.turners.co.nz/Cars/sell-your-car/">Sell Your Car</a></li>
                <li><a href="https://www.turners.co.nz/Finance/">Finance & Insurance</a></li>
                <li><a href="https://www.turners.co.nz/Cars/Auctions/">Auctions & Events</a></li>
                <li><a href="https://www.turners.co.nz/Cars/how-to-buy/Buyer-and-Seller-Fees/">Buyer & Seller Fees</a></li>
                <li><a href="https://www.turners.co.nz/Vehicle-Sale-Price-History/">Vehicle Sale Price History Tool</a></li>
                <li><a href="https://www.turners.co.nz/Cars/how-to-buy/Shipping-Costs/">Shipping Costs</a></li>
            </ul>
        </div>
        <div>
            <h1 className={styles.linkTitles}>FINANCE & INSURANCE</h1>
            <ul className={styles.links}>
                <li><a href="https://www.turners.co.nz/Finance/">Finance Homepage</a></li>
                <li><a href="https://www.turners.co.nz/Finance/car--personal-finance/">Car & Personal Finance</a></li>
                <li><a href="https://www.turners.co.nz/Finance/">Loan Calculator</a></li>
                <li><a href="https://www.turners.co.nz/Finance/motor-vehicle-insurance/">Car Insurance</a></li>
                <li><a href="https://www.turners.co.nz/Finance/mechanical-breakdown-insurance/">Mechanical Breakdown Insurance</a></li>
                <li><a href="https://www.turners.co.nz/Finance/General-Insurance/">General Insurances</a></li>
                <li><a href="https://www.turners.co.nz/Trucks-Machinery/Finance/">Trucks Finance</a></li>
                <li><a href="https://www.turners.co.nz/Finance/legal-information/">Financial Information</a></li>
            </ul>
        </div>
        <div>
            <h1 className={styles.linkTitles}>SEARCH FOR</h1>
            <ul className={styles.links}>
                <li><a href="https://www.turners.co.nz/Cars/Used-Cars-for-Sale/">Cars</a></li>
                <li><a href="https://www.turners.co.nz/Trucks-Machinery/Used-Trucks-and-Machinery-for-Sale/">Trucks & Machinery</a></li>
                <li><a href="https://www.turners.co.nz/Damaged-Vehicles/Damaged-Cars-for-Sale/">Damaged & End of Life Cars</a></li>
                <li><a href="https://www.turners.co.nz/boats-marine/Used-Boats-for-Sale/">Boats & Marine</a></li>
                <li><a href="https://www.turners.co.nz/motorcycles-scooters/Used-Motorbikes-for-Sale/">Motorcycles & Scooters</a></li>
                <li><a href="https://www.turners.co.nz/General-Goods/Search/">General Goods</a></li>
                <li><a href="https://www.turners.co.nz/buses-caravans/Used-Caravans-and-Motorhomes-for-Sale/">Buses, Caravans & Motorhomes</a></li>
                <li><a href="https://www.turners.co.nz/Company/Auction-Schedule/">Turners Auction Schedule</a></li>
            </ul>
        </div>
        <div>
            <h1 className={styles.linkTitles}>ABOUT US</h1>
            <ul className={styles.links}>
                <li><a href="https://www.turners.co.nz/Company/About-Us/Overview/">Overview</a></li>
                <li><a href="https://turnerspeople.co.nz/">Careers at Turners</a></li>
                <li><a href="https://www.turners.co.nz/Company/Terms-and-Conditions/terms-conditions/">Terms and Conditions</a></li>
                <li><a href="https://www.turners.co.nz/Company/Terms-and-Conditions/Privacy-Policy/">Privacy Policy</a></li>
                <li><a href="https://www.turners.co.nz/Turners-Live/">Turners Live</a></li>
                <li><a href="https://www.turners.co.nz/the-good-oil/">The Good Oil Blog</a></li>
                <li><a href="https://www.turners.co.nz/Company/email-alerts/email-alerts/">Email Alerts</a></li>
                <li><a href="https://www.turners.co.nz/Company/Contact-Us/">Contact Us</a></li>
            </ul>
        </div>
    </main>
    <section className={styles.bottomFooter}>
        <div>
            <h1 className={styles.copyright}>&copy;2022 Turners</h1>
        </div>
        <div>
            <ul className={styles.social}>
                <li> <img className={styles.icon} src={houseIcon} alt="" /> Branch Details</li>
                <li> <img className={styles.largeIcon} src={fbIcon} alt="" /> Facebook</li>
                <li> <img className={styles.icon} src={envelopeIcon} alt="" /> Newsletter</li>
                <li> <img className={styles.icon} src={envelopeIcon} alt="" /> Email Alerts</li>
                <li> <img className={styles.largeIcon} src={instaIcon} alt="" /> Instagram</li>
                <li></li>
            </ul>
        </div>

    </section>
</footer>
  )
}

export default Footer
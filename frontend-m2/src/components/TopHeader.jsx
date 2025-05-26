import styles from './TopHeader.module.css'

const TopHeader = () => {
  return (
    <header>
        <ul className={styles.header}>
            <li className={styles.navCars}>Cars</li>
            <li className={styles.navTrucks}>Trucks & Machinery</li>
            <li className={styles.navDamaged}>Damaged & End of Life</li>
            <li className={styles.navMotorcycles}>Motorcycles</li>
            <li className={styles.navGeneral}>General Goods</li>
            <li className={styles.navBuses}>Buses, Caravans & Motorhomes</li>
            <li className={styles.navBoats}>Boats & Marine</li>
        </ul>
    </header>
  )
}

export default TopHeader
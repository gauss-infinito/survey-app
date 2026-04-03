import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>

        {/* LADO ESQUERDO (ILUSTRAÇÃO) */}
        <div className={styles.circle}>
          <div className={styles.clipboard}>
            <div className={styles.clipTop}></div>
            <div className={styles.checkbox}></div>
            <div className={`${styles.checkbox} ${styles.checked}`}></div>
            <div className={styles.checkbox}></div>
          </div>
        </div>

        {/* LADO DIREITO (TEXTO) */}
        <div className={styles.text}>
          <h1 className={styles.title}>ENQUETES</h1>
          <p className={styles.subtitle}>Indivíduo. Coletivo. Tendências.</p>

          <div className={styles.links}>
            <Link href="/login" className={styles.link}>Faça o login</Link>
            <Link href="/register" className={styles.link}>Registre-se agora mesmo</Link>
          </div>
        </div>

      </div>
    </main>
  );
}

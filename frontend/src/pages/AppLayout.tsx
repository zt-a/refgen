import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileMenu from "../components/UI/ProfileMenu";
import styles from "../styles/pages/AppLayout.module.css";
import { Menu } from "lucide-react";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const location = useLocation();

  return (
    <div className={styles.appLayout}>

      <div className={styles.sidebarDesktop}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {openSidebar && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenSidebar(false)}
            />

          <motion.div
            className={styles.sidebarModal}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
          >
            <Sidebar onLinkClick={() => setOpenSidebar(false)} />
          </motion.div>

          </>
        )}
      </AnimatePresence>

      <div className={styles.mainArea}>
        <motion.header
          className={styles.Header}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.headerLeft}>
            <button className={styles.hamburger} onClick={() => setOpenSidebar(true)}>
              <Menu size={26} />
            </button>
          </div>

          <div className={styles.headerRight}>
            <ProfileMenu />
          </div>
        </motion.header>

        {/* Анимация контента при смене маршрута */}
        <AnimatePresence mode="wait">
          <motion.main
              key={location.pathname}
              className={styles.pageContent}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.25 }}
          >
              <div className={styles.pageContentContainer}>
                  {children}
              </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppLayout;

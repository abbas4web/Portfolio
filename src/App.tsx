import React, {useState, useEffect} from "react";
import {
  Main,
  Timeline,
  Expertise,
  Project,
  Contact,
  Navigation,
  Footer,
} from "./components";
import FadeIn from './components/FadeIn';
import './index.scss';
import AdminPortal from './admin/AdminPortal';

function App() {
    const [mode, setMode] = useState<string>('dark');
    const [isAdminView, setIsAdminView] = useState<boolean>(() => {
      return (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#/admin') ||
        window.location.hash === '#admin'
      );
    });

    useEffect(() => {
      const handleHashOrPop = () => {
        setIsAdminView(
          window.location.pathname.startsWith('/admin') ||
          window.location.hash.startsWith('#/admin') ||
          window.location.hash === '#admin'
        );
      };

      window.addEventListener('popstate', handleHashOrPop);
      window.addEventListener('hashchange', handleHashOrPop);
      return () => {
        window.removeEventListener('popstate', handleHashOrPop);
        window.removeEventListener('hashchange', handleHashOrPop);
      };
    }, []);

    const handleModeChange = () => {
        if (mode === 'dark') {
            setMode('light');
        } else {
            setMode('dark');
        }
    }

    useEffect(() => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      }, []);

    if (isAdminView) {
      return <AdminPortal />;
    }

    return (
    <div className={`main-container ${mode === 'dark' ? 'dark-mode' : 'light-mode'}`}>
        <Navigation parentToChild={{mode}} modeChange={handleModeChange}/>
        <FadeIn transitionDuration={700}>
            <Main/>
            <Expertise/>
            <Timeline/>
            <Project/>
            <Contact/>
        </FadeIn>
        <Footer />
    </div>
    );
}

export default App;
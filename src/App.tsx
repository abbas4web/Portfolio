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
import {
  PortfolioDataService,
  FALLBACK_PROFILE,
  FALLBACK_NAV,
  FALLBACK_SERVICES,
  FALLBACK_PROJECTS,
  FALLBACK_EXPERIENCE,
  FALLBACK_EDUCATION,
} from './services/portfolioData';

function App() {
    const [mode, setMode] = useState<string>('dark');
    const [isAdminView, setIsAdminView] = useState<boolean>(() => {
      return (
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#/admin') ||
        window.location.hash === '#admin'
      );
    });

    // Dynamic Portfolio Data State (starts with safe fallbacks)
    const [profile, setProfile] = useState<any>(FALLBACK_PROFILE);
    const [navItems, setNavItems] = useState<any[]>(FALLBACK_NAV);
    const [services, setServices] = useState<any[]>(FALLBACK_SERVICES);
    const [projects, setProjects] = useState<any[]>(FALLBACK_PROJECTS);
    const [experience, setExperience] = useState<any[]>(FALLBACK_EXPERIENCE);
    const [education, setEducation] = useState<any[]>(FALLBACK_EDUCATION);

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

    // Load dynamic data from Backend REST API
    useEffect(() => {
      const loadPortfolioData = async () => {
        try {
          const [p, nav, srv, prj, exp, edu] = await Promise.all([
            PortfolioDataService.getProfile(),
            PortfolioDataService.getNavigation(),
            PortfolioDataService.getServices(),
            PortfolioDataService.getProjects(),
            PortfolioDataService.getExperience(),
            PortfolioDataService.getEducation(),
          ]);

          if (p) setProfile(p);
          if (Array.isArray(nav) && nav.length > 0) {
            setNavItems(nav.map((item: any) => [item.label, item.href]));
          }
          if (Array.isArray(srv) && srv.length > 0) setServices(srv);
          if (Array.isArray(prj) && prj.length > 0) setProjects(prj);
          if (Array.isArray(exp) && exp.length > 0) setExperience(exp);
          if (Array.isArray(edu) && edu.length > 0) setEducation(edu);
        } catch (e) {
          console.warn('[App] Could not load live API data, rendered with default content.', e);
        }
      };

      loadPortfolioData();
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
        <Navigation parentToChild={{mode}} modeChange={handleModeChange} items={navItems}/>
        <FadeIn transitionDuration={700}>
            <Main profile={profile}/>
            <Expertise services={services}/>
            <Timeline experience={experience} education={education}/>
            <Project projects={projects}/>
            <Contact/>
        </FadeIn>
        <Footer profile={profile}/>
    </div>
    );
}

export default App;
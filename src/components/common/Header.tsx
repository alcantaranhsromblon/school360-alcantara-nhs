import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  Lock,
  User,
  LogOut,
  Shield,
  FileText,
  Bell,
  CheckSquare,
  LayoutDashboard,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/store';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, subParam?: string) => void;
  onOpenLogin: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenLogin,
  onOpenSearch
}) => {
  const { currentUser, currentRole, isAuthenticated, isAdmin, isTeacher, logout } = useAuth();
  const schoolProfile = store.getSchoolProfile();

  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop active dropdown state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [depedSubmenuOpen, setDepedSubmenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Mobile accordions
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileDepedOpen, setMobileDepedOpen] = useState(false);
  const [mobileCampusesOpen, setMobileCampusesOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);
  const [mobileOrgsOpen, setMobileOrgsOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setDepedSubmenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string, subParam?: string) => {
    onNavigate(view, subParam);
    setOpenDropdown(null);
    setDepedSubmenuOpen(false);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const campuses = store.getCampuses();
  const orgs = store.getOrganizations();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top DepEd Identification Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden text-[11px] sm:text-xs">
            <span className="font-semibold text-amber-400 shrink-0">Republic of the Philippines</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="truncate hidden md:inline text-slate-300">Department of Education · Region IV-B MIMAROPA</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="text-slate-300 font-mono">School ID: 301747</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick search button */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white text-xs px-2 py-0.5 rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Open search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search Portal</span>
            </button>

            {/* Quick role indicator or login shortcut */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                  isAdmin ? 'bg-amber-400 text-slate-950' : 'bg-emerald-600 text-white'
                }`}>
                  {isAdmin ? 'Admin Portal' : 'Faculty Access'}
                </span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 hidden lg:inline">
                District of Alcantara · Division of Romblon
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="bg-white px-4 sm:px-8 py-3.5 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & School Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            {/* School Logo */}
            <img
              src="/logo.png"
              alt="Alcantara National High School seal"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform"
            />

            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2">
                <span>District of Alcantara · Division of Romblon</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight group-hover:text-blue-800 transition-colors">
                ALCANTARA NATIONAL HIGH SCHOOL
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block italic">
                {schoolProfile.tagline}
              </p>
            </div>
          </div>

          {/* Right Action: Admin/Teacher Account or Login Button */}
          <div className="flex items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  currentView.startsWith('admin')
                    ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                    : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {isAuthenticated && currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    isAdmin ? 'bg-blue-900' : 'bg-emerald-700'
                  }`}>
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[130px]">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-slate-500 capitalize mt-0.5 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Account Menu Popup */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{currentUser.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                          isAdmin ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {isAdmin ? 'System Administrator' : 'Authorized Faculty'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-blue-700" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleNavClick('issuances')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>School Issuances</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('updates')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <Bell className="w-3.5 h-3.5 text-slate-500" />
                        <span>School Updates</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('monitoring')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 flex items-center gap-2"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
                        <span>School Monitoring</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          onNavigate('home');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out (Return to Public)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </button>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Horizontal Navigation Bar */}
      <nav className="hidden lg:block bg-blue-950 text-white select-none" ref={navRef}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-x-0.5">
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`px-2.5 xl:px-3.5 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
                currentView === 'home'
                  ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              Home
            </button>

            {/* 2. About Us [Dropdown with DepEd side submenu] */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'about' ? null : 'about')}
                className={`px-2.5 xl:px-3.5 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1 border-b-2 ${
                  currentView.startsWith('about') || currentView.startsWith('deped')
                    ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
                }`}
              >
                <span>About Us</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {openDropdown === 'about' && (
                <div className="absolute top-full left-0 w-60 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                  <button
                    onClick={() => handleNavClick('about-profile')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                  >
                    School Profile
                  </button>
                  <button
                    onClick={() => handleNavClick('about-history')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                  >
                    School History
                  </button>

                  {/* DepEd Side-opening flyout submenu */}
                  <div
                    className="relative"
                    onMouseEnter={() => setDepedSubmenuOpen(true)}
                    onMouseLeave={() => setDepedSubmenuOpen(false)}
                  >
                    <button
                      onClick={() => setDepedSubmenuOpen(!depedSubmenuOpen)}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 flex items-center justify-between"
                    >
                      <span>DepEd</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {depedSubmenuOpen && (
                      <div className="absolute top-0 left-full ml-0.5 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                        <button
                          onClick={() => handleNavClick('deped-mission')}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                        >
                          DepEd Mission
                        </button>
                        <button
                          onClick={() => handleNavClick('deped-vision')}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                        >
                          DepEd Vision
                        </button>
                        <button
                          onClick={() => handleNavClick('deped-values')}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                        >
                          DepEd Core Values
                        </button>
                        <button
                          onClick={() => handleNavClick('deped-mandate')}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                        >
                          DepEd Mandate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Campuses [Dropdown] */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'campuses' ? null : 'campuses')}
                className={`px-2.5 xl:px-3.5 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1 border-b-2 ${
                  currentView.startsWith('campuses')
                    ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
                }`}
              >
                <span>Campuses</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {openDropdown === 'campuses' && (
                <div className="absolute top-full left-0 w-64 max-w-[calc(100vw-1.5rem)] bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                  {campuses.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleNavClick('campuses', c.id)}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                    >
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{c.category}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. News & Achievements [Dropdown] */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'news' ? null : 'news')}
                className={`px-2.5 xl:px-3.5 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1 border-b-2 ${
                  ['news', 'awards', 'programs', 'events', 'gallery'].includes(currentView)
                    ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
                }`}
              >
                <span>News & Achievements</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {openDropdown === 'news' && (
                <div className="absolute top-full left-0 w-60 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                  <button
                    onClick={() => handleNavClick('news')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                  >
                    Latest News & Updates
                  </button>
                  <button
                    onClick={() => handleNavClick('awards')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                  >
                    Awards & Recognition
                  </button>
                  <button
                    onClick={() => handleNavClick('programs')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                  >
                    Programs & Projects
                  </button>
                  <button
                    onClick={() => handleNavClick('events')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                  >
                    Events & Activities
                  </button>
                  <button
                    onClick={() => handleNavClick('gallery')}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                  >
                    Photo Gallery
                  </button>
                </div>
              )}
            </div>

            {/* 5. School Organizational Chart [Direct link] */}
            <button
              onClick={() => handleNavClick('org-chart')}
              className={`px-2.5 xl:px-3.5 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
                currentView === 'org-chart'
                  ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                  : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
              }`}
            >
              School Organizational Chart
            </button>

            {/* 6. School Organization [Dropdown: SSLG, YES-O, The Beacon, Avant Garde] */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'orgs' ? null : 'orgs')}
                className={`px-2.5 xl:px-3.5 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1 border-b-2 ${
                  currentView.startsWith('organization')
                    ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
                }`}
              >
                <span>School Organizations</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {openDropdown === 'orgs' && (
                <div className="absolute top-full left-0 w-64 max-w-[calc(100vw-1.5rem)] bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-100">
                  {orgs.map(o => (
                    <button
                      key={o.id}
                      onClick={() => handleNavClick('organization', o.code)}
                      className="w-full text-left px-4 py-2.5 text-xs hover:bg-blue-50 font-medium text-slate-700 hover:text-blue-900 block"
                    >
                      <div className="font-semibold text-slate-900">{o.name} ({o.acronym})</div>
                      <div className="text-[10px] text-slate-500 truncate">{o.adviser}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PROTECTED TEACHER & ADMIN NAVIGATION */}
            {isAuthenticated && (
              <>
                <div className="h-5 w-px bg-blue-800 mx-1.5" />

                {/* School Issuances */}
                <button
                  onClick={() => handleNavClick('issuances')}
                  className={`px-2.5 xl:px-3 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
                    currentView === 'issuances'
                      ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                      : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>School Issuances</span>
                </button>

                {/* School Updates */}
                <button
                  onClick={() => handleNavClick('updates')}
                  className={`px-2.5 xl:px-3 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
                    currentView === 'updates'
                      ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                      : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>School Updates</span>
                </button>

                {/* School Monitoring */}
                <button
                  onClick={() => handleNavClick('monitoring')}
                  className={`px-2.5 xl:px-3 py-3 whitespace-nowrap text-xs font-semibold transition-colors flex items-center gap-1.5 border-b-2 ${
                    currentView === 'monitoring'
                      ? 'border-amber-400 text-amber-300 bg-blue-900/60'
                      : 'border-transparent text-slate-200 hover:text-white hover:bg-blue-900/40'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>School Monitoring</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {/* User Status Bar in mobile */}
          {isAuthenticated && currentUser ? (
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 mb-3 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{currentUser.fullName}</div>
                <div className="text-[10px] text-amber-300 capitalize">{currentUser.role} · Alcantara NHS</div>
              </div>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full py-2.5 px-4 mb-3 rounded-lg bg-blue-800 hover:bg-blue-700 text-xs font-bold text-white flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Sign In (Teacher / Admin)</span>
            </button>
          )}

          {/* Mobile Home */}
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-800"
          >
            Home
          </button>

          {/* Mobile About Us (Accordion) */}
          <div>
            <button
              onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>About Us</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileAboutOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-800/50 rounded-lg text-xs">
                <button
                  onClick={() => handleNavClick('about-profile')}
                  className="w-full text-left py-1.5 px-2 hover:text-amber-300"
                >
                  School Profile
                </button>
                <button
                  onClick={() => handleNavClick('about-history')}
                  className="w-full text-left py-1.5 px-2 hover:text-amber-300"
                >
                  School History
                </button>

                {/* DepEd Nested */}
                <div>
                  <button
                    onClick={() => setMobileDepedOpen(!mobileDepedOpen)}
                    className="w-full text-left py-1.5 px-2 text-amber-300 font-semibold flex items-center justify-between"
                  >
                    <span>DepEd Mandate & Values</span>
                    <ChevronDown className={`w-3.5 h-3.5 ${mobileDepedOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileDepedOpen && (
                    <div className="pl-3 py-1 space-y-1 text-slate-300 text-[11px]">
                      <button onClick={() => handleNavClick('deped-mission')} className="block py-1 hover:text-white">DepEd Mission</button>
                      <button onClick={() => handleNavClick('deped-vision')} className="block py-1 hover:text-white">DepEd Vision</button>
                      <button onClick={() => handleNavClick('deped-values')} className="block py-1 hover:text-white">DepEd Core Values</button>
                      <button onClick={() => handleNavClick('deped-mandate')} className="block py-1 hover:text-white">DepEd Mandate</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Campuses (Accordion) */}
          <div>
            <button
              onClick={() => setMobileCampusesOpen(!mobileCampusesOpen)}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>Campuses</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileCampusesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCampusesOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-800/50 rounded-lg text-xs">
                {campuses.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleNavClick('campuses', c.id)}
                    className="w-full text-left py-1.5 px-2 hover:text-amber-300"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile News & Achievements */}
          <div>
            <button
              onClick={() => setMobileNewsOpen(!mobileNewsOpen)}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>News & Achievements</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileNewsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileNewsOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-800/50 rounded-lg text-xs">
                <button onClick={() => handleNavClick('news')} className="w-full text-left py-1.5 px-2 hover:text-amber-300">Latest News & Updates</button>
                <button onClick={() => handleNavClick('awards')} className="w-full text-left py-1.5 px-2 hover:text-amber-300">Awards & Recognition</button>
                <button onClick={() => handleNavClick('programs')} className="w-full text-left py-1.5 px-2 hover:text-amber-300">Programs & Projects</button>
                <button onClick={() => handleNavClick('events')} className="w-full text-left py-1.5 px-2 hover:text-amber-300">Events & Activities</button>
                <button onClick={() => handleNavClick('gallery')} className="w-full text-left py-1.5 px-2 hover:text-amber-300">Photo Gallery</button>
              </div>
            )}
          </div>

          {/* Mobile Org Chart */}
          <button
            onClick={() => handleNavClick('org-chart')}
            className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-800"
          >
            School Organizational Chart
          </button>

          {/* Mobile School Organizations */}
          <div>
            <button
              onClick={() => setMobileOrgsOpen(!mobileOrgsOpen)}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-800 flex items-center justify-between"
            >
              <span>School Organizations</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileOrgsOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileOrgsOpen && (
              <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-800/50 rounded-lg text-xs">
                {orgs.map(o => (
                  <button
                    key={o.id}
                    onClick={() => handleNavClick('organization', o.code)}
                    className="w-full text-left py-1.5 px-2 hover:text-amber-300"
                  >
                    {o.name} ({o.acronym})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Protected Links */}
          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-700 space-y-1">
              <div className="text-[10px] uppercase font-bold text-amber-400 px-3 py-1">
                Protected Faculty Modules
              </div>
              <button
                onClick={() => handleNavClick('issuances')}
                className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-200"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>School Issuances</span>
              </button>
              <button
                onClick={() => handleNavClick('updates')}
                className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-200"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>School Updates</span>
              </button>
              <button
                onClick={() => handleNavClick('monitoring')}
                className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-200"
              >
                <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>School Monitoring</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-left py-2 px-3 text-xs font-bold rounded-lg bg-blue-800 hover:bg-blue-700 text-white flex items-center gap-2 mt-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
                  <span>Administrative Console</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
};

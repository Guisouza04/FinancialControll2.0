import { useState } from "react";
import {
  Nav,
  NavArrow,
  Lista,
  Itens,
  IconWrap,
  Label,
  Logo,
  MobileTopBar,
  Hamburger,
  TopBarLogo,
  Backdrop,
} from "./styles";
import logoIcone from "../../assets/Showzas.svg";
import { Link } from "react-router-dom";

const svgProps = {
  viewBox: "0 0 24 24",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const DashboardIcon = (
  <svg {...svgProps}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const DespesasIcon = (
  <svg {...svgProps}>
    <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 1 0-4h13" />
    <path d="M3 5v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5a2 2 0 0 1-2-2Z" />
    <circle cx="17" cy="13" r="1.2" />
  </svg>
);

const MetasIcon = (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" />
    <path d="M20 4 L13 11" />
    <path d="M17 11 H13 V7" />
  </svg>
);

const DadosIcon = (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: DashboardIcon },
  { to: "/despesas", label: "Despesas", icon: DespesasIcon },
  { to: "/metas", label: "Metas", icon: MetasIcon },
  { to: "/dados", label: "Dados", icon: DadosIcon },
];

function MenuNavecacao() {
  const [isOpen, setIsOpen] = useState(false); // drawer no mobile
  // Recolhida no desktop — persistida entre navegações via localStorage.
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("navCollapsed") === "true"
  );

  const close = () => setIsOpen(false);

  const toggleCollapse = () =>
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("navCollapsed", String(next));
      return next;
    });

  // A setinha recolhe/expande no desktop e fecha o drawer no mobile.
  const handleArrow = () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      setIsOpen(false);
    } else {
      toggleCollapse();
    }
  };

  return (
    <>
      <MobileTopBar>
        <Hamburger onClick={() => setIsOpen(true)} aria-label="Abrir menu">
          ☰
        </Hamburger>
        <TopBarLogo src={logoIcone} alt="Logo" />
      </MobileTopBar>

      <Backdrop $open={isOpen} onClick={close} />

      <Nav $open={isOpen} $collapsed={collapsed}>
        <NavArrow
          className="nav-arrow"
          onClick={handleArrow}
          role="button"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          ➜
        </NavArrow>
        <Lista>
          {NAV_ITEMS.map((item) => (
            <Itens key={item.to}>
              <Link to={item.to} onClick={close} title={item.label}>
                <IconWrap>{item.icon}</IconWrap>
                <Label className="nav-label">{item.label}</Label>
              </Link>
            </Itens>
          ))}
        </Lista>
        <Logo className="nav-logo" src={logoIcone} alt="Logo" />
      </Nav>
    </>
  );
}

export default MenuNavecacao;

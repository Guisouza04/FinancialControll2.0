import styled from "styled-components";

export const Nav = styled.div`
  position: relative;
  width: 25rem;
  height: 100vh;
  padding-top: 2rem;
  z-index: 1200;
  overflow: hidden;
  white-space: nowrap;
  background: linear-gradient(
    180deg,
    rgba(130, 10, 209, 0.22) 0%,
    rgba(79, 1, 134, 0.12) 100%
  );
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border-right: 1px solid var(--glass-border);
  box-shadow: 4px 0 30px rgba(0, 0, 0, 0.25);
  transition: width 0.3s var(--ease), padding 0.3s var(--ease),
    transform 0.3s var(--ease);

  /* ===== Rail (recolhida) no desktop ===== */
  ${({ $collapsed }) =>
    $collapsed &&
    `
      width: 7.2rem;

      .nav-arrow {
        margin: 0 auto 1.5rem;
        transform: rotate(0deg);
      }
      ul {
        padding: 0 0.9rem;
      }
      li a {
        justify-content: center;
        gap: 0;
        padding-left: 0;
        padding-right: 0;
      }
      .nav-label {
        display: none;
      }
      .nav-logo {
        opacity: 0;
        pointer-events: none;
      }
    `}

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 78vw;
    max-width: 30rem;
    padding-top: 2rem;
    border-right: 1px solid var(--glass-border);
    transform: translateX(-100%);
    box-shadow: 8px 0 40px rgba(0, 0, 0, 0.5);
    ${({ $open }) => $open && "transform: translateX(0);"}

    /* No drawer mobile os rótulos aparecem sempre, mesmo se "collapsed" */
    .nav-label {
      display: inline;
    }
    li a {
      justify-content: flex-start;
      gap: 1.4rem;
      padding: 1.3rem 1.6rem;
    }
    .nav-logo {
      opacity: 0.95;
      pointer-events: auto;
    }
  }
`;

export const MobileTopBar = styled.header`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 5.5rem;
    padding: 0 1.5rem;
    background: rgba(20, 0, 31, 0.72);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    border-bottom: 1px solid var(--glass-border);
    z-index: 1100;
  }
`;

export const Hamburger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.2rem;
  height: 4.2rem;
  font-size: 2.2rem;
  line-height: 1;
  color: var(--text-primary);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s var(--ease);

  &:hover {
    background: var(--glass-bg-strong);
  }
`;

export const TopBarLogo = styled.img`
  height: 3rem;
  opacity: 0.95;
  filter: drop-shadow(0 4px 12px rgba(130, 10, 209, 0.5));
`;

export const Backdrop = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(10, 0, 20, 0.55);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    z-index: 1150;
  }
`;

export const NavArrow = styled.div`
  font-size: 2.4rem;
  color: var(--text-muted);
  cursor: pointer;
  width: 4rem;
  height: 4rem;
  margin: 0 1rem 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-pill);
  transform: rotate(180deg);
  transition: transform 300ms var(--ease), color 200ms var(--ease),
    background 200ms var(--ease);

  &:hover {
    color: #fff;
    background: var(--glass-bg-strong);
  }
`;

export const Lista = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0 1.2rem;
`;

export const Itens = styled.li`
  font-size: 1.8rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 250ms var(--ease);

  & a {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    padding: 1.3rem 1.6rem;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    transition: color 250ms var(--ease), background 250ms var(--ease);
  }

  &:hover a {
    color: #fff;
    background: var(--glass-bg-strong);
  }
`;

export const IconWrap = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.6rem;
  height: 2.6rem;

  svg {
    width: 2.4rem;
    height: 2.4rem;
    stroke: currentColor;
    fill: none;
  }
`;

export const Label = styled.span`
  font-size: 1.8rem;
`;

export const Logo = styled.img`
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  bottom: 1.5rem;
  width: 18rem;
  opacity: 0.95;
  filter: drop-shadow(0 4px 12px rgba(130, 10, 209, 0.5));
  transition: opacity 0.2s var(--ease);
`;

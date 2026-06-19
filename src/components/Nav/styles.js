import styled from "styled-components";

export const Nav = styled.div`
  position: relative;
  width: 25rem;
  height: 100vh;
  background: linear-gradient(90deg, #820ad1 0%, #4f0186ff 100%);
`;

export const NavArrow = styled.div`
  font-size: 3rem;
  color: #fff;
  cursor: pointer;
  padding-right: 1rem;
  padding-left: 1rem;
  justify-self: end;
  transform: rotate(180deg);

  &:hover {
    color: #820ad1;
  }
`;

export const Lista = styled.ul`
  list-style: none;
`;

export const SubLista = Lista;

export const Itens = styled.li`
  font-size: 2.5rem;
  padding: 0rem 1rem 1rem 2rem;
  cursor: pointer;
  transition: all 300ms;

  & a {
    transition: all 300ms;
  }

  &:hover,
  &:hover a {
    color: #820ad1;
  }
`;

export const SubItens = styled.li`
  font-size: 2.5rem;
  padding: 0rem 1rem 1rem 4rem;
  cursor: pointer;
  transition: all 300ms;

  & a {
    transition: all 300ms;
  }

  &:hover,
  &:hover a {
    color: #820ad1;
  }
`;

export const Logo = styled.img`
  position: absolute;
  transform: translateX(-50%);
  left: 50%;
  bottom: 1.5rem;
  width: 20rem;
`;

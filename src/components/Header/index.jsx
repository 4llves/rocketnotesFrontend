import { useNavigate } from 'react-router-dom';
import { RiShutDownLine } from 'react-icons/ri'
import { useAuth } from '../../hooks/auth'
import { api } from '../../services/api';

import { Container, Profile, Logout } from "./styles";

import avatarPlaceholder from '../../assets/avatar_placeholder.svg'

export function Header() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const altImg = `Foto de ${user.name}`

  function handleSignOut() {
    navigate("/")
    signOut();
  }

  const avatarUrl = user.avatar ? `${api.defaults.baseURL}/files/${user.avatar}` : avatarPlaceholder //condiconal para aparecer a imagem ou um placeholder

  return (
    <Container>
      <Profile to="/profile">
        <img
          src={avatarUrl}
          alt={altImg}
        />

        <div>
          <span>Bem Vindo</span>
          <strong>{user.name}</strong>
        </div>
      </Profile>

      <Logout onClick={handleSignOut}>
        <RiShutDownLine />
      </Logout>
    </Container>
  )
}
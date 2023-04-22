import { useContext, createContext, useState, useEffect } from "react";
import { api } from "../services/api";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState({});

  async function signIn({ email, password }) {
    try {
      const res = await api.post("/sessions", { email, password });
      const { user, token } = res.data;

      localStorage.setItem("@rocketnotes:user", JSON.stringify(user));//armazenar no local storage
      localStorage.setItem("@rocketnotes:token", token);

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setData({ user, token });

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possivel entrar");
      }
    }
  }

  function signOut() {
    localStorage.removeItem("@rocketnotes:user");
    localStorage.removeItem("@rocketnotes:token");

    setData({});
  }

  async function updateProfile({ user, avatarFile }) {
    try {
      if (avatarFile) {
        const fileUploadForm = new FormData();
        fileUploadForm.append("avatar", avatarFile); //append é pra adicionar

        const res = await api.patch('/users/avatar', fileUploadForm);
        user.avatar = res.data.avatar;
      }

      await api.put('/users', user);
      localStorage.setItem('@rocketnotes:user', JSON.stringify(user)); //tbm serve para substituir o conteudo

      setData({
        user,
        token: data.token
      });

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possivel atualizar o perfil.");
      }
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("@rocketnotes:user"); //buscar no localStorage
    const token = localStorage.getItem("@rocketnotes:token");

    if (user && token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setData({
        token,
        user: JSON.parse(user)
      });
    }
  }, []);

  return (
    // Provider é pra prover um valor
    <AuthContext.Provider value={{
      signIn,
      signOut,
      updateProfile,
      user: data.user
    }}>
      {children} {/* esse children vai ser as rotas */}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export {
  AuthProvider,
  useAuth,
};
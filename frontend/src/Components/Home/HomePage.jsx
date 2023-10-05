import { useDispatch, useSelector } from "react-redux";
import "./home.css";
import { useEffect } from "react";
import { getAllUsers } from "../../app/apiRequest";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../app/apiRequest";
import { loginSuccess } from "../../app/authSlice";
import { createAxios } from "../../createInstance";

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users?.allUser);
  const msg = useSelector((state) => state.users?.msg);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const handleDelete = (id) => {
    deleteUser(id, user.accessToken, dispatch, axiosJWT);
  };

  useEffect(() => {
    if (!user) return navigate("/login");
    getAllUsers(user?.accessToken, dispatch, axiosJWT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div className="home-role">
        {`Your role is ${user?.admin ? "Admin" : "User"}`}
      </div>
      <div className="home-userlist">
        {userList?.map((user) => {
          return (
            <div className="user-container" key={user._id}>
              <div className="home-user">{user.username}</div>
              <div
                className="delete-user"
                onClick={() => handleDelete(user._id)}
              >
                Delete{" "}
              </div>
            </div>
          );
        })}
      </div>
      {msg ? <div className="home-msg">{msg}</div> : null}
    </main>
  );
};

export default HomePage;

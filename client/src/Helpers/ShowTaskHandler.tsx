import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const ShowTaskHandler = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, role, checkToken} = useToken();
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    if (!checkToken() || id === null || id?.trim() === '') {
        navigate("/");
    }
  },[token]);

  useEffect(() => {
      try {
        if (role === "user") {
          navigate(`/user/edit/${id}`);
        }
        else{
            alert(role);
            navigate('/');
        }
      } catch (error) {
        console.error(error);
        alert("Error fetching task");
        navigate(-1);
      } finally {
        setLoading(false);
      }
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return null; // since navigation happens, nothing is rendered
};

export default ShowTaskHandler;

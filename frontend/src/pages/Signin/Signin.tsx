import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import "./Signin.style.css";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "../../utils/api";
import { setAuthorizationToken } from "../../utils/authToken";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";
import { useSetRecoilState } from "recoil";
import { tokenAtom, userDataAtom } from "../../atoms/userAtom";

type SigninForm = {
  username: string;
  password: string;
};

export const Signin = () => {
  const setTokenState = useSetRecoilState(tokenAtom);
  const setUserData = useSetRecoilState(userDataAtom);
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SigninForm>();

  const onSubmit: SubmitHandler<SigninForm> = (data) => {
    api.post("/users/signin", data).then(
      (response) => {
        // storing token in local storage
        setAuthorizationToken(response.data.token);
        // updating token atom
        setTokenState(response.data.token);
        // setting user data
        setUserData({
          user_id: response.data.user_id,
          username: response.data.username,
        });
        toast.success(response.data.message);
        navigate("/");
      },
      (err) => {
        errorHandler(err);
      }
    );
  };

  return (
    <div className="signin-container">
      <div className="signin-form">
        <div className="text-2xl font-medium flex justify-center">Sign In</div>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Input
            inputLabel="Username"
            inputType="text"
            placeholder="john"
            register={register("username", { required: true })}
            error={errors.username}
            errorMessage="Username is required"
          />
          <Input
            inputLabel="Password"
            inputType="password"
            placeholder="*******"
            register={register("password", {
              required: true,
              minLength: 6,
              pattern:
                /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{3,}$/,
            })}
            error={errors.password}
            errorMessage="Password must be at least 6 characters long, with one uppercase letter, one digit, and one special character."
          />
          <Button className="mt-2" type="submit">
            Submit
          </Button>
        </form>
        <div className="flex justify-center gap-2">
          Don't have an account?{" "}
          <span
            className="text-slate-300 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import "./Signin.style.css";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import { Loader } from "../../components/loader/Loader";
import { DisplayError } from "../../components/display_error/DisplayError";
import { useEffect } from "react";

type SigninForm = {
  username: string;
  password: string;
};

export const Signin = () => {
  const navigate = useNavigate();
  // const [userData, setUserData] = useRecoilState(userDataAtom);
  const { userData, isLoading, error, signin } = useUser();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SigninForm>();

  const onSubmit: SubmitHandler<SigninForm> = (data) => {
    signin(data.username, data.password);
  };

  // if already signed in, redirect to "/"
  useEffect(() => {
    if (userData.user_id) {
      // navigate back to where you came here
      navigate(-1);
    }
  }, [userData, navigate]);

  return (
    <div className="signin-container">
      <div className={`signin-form ${(isLoading || error) && "invisible"}`}>
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
      {isLoading && <Loader />}
      {error && (
        <DisplayError errorMessage="Error Signing In, Try Again Later" />
      )}
    </div>
  );
};

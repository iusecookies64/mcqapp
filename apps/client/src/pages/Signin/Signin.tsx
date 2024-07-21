import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/Loader";
import { DisplayInfo } from "../../components/DisplayInfo";
import ThemeToggle from "../../components/Theme";
import "./Signin.style.css";

type SigninForm = {
  username: string;
  password: string;
};

export const Signin = () => {
  const navigate = useNavigate();
  const { isLoading, error, signin } = useAuth();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SigninForm>();

  const onSubmit: SubmitHandler<SigninForm> = (data) => {
    signin(data.username, data.password);
  };

  return (
    <div className="signin-container">
      <div className="flex justify-between items-center px-12 py-6">
        <div className="text-2xl font-medium cursor-pointer;">MCQ Battle</div>
        <ThemeToggle />
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <div className={`signin-form ${(isLoading || error) && "invisible"}`}>
          <div className="text-2xl font-medium flex justify-center">
            Sign In
          </div>
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
      {isLoading && <Loader />}
      {error && (
        <DisplayInfo type="error" message="Error Signing In, Try Again Later" />
      )}
    </div>
  );
};

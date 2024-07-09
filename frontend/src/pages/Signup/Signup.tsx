import { useRef } from "react";
import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import "./Signup.style.css";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import { Loader } from "../../components/loader/Loader";
import { DisplayError } from "../../components/display_error/DisplayError";
import ThemeToggle from "../../components/theme/ThemeToggle";

type SignupForm = {
  username: string;
  password: string;
  email: string;
};

export const Signup = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { isLoading, error, signup } = useUser();
  const navigate = useNavigate();
  // if logged in go to home page
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignupForm>();

  const onSubmit: SubmitHandler<SignupForm> = (data) => {
    signup(data.username, data.email, data.password);
  };

  return (
    <div className="signup-container">
      <div className="flex justify-between items-center px-12 py-6">
        <div className="text-2xl font-medium cursor-pointer;">MCQ Battle</div>
        <ThemeToggle />
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <div className={`signup-form ${(isLoading || error) && "invisible"}`}>
          <div className="text-2xl font-medium flex justify-center">
            Sign Up
          </div>
          <form
            ref={formRef}
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
              inputLabel="Email"
              inputType="text"
              placeholder="john@gmail.com"
              register={register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              })}
              error={errors.email}
              errorMessage="Enter a valid email"
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
              errorMessage="Password must be at least 6 characters long and include at least one uppercase letter, one digit, and one special character."
            />
            <Button className="mt-2" type="submit">
              Submit
            </Button>
          </form>
          <div className="flex justify-center gap-2">
            Already have an account?{" "}
            <span
              className="text-slate-300 cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
      {error && (
        <DisplayError errorMessage="Error Signing Up, Try Again Later" />
      )}
    </div>
  );
};

import { Button } from "@mcqapp/ui";
import { Input } from "../../components/Input";
import "./Signup.style.css";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/Loader";
import { DisplayInfo } from "../../components/DisplayInfo";
import ThemeToggle from "../../components/Theme";
import { SignupInput } from "@mcqapp/validations";

export const Signup = () => {
  const { isLoading, error, signup } = useAuth();
  const navigate = useNavigate();
  // if logged in go to home page
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SignupInput>();

  const onSubmit: SubmitHandler<SignupInput> = (data) => {
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
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <Input
              inputLabel="First Name"
              inputType="text"
              placeholder="john"
              register={register("username", { required: true })}
              error={errors.username}
              errorMessage="Username is required"
            />
            <Input
              inputLabel="Last Name"
              inputType="text"
              placeholder="john"
              register={register("lastName", { required: true })}
              error={errors.username}
              errorMessage="Username is required"
            />
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
            <Input
              inputLabel="Confirm Password"
              inputType="text"
              placeholder="*******"
              register={register("confirmPassword", {
                required: true,
                validate: (value) => value === watch("password"),
              })}
              error={errors.confirmPassword}
              errorMessage="Confirm Password Does Not Match Password"
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
        <DisplayInfo type="error" message="Error Signing Up, Try Again Later" />
      )}
    </div>
  );
};
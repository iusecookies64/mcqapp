import Button from "../../components/Button";
import Input from "../../components/Input";
import "./Signup.style.css";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/Loader";
import DisplayInfo from "../../components/DisplayInfo";
import { SignupBody } from "@mcqapp/validations";
import { toast } from "react-toastify";

export const Signup = () => {
  const { isLoading, error, signup } = useAuth();
  const navigate = useNavigate();
  // if logged in go to home page
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<SignupBody>();

  const onSubmit: SubmitHandler<SignupBody> = (data) => {
    signup(data, () => {
      toast.success("Account Created Successfully");
      navigate("/signin");
      reset();
    });
  };

  return (
    <div className="signup-container">
      <div className="w-full h-full flex justify-center items-center">
        <div className={`signup-form ${(isLoading || error) && "invisible"}`}>
          <div className="text-2xl font-medium flex justify-center">
            Create New Account
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
          >
            <div className="flex gap-4">
              <Input
                inputLabel="First Name"
                inputType="text"
                placeholder="john"
                register={register("first_name", { required: true })}
                error={errors.first_name}
                errorMessage="First Name is required"
              />
              <Input
                inputLabel="Last Name"
                inputType="text"
                placeholder="john"
                register={register("last_name", { required: true })}
                error={errors.last_name}
                errorMessage="Last Name is required"
              />
            </div>
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
              register={register("confirm_password", {
                required: true,
                validate: (value) => value === watch("password"),
              })}
              error={errors.confirm_password}
              errorMessage="Confirm Password Does Not Match Password"
            />
            <Button className="mt-2" type="submit">
              Submit
            </Button>
          </form>
          <div className="flex justify-center gap-2">
            Already have an account?{" "}
            <span
              className="text-indigo-500 cursor-pointer"
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

import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { Loader } from "../../components/Loader";
import DisplayInfo from "../../components/DisplayInfo";
import { SigninBody } from "@mcqapp/validations";
import "./Signin.style.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../components/AuthContext";
import { toast } from "react-toastify";

export const Signin = () => {
  const navigate = useNavigate();
  const { isLoading, error, signin } = useAuth();
  const { user, setUser } = useContext(AuthContext);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SigninBody>();

  const onSubmit: SubmitHandler<SigninBody> = (data) => {
    signin(data, (user) => {
      toast.success("Logged In Successfully");
      if (setUser) setUser(user);
    });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="signin-container">
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
              })}
              error={errors.password}
              errorMessage="Password is required"
            />
            <Button className="mt-2" type="submit">
              Submit
            </Button>
          </form>
          <div className="flex justify-center gap-2">
            Don't have an account?{" "}
            <span
              className="text-indigo-500 cursor-pointer"
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
